import { BedrockResponse, generateFallbackResponse, isRetryableError } from './bedrock-client';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { DimensionScores } from '../storage/types';

const comprehendClient = new ComprehendClient({
  region: process.env.COMPREHEND_REGION || 'us-east-1',
});

export interface ErrorHandlingResult {
  response: BedrockResponse;
  usedFallback: boolean;
  error?: string;
}

/**
 * Handles Bedrock errors with graceful degradation
 */
export async function handleBedrockError(
  error: Error,
  content: string
): Promise<ErrorHandlingResult> {
  console.error('Bedrock error occurred:', error.message);

  // Check if error is retryable
  if (isRetryableError(error)) {
    console.log('Error is retryable, but max retries reached');
  }

  // Attempt fallback to Comprehend-only analysis
  try {
    console.log('Attempting fallback to Comprehend analysis');
    const fallbackResponse = await generateComprehendFallback(content);
    
    return {
      response: fallbackResponse,
      usedFallback: true,
      error: error.message,
    };
  } catch (fallbackError) {
    console.error('Fallback analysis also failed:', fallbackError);
    
    // Return minimal fallback response
    return {
      response: generateFallbackResponse(),
      usedFallback: true,
      error: `Primary and fallback analysis failed: ${error.message}`,
    };
  }
}

/**
 * Generates analysis using AWS Comprehend only
 */
async function generateComprehendFallback(content: string): Promise<BedrockResponse> {
  // Detect sentiment using Comprehend
  const sentimentCommand = new DetectSentimentCommand({
    Text: content.substring(0, 5000), // Comprehend has 5KB limit
    LanguageCode: 'en',
  });

  const sentimentResponse = await comprehendClient.send(sentimentCommand);
  
  // Map sentiment to tone score
  const toneScore = mapSentimentToScore(sentimentResponse.Sentiment || 'NEUTRAL');
  
  // Generate basic scores based on content analysis
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  // Structure score based on sentence length
  const structureScore = calculateStructureScore(avgWordsPerSentence);
  
  // Accessibility score based on word and sentence complexity
  const accessibilityScore = calculateAccessibilityScore(content, avgWordsPerSentence);
  
  // Platform alignment - default to moderate
  const platformScore = 60;

  const dimensionScores: DimensionScores = {
    structure: {
      score: structureScore,
      confidence: 0.5,
      issues: [],
      strengths: avgWordsPerSentence < 25 ? ['Clear sentence structure'] : [],
    },
    tone: {
      score: toneScore,
      confidence: 0.6,
      issues: [],
      strengths: [],
    },
    accessibility: {
      score: accessibilityScore,
      confidence: 0.5,
      issues: [],
      strengths: [],
    },
    platformAlignment: {
      score: platformScore,
      confidence: 0.4,
      issues: [],
      strengths: [],
    },
  };

  const overallScore = Math.round(
    (structureScore + toneScore + accessibilityScore + platformScore) / 4
  );

  return {
    dimensionScores,
    overallScore,
    suggestions: [
      {
        priority: 'medium',
        category: 'system',
        title: 'Limited Analysis',
        description: 'This analysis uses basic metrics only. For detailed feedback, please try again later.',
        reasoning: 'Advanced AI analysis is temporarily unavailable.',
        examples: [],
      },
    ],
  };
}

/**
 * Maps AWS Comprehend sentiment to tone score
 */
function mapSentimentToScore(sentiment: string): number {
  const sentimentScores: Record<string, number> = {
    POSITIVE: 80,
    NEUTRAL: 70,
    NEGATIVE: 50,
    MIXED: 60,
  };

  return sentimentScores[sentiment] || 60;
}

/**
 * Calculates structure score based on sentence complexity
 */
function calculateStructureScore(avgWordsPerSentence: number): number {
  // Ideal range: 15-20 words per sentence
  if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
    return 85;
  } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
    return 70;
  } else if (avgWordsPerSentence < 10) {
    return 60; // Too short
  } else {
    return 50; // Too long
  }
}

/**
 * Calculates accessibility score based on readability
 */
function calculateAccessibilityScore(content: string, avgWordsPerSentence: number): number {
  const words = content.split(/\s+/);
  const longWords = words.filter(word => word.length > 12).length;
  const longWordRatio = longWords / words.length;

  // Penalize for long words and complex sentences
  let score = 80;
  
  if (longWordRatio > 0.15) {
    score -= 20; // Too many long words
  } else if (longWordRatio > 0.10) {
    score -= 10;
  }

  if (avgWordsPerSentence > 25) {
    score -= 15; // Sentences too long
  } else if (avgWordsPerSentence > 20) {
    score -= 5;
  }

  return Math.max(score, 40);
}

/**
 * Handles incomplete Bedrock responses
 */
export function handleIncompleteResponse(
  partialResponse: Partial<BedrockResponse>
): BedrockResponse {
  console.warn('Received incomplete response from Bedrock');

  const fallback = generateFallbackResponse();

  return {
    dimensionScores: partialResponse.dimensionScores || fallback.dimensionScores,
    overallScore: partialResponse.overallScore ?? fallback.overallScore,
    suggestions: partialResponse.suggestions || fallback.suggestions,
  };
}

/**
 * Validates response completeness
 */
export function isResponseComplete(response: Partial<BedrockResponse>): boolean {
  if (!response.dimensionScores) return false;
  if (response.overallScore === undefined) return false;
  
  const requiredDimensions = ['structure', 'tone', 'accessibility', 'platformAlignment'];
  for (const dimension of requiredDimensions) {
    if (!response.dimensionScores[dimension as keyof DimensionScores]) {
      return false;
    }
  }

  return true;
}
