import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LogIn, Github, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

export default function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login('STUDENT');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
            <LogIn className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">Student Login</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Sign in to your CodeLearn account</p>
        <div className="mt-3 flex justify-center">
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden bg-white">
            <span className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Student
            </span>
            <button type="button" onClick={() => navigate('/admin/login')} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 space-y-5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/student/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-slate-300" />
            Remember me
          </label>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm">
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { login('STUDENT'); navigate('/student/dashboard'); }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
            title="Sign in with Google"
            aria-label="Continue with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => { login('STUDENT'); navigate('/student/dashboard'); }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
            title="Sign in with GitHub"
            aria-label="Continue with GitHub"
          >
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-slate-600">
          New here? <Link to="/student/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Create account</Link>
        </p>
        <p className="text-center text-xs text-slate-500">
          Admin role? <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in as Administrator</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
