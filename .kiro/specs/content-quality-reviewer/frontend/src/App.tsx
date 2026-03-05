import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import ProcessingState from './components/ProcessingState';
import ResultsDashboard from './components/ResultsDashboard';
import History from './components/History';
import Settings from './components/Settings';

type Screen = 'landing' | 'login' | 'signup' | 'dashboard' | 'processing' | 'results' | 'history' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [contentToAnalyze, setContentToAnalyze] = useState('');
  const [analysisConfig, setAnalysisConfig] = useState({
    platform: 'Blog',
    intent: 'Inform'
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const startAnalysis = (content: string, config: any) => {
    setContentToAnalyze(content);
    setAnalysisConfig(config);
    setCurrentScreen('processing');
    
    // Simulate AI processing and generate results
    setTimeout(() => {
      const results = {
        overallScore: Math.floor(Math.random() * 20) + 75, // 75-95
        content: content,
        config: config,
        timestamp: new Date().toISOString()
      };
      setAnalysisResults(results);
      setCurrentScreen('results');
    }, 4000);
  };

  const editContent = () => {
    // Go back to dashboard with the content pre-filled
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'signup':
        return <SignUp onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} onStartAnalysis={startAnalysis} initialContent={contentToAnalyze} />;
      case 'processing':
        return <ProcessingState />;
      case 'results':
        return <ResultsDashboard onNavigate={navigate} content={contentToAnalyze} onEditContent={editContent} results={analysisResults} />;
      case 'history':
        return <History onNavigate={navigate} />;
      case 'settings':
        return <Settings onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
}