/**
 * Type definitions for storage service
 */

export interface QualityScore {
  score: number; // 0-100
  confidence: number; // 0-1
  issues: Issue[];
  strengths: string[];
}

export interface Issue {
  type: 'critical' | 'important' | 'minor';
  category: 'structure' | 'tone' | 'accessibility' | 'platform';
  description: string;
  location?: TextLocation;
  suggestion: string;
  reasoning: string;
}

export interface TextLocation {
  startIndex: number;
  endIndex: number;
  paragraph?: number;
  sentence?: number;
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  reasoning: string;
  examples?: string[];
  affectedText?: TextLocation[];
}

export interface DimensionScores {
  structure: QualityScore;
  tone: QualityScore;
  accessibility: QualityScore;
  platformAlignment: QualityScore;
}

export interface AnalysisMetadata {
  processingTime: number;
  contentLength: number;
  platformOptimized: boolean;
}

export interface AnalysisResult {
  analysisId: string;
  userId?: string;
  timestamp: string;
  content: string;
  targetPlatform: 'blog' | 'linkedin' | 'twitter' | 'medium';
  contentIntent: 'inform' | 'educate' | 'persuade';
  overallScore: number;
  dimensionScores: DimensionScores;
  suggestions: Suggestion[];
  metadata: AnalysisMetadata;
}

export interface DynamoDBRecord {
  userId: string;
  analysisId: string;
  timestamp: string;
  content: string;
  targetPlatform: string;
  contentIntent: string;
  overallScore: number;
  dimensionScores: DimensionScores;
  suggestions: Suggestion[];
  metadata: AnalysisMetadata;
  ttl: number;
}

export interface HistoryQueryParams {
  userId: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
  lastEvaluatedKey?: Record<string, any>;
}

export interface HistoryResult {
  analyses: AnalysisResult[];
  total: number;
  hasMore: boolean;
  lastEvaluatedKey?: Record<string, any>;
}
