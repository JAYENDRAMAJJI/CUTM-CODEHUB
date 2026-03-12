import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Play, Plus, Search, Square, Timer, Trophy, Trash2 } from 'lucide-react';
import {
  AdminContest,
  deleteContest,
  formatContestDuration,
  getContests,
  startContest,
  stopContest,
} from '../../data/adminApi';

export default function AdminContests() {
  const navigate = useNavigate();
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setContests(getContests());
  }, []);

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      return (
        contest.title.toLowerCase().includes(search.toLowerCase()) ||
        contest.id.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [contests, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contest Management</h1>
          <p className="text-slate-500 mt-1">Schedule and monitor coding contests.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
          onClick={() => navigate('/admin/contests/create')}
          title="Create contest"
          aria-label="Create contest"
        >
          <Plus className="w-4 h-4" />
          Create Contest
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contest"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredContests.map((contest) => (
            <div key={contest.id} className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-slate-50">
              <div>
                <p className="text-base font-semibold text-slate-900">{contest.title}</p>
                <p className="text-xs font-mono text-slate-500 mt-1">{contest.id}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1"><Timer className="w-4 h-4" /> {formatContestDuration(contest.durationMinutes)}</span>
                  <span>{contest.startAt}</span>
                  <span>{contest.problemIds.length} problems</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">{contest.participants} participants</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  contest.status === 'Live'
                    ? 'bg-emerald-100 text-emerald-700'
                    : contest.status === 'Upcoming'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {contest.status}
                </span>
                <button
                  title={`View results for ${contest.title}`}
                  aria-label={`View results for ${contest.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => navigate(`/admin/contests/${contest.id}/results`)}
                >
                  <Trophy className="w-4 h-4" />
                </button>
                <button
                  title={`Edit ${contest.title}`}
                  aria-label={`Edit ${contest.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {contest.status === 'Upcoming' ? (
                  <button
                    title={`Start ${contest.title}`}
                    aria-label={`Start ${contest.title}`}
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50"
                    onClick={() => setContests(startContest(contest.id))}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : contest.status === 'Live' ? (
                  <button
                    title={`Stop ${contest.title}`}
                    aria-label={`Stop ${contest.title}`}
                    className="p-2 rounded-lg text-amber-700 hover:bg-amber-50"
                    onClick={() => setContests(stopContest(contest.id))}
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  title={`Delete ${contest.title}`}
                  aria-label={`Delete ${contest.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setContests(deleteContest(contest.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
