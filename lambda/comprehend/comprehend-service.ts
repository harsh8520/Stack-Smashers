import {
  ComprehendClient,
  DetectSentimentCommand,
  DetectKeyPhrasesCommand,
  DetectSyntaxCommand,
  SentimentType,
} from '@aws-sdk/client-comprehend';

const client = new ComprehendClient({
  region: process.env.COMPREHEND_REGION || 'us-east-1',
});

const MAX_TEXT_LENGTH = 5000; // Comprehend has 5KB limit per request

export interface SentimentResult {
  sentiment: SentimentType;
  sentimentScore: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
}

export interface KeyPhrase {
  text: string;
  score: number;
  beginOffset: number;
  endOffset: number;
}

export interface SyntaxToken {
  text: string;
  partOfSpeech: string;
  beginOffset: number;
  endOffset: number;
}

export interface ComprehendAnalysis {
  sentiment: SentimentResult;
  keyPhrases: KeyPhrase[];
  syntaxTokens: SyntaxToken[];
}

/**
 * Analyzes sentiment of the content
 */
export async function analyzeSentiment(content: string): Promise<SentimentResult> {
  try {
    const truncatedContent = truncateText(content);
    
    const command = new DetectSentimentCommand({
      Text: truncatedContent,
      LanguageCode: 'en',
    });

    const response = await client.send(command);

    return {
      sentiment: response.Sentiment || 'NEUTRAL',
      sentimentScore: {
        positive: response.SentimentScore?.Positive || 0,
        negative: response.SentimentScore?.Negative || 0,
        neutral: response.SentimentScore?.Neutral || 0,
        mixed: response.SentimentScore?.Mixed || 0,
      },
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
}

/**
 * Extracts key phrases from the content
 */
export async function extractKeyPhrases(content: string): Promise<KeyPhrase[]> {
  try {
    const truncatedContent = truncateText(content);
    
    const command = new DetectKeyPhrasesCommand({
      Text: truncatedContent,
      LanguageCode: 'en',
    });

    const response = await client.send(command);

    return (response.KeyPhrases || []).map(phrase => ({
      text: phrase.Text || '',
      score: phrase.Score || 0,
      beginOffset: phrase.BeginOffset || 0,
      endOffset: phrase.EndOffset || 0,
    }));
  } catch (error) {
    console.error('Error extracting key phrases:', error);
    throw new Error('Failed to extract key phrases');
  }
}

/**
 * Analyzes syntax and parts of speech
 */
export async function analyzeSyntax(content: string): Promise<SyntaxToken[]> {
  try {
    const truncatedContent = truncateText(content);
    
    const command = new DetectSyntaxCommand({
      Text: truncatedContent,
      LanguageCode: 'en',
    });

    const response = await client.send(command);

    return (response.SyntaxTokens || []).map(token => ({
      text: token.Text || '',
      partOfSpeech: token.PartOfSpeech?.Tag || 'UNKNOWN',
      beginOffset: token.BeginOffset || 0,
      endOffset: token.EndOffset || 0,
    }));
  } catch (error) {
    console.error('Error analyzing syntax:', error);
    throw new Error('Failed to analyze syntax');
  }
}

/**
 * Performs complete Comprehend analysis
 */
export async function performComprehendAnalysis(content: string): Promise<ComprehendAnalysis> {
  try {
    // Run all analyses in parallel for better performance
    const [sentiment, keyPhrases, syntaxTokens] = await Promise.all([
      analyzeSentiment(content),
      extractKeyPhrases(content),
      analyzeSyntax(content),
    ]);

    return {
      sentiment,
      keyPhrases,
      syntaxTokens,
    };
  } catch (error) {
    console.error('Error performing Comprehend analysis:', error);
    throw error;
  }
}

/**
 * Truncates text to fit Comprehend's size limit
 */
function truncateText(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) {
    return text;
  }

  console.warn(`Text truncated from ${text.length} to ${MAX_TEXT_LENGTH} characters`);
  return text.substring(0, MAX_TEXT_LENGTH);
}

/**
 * Calculates average sentence length from syntax tokens
 */
export function calculateAverageSentenceLength(syntaxTokens: SyntaxToken[]): number {
  const sentences = syntaxTokens.filter(token => token.partOfSpeech === 'PUNCT' && ['.', '!', '?'].includes(token.text));
  const words = syntaxTokens.filter(token => ['NOUN', 'VERB', 'ADJ', 'ADV'].includes(token.partOfSpeech));

  if (sentences.length === 0) return 0;
  return words.length / sentences.length;
}

/**
 * Identifies complex words (more than 3 syllables)
 */
export function identifyComplexWords(syntaxTokens: SyntaxToken[]): string[] {
  return syntaxTokens
    .filter(token => token.text.length > 12) // Simple heuristic for complex words
    .map(token => token.text);
}

/**
 * Extracts main topics from key phrases
 */
export function extractMainTopics(keyPhrases: KeyPhrase[], topN: number = 5): string[] {
  return keyPhrases
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(phrase => phrase.text);
}

/**
 * Maps sentiment to tone description
 */
export function mapSentimentToTone(sentiment: SentimentType): string {
  const toneMap: Record<string, string> = {
    POSITIVE: 'Optimistic and encouraging',
    NEGATIVE: 'Critical or concerning',
    NEUTRAL: 'Balanced and objective',
    MIXED: 'Varied emotional tone',
  };

  return toneMap[sentiment] || 'Neutral';
}

/**
 * Calculates readability metrics
 */
export function calculateReadabilityMetrics(content: string, syntaxTokens: SyntaxToken[]): {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  complexWordCount: number;
} {
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const complexWords = identifyComplexWords(syntaxTokens);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
    complexWordCount: complexWords.length,
  };
}
