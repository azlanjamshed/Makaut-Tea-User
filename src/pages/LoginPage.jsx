import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import appLogo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      showToast('Welcome back to CampusRant! 🔥', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Link to="/" className="inline-block group mb-3">
          <div className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-[var(--border-color)] group-hover:scale-105 transition-transform bg-white shadow-md">
            <img src={appLogo} alt="Rantea" className="w-full h-full object-cover" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
          Ran<span className="text-[var(--color-primary)]">tea</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] mt-1 max-w-xs leading-relaxed">
          Your own ranting platform
        </p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
          Campus confessions, anonymous thoughts & unfiltered tea.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Sign in to react, post rants, and join the conversation.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="College Email"
            type="email"
            placeholder="student@college.edu"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              isPassword
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => showToast('Password reset: Contact admin or check campus guidelines', 'info')}
                className="text-xs text-slate-500 hover:text-[var(--color-primary)] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full text-base font-bold"
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Register here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
