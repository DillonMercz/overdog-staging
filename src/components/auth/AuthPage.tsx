import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

type AuthPageProps = {
  isSignIn?: boolean;
};

const AuthPage = ({ isSignIn = false }: AuthPageProps) => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, loading, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        // On successful signup, redirect to signin
        navigate('/signin');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="text-white">Checking authentication status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="w-full max-w-[900px] h-[400px] flex bg-black rounded-lg overflow-hidden border border-gray-800">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white p-10">
          <h1 className="text-2xl font-medium mb-8">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-1">
                <label className="block uppercase text-xs font-medium text-gray-900">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-md outline-none"
                  placeholder="Username"
                  disabled={loading}
                />
              </div>
            )}

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>

              {isSignIn && (
                <a href="#" className="text-sm text-gray-600">
                  Forgot Password
                </a>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isSignIn ? 'Sign In' : 'Sign Up'
              )}
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

          <a
            href={isSignIn ? '/signup' : '/signin'}
            className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;