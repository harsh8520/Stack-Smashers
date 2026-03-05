import { useState } from 'react';
import { Zap, Mail, Lock, Github, Chrome } from 'lucide-react';

type LoginProps = {
  onNavigate: (screen: 'landing' | 'login' | 'signup' | 'dashboard' | 'processing' | 'results' | 'history' | 'settings') => void;
};

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    console.log(`Logging in with ${provider}`);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-gray-600">Log in to your ContentLens AI account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-[#E5E7EB]" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-[#2563EB] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            <span className="text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              type="button"
              className="py-2 px-4 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              type="button"
              className="py-2 px-4 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('signup')}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Sign up
          </button>
        </p>

        {/* Back to Home */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-sm text-gray-600 hover:text-gray-900 mx-auto block mt-4"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}