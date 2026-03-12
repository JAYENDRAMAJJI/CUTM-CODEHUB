import { useEffect, useMemo, useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock3, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';
import { AdminSubmission, getSubmissionMonitoringSummary, getSubmissions } from '../../data/adminApi';

type SubmissionView = 'ALL' | 'PLAGIARISM' | 'CHEATING';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<SubmissionView>('ALL');

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  const summary = useMemo(() => getSubmissionMonitoringSummary(), [submissions]);

  const filteredSubmissions = useMemo(() => {
    const q = search.toLowerCase();
    return submissions
      .filter((row) => {
        if (view === 'PLAGIARISM') {
          return row.plagiarismDetected;
        }
        if (view === 'CHEATING') {
          return row.cheatingFlags.length > 0;
        }
        return true;
      })
      .filter((row) => {
      return (
        row.id.toLowerCase().includes(q) ||
        row.user.toLowerCase().includes(q) ||
        row.problem.toLowerCase().includes(q)
      );
      })
      .sort((a, b) => b.plagiarismScore - a.plagiarismScore);
  }, [search, submissions, view]);

  const runDetection = () => {
    // Detection is recalculated in the data layer when records are loaded.
    setSubmissions(getSubmissions());
  };

  const riskTone = (row: AdminSubmission): string => {
    if (row.plagiarismScore >= 80 || row.cheatingFlags.length >= 2) {
      return 'bg-red-100 text-red-700';
    }
    if (row.plagiarismScore >= 60 || row.cheatingFlags.length === 1) {
      return 'bg-amber-100 text-amber-700';
    }
    return 'bg-emerald-100 text-emerald-700';
  };

  const riskLabel = (row: AdminSubmission): string => {
    if (row.plagiarismScore >= 80 || row.cheatingFlags.length >= 2) {
      return 'High Risk';
    }
    if (row.plagiarismScore >= 60 || row.cheatingFlags.length === 1) {
      return 'Medium Risk';
    }
    return 'Low Risk';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submission Monitoring</h1>
        <p className="text-slate-500 mt-1">View all submissions, detect plagiarism, and monitor cheating signals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Plagiarism Detected</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{summary.plagiarismDetected}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Cheating Flagged</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{summary.cheatingFlagged}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">High Risk</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{summary.highRisk}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by submission, user, or problem"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-2 text-xs rounded-lg border ${view === 'ALL' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-700'}`}
              onClick={() => setView('ALL')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-xs rounded-lg border ${view === 'PLAGIARISM' ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-200 text-slate-700'}`}
              onClick={() => setView('PLAGIARISM')}
            >
              Plagiarism
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-xs rounded-lg border ${view === 'CHEATING' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-200 text-slate-700'}`}
              onClick={() => setView('CHEATING')}
            >
              Cheating
            </button>
            <button
              type="button"
              onClick={runDetection}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Run Detection
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3">Submission ID</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Problem</th>
                <th className="px-5 py-3">Language</th>
                <th className="px-5 py-3">Verdict</th>
                <th className="px-5 py-3">Plagiarism</th>
                <th className="px-5 py-3">Cheating Flags</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.id}</td>
                  <td className="px-5 py-3 text-slate-900 font-medium">{row.user}</td>
                  <td className="px-5 py-3 text-slate-700">{row.problem}</td>
                  <td className="px-5 py-3 text-slate-700">{row.language}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      row.verdict === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : row.verdict === 'Wrong Answer'
                        ? 'bg-red-100 text-red-700'
                        : row.verdict === 'Time Limit Exceeded'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {row.verdict === 'Accepted' ? <CheckCircle2 className="w-3 h-3" /> : null}
                      {row.verdict === 'Wrong Answer' ? <XCircle className="w-3 h-3" /> : null}
                      {row.verdict === 'Time Limit Exceeded' ? <Clock3 className="w-3 h-3" /> : null}
                      {row.verdict}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      row.plagiarismDetected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {row.plagiarismDetected ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {row.plagiarismScore}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {row.cheatingFlags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-60">
                        {row.cheatingFlags.map((flag) => (
                          <span key={`${row.id}-${flag}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-700">
                            <ShieldAlert className="w-3 h-3" />
                            {flag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${riskTone(row)}`}>
                      {riskLabel(row)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-slate-500">{row.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
