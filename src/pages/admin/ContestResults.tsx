import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Medal, Trophy } from 'lucide-react';
import {
  formatContestDuration,
  getContestById,
  getContestResults,
  getProblemById,
} from '../../data/adminApi';

export default function AdminContestResults() {
  const { contestId = '' } = useParams();
  const contest = getContestById(contestId);

  if (!contest) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900">Contest not found</h1>
        <p className="text-sm text-slate-500 mt-2">This contest record does not exist.</p>
        <Link to="/admin/contests" className="inline-flex mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Back to contest list
        </Link>
      </div>
    );
  }

  const results = getContestResults(contest.id);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/contests" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to contest list
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Contest Results</h1>
        <p className="text-slate-500 mt-1">{contest.title} • {formatContestDuration(contest.durationMinutes)} • {contest.participants} participants</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Contest Problems</h2>
        <div className="flex flex-wrap gap-2">
          {contest.problemIds.map((problemId) => (
            <span key={problemId} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
              {getProblemById(problemId)?.title || problemId}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900">Leaderboard</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {results.map((row) => (
            <div key={row.user} className="px-4 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold ${
                  row.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {row.rank}
                </span>
                <span className="text-slate-900 font-medium inline-flex items-center gap-2">
                  {row.rank <= 3 ? <Medal className="w-4 h-4 text-amber-500" /> : null}
                  {row.user}
                </span>
              </div>
              <div className="text-slate-600">
                Solved: <span className="font-medium text-slate-900">{row.solved}</span>
                {' • '}
                Penalty: <span className="font-medium text-slate-900">{row.penalty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
