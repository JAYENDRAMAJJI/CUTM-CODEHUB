import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminContest, getContestById, getContestResults, getProblemById } from '../../../data/adminApi';
import { ArrowLeft, Clock, Users, Trophy, Play } from 'lucide-react';

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

export default function StudentContestDetail() {
  const { contestId } = useParams<{ contestId: string }>();
  const [contest, setContest] = useState<AdminContest | null>(null);
  const [registered, setRegisteredState] = useState<string[]>(getRegistered());

  useEffect(() => {
    if (contestId) setContest(getContestById(contestId));
  }, [contestId]);

  const isRegistered = contestId ? registered.includes(contestId) : false;

  const toggleRegister = () => {
    if (!contestId) return;
    const updated = isRegistered ? registered.filter((x) => x !== contestId) : [...registered, contestId];
    saveRegistered(updated);
    setRegisteredState(updated);
  };

  if (!contest) {
    return (
      <StudentPageFrame title="Contest" subtitle="">
        <p className="text-sm text-slate-500">Contest not found.</p>
        <Link to="/student/contests" className="text-sm text-indigo-600 mt-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Contests
        </Link>
      </StudentPageFrame>
    );
  }

  const results = contest.status === 'Completed' ? getContestResults(contest.id) : [];
  const problems = contest.problemIds
    .map((id) => getProblemById(id))
    .filter(Boolean);

  return (
    <StudentPageFrame title={contest.title} subtitle={`${contest.status} contest · ${contest.durationMinutes} minutes`}>
      <div className="space-y-5">
        <Link to="/student/contests" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Back to Contests
        </Link>

        {/* Header Card */}
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs border font-medium ${statusStyle[contest.status]}`}>
                  {contest.status}
                  {contest.status === 'Live' && ' 🔴'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{contest.title}</h2>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{contest.durationMinutes} minutes</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{contest.participants} participants</span>
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4" />{contest.problemIds.length} problems</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {contest.status !== 'Completed' && (
                <>
                  <button
                    onClick={toggleRegister}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm ${
                      isRegistered ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isRegistered ? '✓ Registered' : 'Register'}
                  </button>
                  {isRegistered && contest.status === 'Live' && (
                    <Link
                      to={`/student/contests/${contestId}/code`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700"
                    >
                      <Play className="w-4 h-4" /> Start Coding
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Problems */}
        {problems.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Contest Problems
            </h3>
            <div className="space-y-2">
              {problems.map((p, idx) => p && (
                <div key={p.id} className="flex items-center gap-4 border border-slate-200 rounded-lg px-4 py-3">
                  <span className="text-sm font-mono text-slate-400 w-6">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1 text-sm font-medium text-slate-800">{p.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    p.difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                    p.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                    'text-red-600 bg-red-50 border-red-200'
                  }`}>{p.difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results (Completed contests) */}
        {contest.status === 'Completed' && results.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Final Standings</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Rank</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Participant</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Solved</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.rank} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">#{r.rank}</td>
                      <td className="px-4 py-3 text-slate-900">{r.user}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{r.solved}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{r.penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rules */}
        <div className="border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Contest Rules</h3>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
            <li>Each correct submission earns points based on difficulty.</li>
            <li>Wrong answer incurs a 20-minute penalty.</li>
            <li>Plagiarism leads to immediate disqualification.</li>
            <li>Ranking is determined by problems solved, then by total penalty time.</li>
            <li>Contest runs for exactly {contest.durationMinutes} minutes once started.</li>
          </ul>
        </div>
      </div>
    </StudentPageFrame>
  );
}
