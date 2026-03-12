import { FormEvent, useEffect, useMemo, useState } from 'react';
import { RotateCcw, Save, Sparkles, Trophy } from 'lucide-react';
import {
  LeaderboardEntry,
  ScoringSystem,
  getLeaderboardControlSummary,
  getLeaderboardEntries,
  getScoringSystem,
  resetLeaderboard,
  updateLeaderboardRankings,
  updateScoringSystem,
} from '../../data/adminApi';

export default function AdminLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [scoring, setScoring] = useState<ScoringSystem>(getScoringSystem());

  useEffect(() => {
    setEntries(getLeaderboardEntries());
    setScoring(getScoringSystem());
  }, []);

  const summary = useMemo(() => getLeaderboardControlSummary(), [entries]);

  const onSaveScoring = (event: FormEvent) => {
    event.preventDefault();
    const next = updateScoringSystem(scoring);
    setScoring(next);
  };

  const onResetLeaderboard = () => {
    setEntries(resetLeaderboard());
  };

  const onUpdateRankings = () => {
    setEntries(updateLeaderboardRankings());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard Control</h1>
        <p className="text-slate-500 mt-1">Reset leaderboard, update rankings, and manage scoring system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Participants</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.participants}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Top Score</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{summary.topScore}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Average Score</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.avgScore}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Scoring Version</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.scoringVersion}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUpdateRankings}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            <Sparkles className="w-4 h-4" />
            Update Rankings
          </button>
          <button
            type="button"
            onClick={onResetLeaderboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Leaderboard
          </button>
        </div>

        <form onSubmit={onSaveScoring} className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <label className="text-xs text-slate-600">
            Accepted Points
            <input
              type="number"
              min={1}
              value={scoring.acceptedPoints}
              onChange={(e) => setScoring((prev) => ({ ...prev, acceptedPoints: Number(e.target.value) || 1 }))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </label>
          <label className="text-xs text-slate-600">
            Wrong Answer Penalty
            <input
              type="number"
              min={0}
              value={scoring.wrongAnswerPenalty}
              onChange={(e) => setScoring((prev) => ({ ...prev, wrongAnswerPenalty: Number(e.target.value) || 0 }))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </label>
          <label className="text-xs text-slate-600">
            TLE Penalty
            <input
              type="number"
              min={0}
              value={scoring.tlePenalty}
              onChange={(e) => setScoring((prev) => ({ ...prev, tlePenalty: Number(e.target.value) || 0 }))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </label>
          <label className="text-xs text-slate-600">
            Runtime Penalty
            <input
              type="number"
              min={0}
              value={scoring.runtimePenalty}
              onChange={(e) => setScoring((prev) => ({ ...prev, runtimePenalty: Number(e.target.value) || 0 }))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </label>
          <label className="text-xs text-slate-600">
            Plagiarism Penalty
            <input
              type="number"
              min={0}
              value={scoring.plagiarismPenalty}
              onChange={(e) => setScoring((prev) => ({ ...prev, plagiarismPenalty: Number(e.target.value) || 0 }))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </label>

          <div className="md:col-span-5">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              <Save className="w-4 h-4" />
              Save Scoring System
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900">Current Rankings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Solved</th>
                <th className="px-5 py-3">Penalties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.user} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-slate-900">#{entry.rank}</td>
                  <td className="px-5 py-3 text-slate-800">{entry.user}</td>
                  <td className="px-5 py-3 text-indigo-700 font-semibold">{entry.score}</td>
                  <td className="px-5 py-3 text-slate-700">{entry.solved}</td>
                  <td className="px-5 py-3 text-slate-700">{entry.penalties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
