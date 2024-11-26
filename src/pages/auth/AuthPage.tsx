// pages/auth/AuthPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1c1c1c]">
      <div className="w-full max-w-[900px] h-[400px] flex mx-auto my-auto bg-black rounded-lg overflow-hidden border border-gray-800">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white p-10">
          <h1 className="text-2xl font-medium mb-8">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block uppercase text-xs font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-md outline-none"
                placeholder="Email"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block uppercase text-xs font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-md outline-none"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading 
                ? (isSignIn ? 'Signing in...' : 'Creating account...') 
                : (isSignIn ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

        {/* Right Side - Logo & Switch */}
        <div className="w-1/2 bg-black p-10 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-black rounded-full border-2 border-white flex items-center justify-center mb-2">
              <img
                src="/api/placeholder/64/64"
                alt="Overdog Logo"
                className="w-10 h-10"
              />
            </div>
            <div className="text-[#9CA38F] text-center">OVERDOG</div>
          </div>

          <h2 className="text-white text-2xl font-medium mb-2">
            {isSignIn ? 'Welcome back!' : 'Already have an account?'}
          </h2>
          
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}