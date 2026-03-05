import { 
  ArrowLeft, 
  Download, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Info,
  Edit3
} from 'lucide-react';

type ResultsDashboardProps = {
  onNavigate: (screen: 'landing' | 'login' | 'signup' | 'dashboard' | 'processing' | 'results' | 'history' | 'settings') => void;
  content: string;
  onEditContent: () => void;
  results: any;
};

export default function ResultsDashboard({ onNavigate, content, onEditContent, results }: ResultsDashboardProps) {
  const overallScore = results?.overallScore || 82;
  
  const dimensionScores = [
    { name: 'Clarity', score: results?.clarity || 88, color: 'bg-blue-500' },
    { name: 'Tone', score: results?.tone || 85, color: 'bg-purple-500' },
    { name: 'Structure', score: results?.structure || 78, color: 'bg-green-500' },
    { name: 'Accessibility', score: results?.accessibility || 90, color: 'bg-orange-500' },
    { name: 'Engagement', score: results?.engagement || 75, color: 'bg-pink-500' },
    { name: 'Grammar', score: results?.grammar || 95, color: 'bg-indigo-500' },
  ];

  const strengths = [
    'Clear and concise language throughout',
    'Excellent grammar and punctuation',
    'Strong accessibility with inclusive language',
    'Good use of transition words and phrases'
  ];

  const improvements = [
    'Consider breaking up longer paragraphs for better readability',
    'Add more specific examples to support key points',
    'Strengthen the opening hook to increase engagement',
    'Include subheadings to improve content structure'
  ];

  const recommendations = [
    {
      title: 'Improve paragraph structure',
      description: 'Your third paragraph contains 6 sentences. Consider splitting it into 2 paragraphs for better scanability.',
      priority: 'high'
    },
    {
      title: 'Add concrete examples',
      description: 'Support your main argument with 1-2 specific examples or case studies to increase credibility.',
      priority: 'medium'
    },
    {
      title: 'Enhance opening',
      description: 'Start with a compelling question or surprising statistic to immediately capture reader attention.',
      priority: 'medium'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={onEditContent}
              className="px-4 py-2 border border-[#E5E7EB] bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Content
            </button>
            <button 
              onClick={() => alert('Report would be exported as PDF')}
              className="px-4 py-2 border border-[#E5E7EB] bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={() => {
                onNavigate('dashboard');
              }}
              className="px-4 py-2 bg-[#2563EB] text-white text-sm rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Review Another
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Analysis Results</h1>
          <p className="text-sm text-gray-600">Detailed AI-powered feedback on your content</p>
        </div>

        {/* Overall Score */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 mb-6">
          <div className="flex items-center gap-8">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#2563EB"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Overall Quality Score</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your content is performing well! With a few improvements, you can reach excellent quality.
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${getScoreBgColor(overallScore)} border rounded-lg text-sm font-medium`}>
                <TrendingUp className="w-4 h-4" />
                Good Quality - Ready to publish with minor edits
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {dimensionScores.map((dimension) => (
            <div key={dimension.name} className="bg-white border border-[#E5E7EB] rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">{dimension.name}</span>
                <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                  {dimension.score}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${dimension.color}`}
                  style={{ width: `${dimension.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold">Actionable Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-[#E5E7EB] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.priority === 'high' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable Reasoning */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold">Why This Score?</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Clarity (88/100):</strong> Your content uses straightforward language and avoids unnecessary jargon. However, some sentences exceed 25 words, which may reduce readability for some audiences.
            </p>
            <p>
              <strong className="text-gray-900">Tone (85/100):</strong> The voice is consistent and matches an informative intent. The professional tone is maintained throughout, though adding a slightly more conversational element could increase engagement.
            </p>
            <p>
              <strong className="text-gray-900">Structure (78/100):</strong> The logical flow is good, but the content would benefit from clearer section breaks and subheadings. This would make it easier for readers to scan and find information.
            </p>
            <p>
              <strong className="text-gray-900">Accessibility (90/100):</strong> Excellent use of inclusive language and clear explanations. The content is accessible to diverse audiences with varied reading levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}