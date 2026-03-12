import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminContest, getContests, getContestResults } from '../../../data/adminApi';
import { Clock, Users, ExternalLink, Trophy } from 'lucide-react';

const REGISTERED_KEY = 'student.registered.contests';
function getRegistered(): string[] {
  try { return JSON.parse(localStorage.getItem(REGISTERED_KEY) ?? '[]'); } catch { return []; }
}
function saveRegistered(ids: string[]) { localStorage.setItem(REGISTERED_KEY, JSON.stringify(ids)); }

const statusStyle: Record<string, string> = {
  Live: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Upcoming: 'bg-sky-100 text-sky-700 border-sky-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function StudentContests() {
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [registered, setRegisteredState] = useState<string[]>(getRegistered());
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const sync = () => setContests(getContests());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const filtered = useMemo(() =>
    statusFilter === 'All' ? contests : contests.filter((c) => c.status === statusFilter),
    [contests, statusFilter],
  );

  const toggleRegister = (id: string) => {
    const updated = registered.includes(id) ? registered.filter((x) => x !== id) : [...registered, id];
    saveRegistered(updated);
    setRegisteredState(updated);
  };

  const statCounts = { Live: contests.filter((c) => c.status === 'Live').length, Upcoming: contests.filter((c) => c.status === 'Upcoming').length, Completed: contests.filter((c) => c.status === 'Completed').length };

  return (
    <StudentPageFrame title="Contests" subtitle="Join live and upcoming competitions. Register and track your performance.">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {(['Live', 'Upcoming', 'Completed'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`border rounded-xl p-3 text-center transition-colors ${statusFilter === s ? statusStyle[s] + ' border-current' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
              <p className="text-xl font-bold text-slate-900">{statCounts[s]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s}</p>
            </button>
          ))}
        </div>

        {/* contest cards */}
        <div className="space-y-3">
          {filtered.map((contest) => {
            const results = contest.status === 'Completed' ? getContestResults(contest.id) : [];
            const isReg = registered.includes(contest.id);
            return (
              <div key={contest.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium ${statusStyle[contest.status]}`}>{contest.status}</span>
                      {contest.status === 'Live' && <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium animate-pulse">● LIVE</span>}
                    </div>
                    <p className="font-semibold text-slate-900">{contest.title}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{contest.durationMinutes} min</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{contest.participants} participants</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" />{contest.problemIds.length} problems</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/student/contests/${contest.id}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </Link>
                    {contest.status !== 'Completed' && (
                      <button
                        onClick={() => toggleRegister(contest.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isReg ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >{isReg ? '✓ Registered' : 'Register'}</button>
                    )}
                  </div>
                </div>
                {contest.status === 'Completed' && results.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Top Results</p>
                    <div className="flex gap-4">
                      {results.slice(0, 3).map((r) => (
                        <span key={r.rank} className="text-xs text-slate-600">#{r.rank} {r.user} ({r.solved} solved)</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-slate-400">No contests found.</p>}
        </div>
      </div>
    </StudentPageFrame>
  );
}
