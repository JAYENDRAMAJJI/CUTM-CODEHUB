import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { UserPlus, Github, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

export default function StudentRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'ADMIN') {
      navigate('/admin/login');
      return;
    }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!agreed) { setError('Please accept the terms and conditions'); return; }
    login('STUDENT');
    navigate('/student/email-verification');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">Student Sign Up</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Start your coding journey today</p>
        <div className="mt-3 flex justify-center">
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${
                role === 'STUDENT' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${
                role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
        {role === 'ADMIN' && (
          <p className="text-xs text-slate-500 mt-2 text-center">Admin accounts are managed separately. Use Admin Login.</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 space-y-5">

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Student" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" required />
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" required />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                title={showConfirm ? "Hide password" : "Show password"}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-slate-300" />
            <span>I agree to the <span className="text-indigo-600">Terms of Service</span> and <span className="text-indigo-600">Privacy Policy</span></span>
          </label>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm">
            <UserPlus className="w-4 h-4" />
            {role === 'ADMIN' ? 'Continue to Admin Login' : 'Create Account'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400">or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => { login('STUDENT'); navigate('/student/dashboard'); }} className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer" title="Sign up with Google" aria-label="Sign up with Google">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" onClick={() => { login('STUDENT'); navigate('/student/dashboard'); }} className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-300 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer" title="Sign up with GitHub" aria-label="Sign up with GitHub">
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/student/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
        </p>
        <p className="text-center text-xs text-slate-500">
          Admin role? <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Go to Admin Login</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
