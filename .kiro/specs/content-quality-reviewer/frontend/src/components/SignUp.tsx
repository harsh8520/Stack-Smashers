import { useState } from 'react';
import { Zap, Mail, Lock, User, Chrome, Github, Shield, CheckCircle2 } from 'lucide-react';

type SignUpProps = {
  onNavigate: (screen: 'landing' | 'login' | 'signup' | 'dashboard' | 'processing' | 'results' | 'history' | 'settings') => void;
};

export default function SignUp({ onNavigate }: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  const handleSocialSignUp = (provider: 'Google' | 'GitHub') => {
    // Add logic to handle social sign-up
    console.log(`Signing up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-sm text-gray-600">Start reviewing content with AI today</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            <span className="text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSocialSignUp('Google')}
              type="button"
              className="py-2 px-4 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              onClick={() => handleSocialSignUp('GitHub')}
              type="button"
              className="py-2 px-4 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium mb-1">Your privacy matters</h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    We never share your content with third parties
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    All data is encrypted in transit and at rest
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    You can delete your account anytime
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#2563EB] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#2563EB] hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Log in
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