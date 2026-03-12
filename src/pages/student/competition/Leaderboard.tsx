import { useEffect, useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { LeaderboardEntry, getLeaderboardEntries } from '../../../data/adminApi';
import { Medal } from 'lucide-react';

const WEEKLY_MOCK: LeaderboardEntry[] = [
  { rank: 1, user: 'coder_raj', score: 320, solved: 8, penalties: 0 },
  { rank: 2, user: 'nina_codes', score: 290, solved: 7, penalties: 1 },
  { rank: 3, user: 'alex_dev', score: 260, solved: 6, penalties: 2 },
  { rank: 4, user: 'dev_priya', score: 230, solved: 5, penalties: 1 },
  { rank: 5, user: 'byte_king', score: 200, solved: 5, penalties: 3 },
];

const medalColors: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-slate-400',
  3: 'text-amber-700',
};

const podiumHeightClass = ['h-20', 'h-28', 'h-16'] as const;

export default function StudentLeaderboard() {
  const [global, setGlobal] = useState<LeaderboardEntry[]>([]);
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  useEffect(() => {
    const sync = () => setGlobal(getLeaderboardEntries());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const entries = tab === 'global' ? global : WEEKLY_MOCK;

  return (
    <StudentPageFrame title="Leaderboard" subtitle="See top performers and compare your ranking with others.">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(['global', 'weekly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >{t === 'global' ? 'Global' : 'This Week'}</button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {entries.length >= 3 && (
          <div className="flex items-end justify-center gap-4 py-4">
            {[entries[1], entries[0], entries[2]].map((e, i) => {
              const actualRank = [2, 1, 3][i];
              return (
                <div key={e.user} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-slate-600">{e.user}</span>
                  <span className="text-sm font-bold text-slate-900">{e.score}</span>
                  <div
                    className={`w-16 ${podiumHeightClass[i]} rounded-t-lg flex items-start justify-center pt-2 ${
                      actualRank === 1 ? 'bg-amber-400' : actualRank === 2 ? 'bg-slate-300' : 'bg-amber-600'
                    }`}
                  >
                    <span className="text-white font-bold text-sm">#{actualRank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Rank</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">User</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Score</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Solved</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 hidden sm:table-cell">Penalties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((row) => (
                <tr key={row.rank} className={`hover:bg-slate-50 ${row.user === 'alex_dev' ? 'bg-indigo-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {row.rank <= 3 ? (
                        <Medal className={`w-4 h-4 ${medalColors[row.rank]}`} />
                      ) : (
                        <span className="text-slate-400 text-xs w-4 text-center">{row.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.user}</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600">{row.score}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.solved}</td>
                  <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">{row.penalties}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">No leaderboard data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StudentPageFrame>
  );
}
