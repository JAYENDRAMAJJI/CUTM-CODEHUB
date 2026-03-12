import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Code, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@codelearn.com');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = await loginAdmin(email, password);
    if (!result.success) {
      setErrorMessage(result.message || 'Unable to login.');
      setIsSubmitting(false);
      return;
    }

    navigate('/admin/dashboard', { replace: true });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
            <Code className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">Admin Login</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Secure administrator access only</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3 py-2 pr-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
          >
            <ShieldCheck className="w-5 h-5" />
            {isSubmitting ? 'Signing in...' : 'Sign in as Administrator'}
          </button>

          <p className="text-xs text-slate-500">
            Demo credentials: <span className="font-medium">admin@codelearn.com / Admin@123</span>
          </p>

          <p className="text-sm text-slate-600 text-center">
            Student? <Link to="/student/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Go to student login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
