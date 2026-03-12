import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        {!submitted ? (
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-3">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
              <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send a reset link</p>
            </div>
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
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
              >
                Send Reset Link
              </button>
            </form>
            <Link to="/student/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-2">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
            <p className="text-sm text-slate-500">
              We sent a password reset link to <span className="font-medium text-slate-700">{email}</span>.
              Check your inbox and follow the instructions.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Resend email
              </button>
              <Link
                to="/student/login"
                className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
