import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        if (isSignUp) {
            const { error: signUpError } = await signUp(email, password, name);
            if (signUpError) throw signUpError;
            alert('Account created successfully! You can now sign in.');
            setIsSignUp(false);
        } else {
            const { error: signInError } = await signIn(email, password);
            if (signInError) throw signInError;
            navigate('/');
        }
    } catch (err: any) {
        setError(err.message || 'Authentication failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                {isSignUp ? <UserPlus className="w-6 h-6 text-white" /> : <LogIn className="w-6 h-6 text-white" />}
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isSignUp ? 'Join the SIMS platform today' : 'Welcome back to SIMS'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
              </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                            id="name"
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign in')}
              </button>
            </div>
          </form>

          <div className="mt-6">
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or continue with</span>
                  </div>
              </div>

              <div className="mt-6">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                  >
                      {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
