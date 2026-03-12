import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function EmailVerification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const full = code.join('');
    if (full.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    // Simulate verification — any 6-digit code passes
    navigate('/student/dashboard');
  };

  const handleResend = () => {
    setResent(true);
    setCode(['', '', '', '', '', '']);
    setError('');
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="text-sm text-slate-500 mt-1">
            We sent a 6-digit code to
            <span className="font-medium text-slate-700"> {user?.email ?? 'your email'}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex justify-center gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                title={`Verification digit ${i + 1}`}
                aria-label={`Verification digit ${i + 1}`}
                placeholder="0"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {resent && <p className="text-sm text-emerald-600 text-center">Verification code resent!</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
          >
            Verify Account
          </button>
        </form>

        <div className="text-center space-y-2">
          <button
            onClick={handleResend}
            className="flex items-center justify-center gap-2 w-full text-sm text-slate-500 hover:text-indigo-600"
          >
            <RefreshCw className="w-4 h-4" />
            Resend code
          </button>
          <Link to="/student/login" className="block text-sm text-slate-400 hover:text-slate-600">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
