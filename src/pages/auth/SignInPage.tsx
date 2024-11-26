// pages/auth/SignInPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signIn } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
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
          <h1 className="text-2xl font-medium mb-8">Sign In</h1>
          
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              
              <Link to="/auth/forgot-password" className="text-sm text-gray-600">
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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

          <h2 className="text-white text-2xl font-medium mb-2">Welcome back!</h2>
          
          <Link
            to="/auth/signup"
            className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}