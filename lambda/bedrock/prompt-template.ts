/**
 * Bedrock prompt template module for content analysis
 */

export interface PromptInput {
  content: string;
  targetPlatform: 'blog' | 'linkedin' | 'twitter' | 'medium';
  contentIntent: 'inform' | 'educate' | 'persuade';
  wordCount: number;
}

/**
 * Constructs a structured prompt for Claude 3 Sonnet
 */
export function constructBedrockPrompt(input: PromptInput): string {
  const { content, targetPlatform, contentIntent, wordCount } = input;

  return `<system>
You are an expert content quality analyst helping student creators improve their digital content. Your role is to evaluate content across multiple quality dimensions and provide constructive, actionable feedback while preserving the creator's voice and intent.

Evaluation Dimensions:
1. Structural Clarity: Logical organization, flow, coherence
2. Tone Alignment: Consistency with platform norms
3. Audience Suitability: Vocabulary and framing appropriateness
4. Accessibility: Language simplicity, inclusiveness, readability

Provide scores (0-100) for each dimension with specific reasoning.
</system>

<content_to_analyze>
${content}
</content_to_analyze>

<analysis_context>
Target Platform: ${targetPlatform}
Content Intent: ${contentIntent}
Word Count: ${wordCount}
</analysis_context>

<instructions>
Analyze the content and provide:
1. A score (0-100) for each quality dimension
2. Specific issues found in each dimension
3. Strengths of the content
4. Actionable improvement suggestions prioritized by impact
5. Reasoning for each suggestion

Format your response as JSON:
{
  "dimensionScores": {
    "structure": {
      "score": <number>,
      "confidence": <0-1>,
      "issues": [{"type": "critical|important|minor", "description": "...", "location": "...", "suggestion": "...", "reasoning": "..."}],
      "strengths": ["..."]
    },
    "tone": {
      "score": <number>,
      "confidence": <0-1>,
      "issues": [{"type": "critical|important|minor", "description": "...", "location": "...", "suggestion": "...", "reasoning": "..."}],
      "strengths": ["..."]
    },
    "accessibility": {
      "score": <number>,
      "confidence": <0-1>,
      "issues": [{"type": "critical|important|minor", "description": "...", "location": "...", "suggestion": "...", "reasoning": "..."}],
      "strengths": ["..."]
    },
    "platformAlignment": {
      "score": <number>,
      "confidence": <0-1>,
      "issues": [{"type": "critical|important|minor", "description": "...", "location": "...", "suggestion": "...", "reasoning": "..."}],
      "strengths": ["..."]
    }
  },
  "overallScore": <number>,
  "suggestions": [
    {
      "priority": "high|medium|low",
      "category": "...",
      "title": "...",
      "description": "...",
      "reasoning": "...",
      "examples": ["..."]
    }
  ]
}
</instructions>`;
}

/**
 * Validates prompt input parameters
 */
export function validatePromptInput(input: Partial<PromptInput>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.content || input.content.trim().length === 0) {
    errors.push('Content cannot be empty');
  }

  if (input.content && input.content.length > 50000) {
    errors.push('Content exceeds maximum length');
  }

  const validPlatforms = ['blog', 'linkedin', 'twitter', 'medium'];
  if (!input.targetPlatform || !validPlatforms.includes(input.targetPlatform)) {
    errors.push(`Invalid platform. Supported: ${validPlatforms.join(', ')}`);
  }

  const validIntents = ['inform', 'educate', 'persuade'];
  if (!input.contentIntent || !validIntents.includes(input.contentIntent)) {
    errors.push(`Invalid intent. Supported: ${validIntents.join(', ')}`);
  }

  if (input.wordCount !== undefined && input.wordCount < 0) {
    errors.push('Word count cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Counts words in content
 */
export function countWords(content: string): number {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Extracts platform-specific guidance
 */
export function getPlatformGuidance(platform: string): string {
  const guidance: Record<string, string> = {
    linkedin: 'Professional tone, networking focus, industry relevance, call-to-action',
    blog: 'Depth, engagement potential, SEO considerations, clear structure',
    twitter: 'Conciseness, hashtag usage, engagement hooks, brevity',
    medium: 'Storytelling, depth, reader engagement, narrative flow',
  };

  return guidance[platform] || 'General content quality';
}

/**
 * Extracts intent-specific guidance
 */
export function getIntentGuidance(intent: string): string {
  const guidance: Record<string, string> = {
    inform: 'Factual clarity, information organization, credibility',
    educate: 'Instructional structure, learning progression, clarity',
    persuade: 'Argument strength, persuasive elements, call-to-action',
  };

  return guidance[intent] || 'General content effectiveness';
}
