import { useEffect, useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminSubmission, getSubmissions } from '../../../data/adminApi';

const verdictStyle: Record<string, string> = {
  Accepted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Wrong Answer': 'text-red-700 bg-red-50 border-red-200',
  'Time Limit Exceeded': 'text-amber-700 bg-amber-50 border-amber-200',
  'Runtime Error': 'text-orange-700 bg-orange-50 border-orange-200',
};

export default function StudentSubmissions() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const sync = () => setSubmissions(getSubmissions());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const filtered = filter === 'All' ? submissions : submissions.filter((s) => s.verdict === filter);

  const accepted = submissions.filter((s) => s.verdict === 'Accepted').length;
  const total = submissions.length;

  return (
    <StudentPageFrame title="Submissions" subtitle="Review your past attempts, verdicts, and submission history.">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total</p>
          </div>
          <div className="border border-emerald-200 rounded-xl p-3 text-center bg-emerald-50">
            <p className="text-xl font-bold text-emerald-700">{accepted}</p>
            <p className="text-xs text-emerald-600 mt-0.5">Accepted</p>
          </div>
          <div className="border border-red-200 rounded-xl p-3 text-center bg-red-50">
            <p className="text-xl font-bold text-red-700">{total - accepted}</p>
            <p className="text-xs text-red-600 mt-0.5">Failed</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'].map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === v ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >{v}</button>
          ))}
        </div>

        {/* Submission List */}
        <div className="space-y-2">
          {filtered.map((row) => (
            <div key={row.id} className="border border-slate-200 rounded-lg px-4 py-3 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-slate-400 w-20 shrink-0">{row.id}</span>
              <span className="flex-1 text-sm text-slate-800 truncate min-w-0">{row.problem}</span>
              <span className="text-xs text-slate-400 shrink-0">{row.language}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium shrink-0 ${verdictStyle[row.verdict] ?? 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                {row.verdict}
              </span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-400">No submissions found.</p>}
        </div>
      </div>
    </StudentPageFrame>
  );
}
