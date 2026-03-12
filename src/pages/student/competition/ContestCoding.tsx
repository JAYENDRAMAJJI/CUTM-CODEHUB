import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { getContestById, getProblemById } from '../../../data/adminApi';
import { AdminContest, AdminProblem } from '../../../data/adminApi';
import { ArrowLeft, Play, Send, Clock } from 'lucide-react';

function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

export default function StudentContestCoding() {
  const { contestId } = useParams<{ contestId: string }>();
  const [contest, setContest] = useState<AdminContest | null>(null);
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [selected, setSelected] = useState(0);
  const [code, setCode] = useState('// Write your solution here\n');
  const [lang, setLang] = useState('JavaScript');
  const [output, setOutput] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<'Accepted' | 'Wrong Answer' | null>(null);
  const [running, setRunning] = useState(false);

  const timer = useCountdown(contest ? contest.durationMinutes * 60 : 7200);

  useEffect(() => {
    if (!contestId) return;
    const c = getContestById(contestId);
    if (c) {
      setContest(c);
      const probs = c.problemIds.map((id) => getProblemById(id)).filter(Boolean) as AdminProblem[];
      setProblems(probs);
    }
  }, [contestId]);

  const problem = problems[selected];

  const run = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput('Test cases passed: 2 / 2\nOutput: [0, 1]');
      setVerdict(null);
      setRunning(false);
    }, 1200);
  };

  const submit = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      const pass = Math.random() > 0.3;
      setVerdict(pass ? 'Accepted' : 'Wrong Answer');
      setOutput(pass ? 'Accepted! +100 points\nTime: 52ms  Memory: 41MB' : 'Wrong answer on test case 2.\n-20 min penalty');
      setRunning(false);
    }, 1600);
  };

  if (!contest) {
    return (
      <StudentPageFrame title="Contest" subtitle="">
        <p className="text-sm text-slate-500">Contest not found.</p>
        <Link to="/student/contests" className="text-sm text-indigo-600 mt-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </StudentPageFrame>
    );
  }

  return (
    <StudentPageFrame title={contest.title} subtitle="Contest in progress – solve as many problems as possible before time runs out.">
      <div className="space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to={`/student/contests/${contestId}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" /> Exit Contest
          </Link>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg ${
            timer < '00:10:00' ? 'text-red-600 bg-red-50 border-red-200' : 'text-indigo-700 bg-indigo-50 border-indigo-200'
          }`}>
            <Clock className="w-4 h-4" /> {timer}
          </div>
        </div>

        {/* Problem Tabs */}
        {problems.length > 0 && (
          <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
            {problems.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setSelected(i); setOutput(null); setVerdict(null); }}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px shrink-0 transition-colors ${
                  i === selected ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {String.fromCharCode(65 + i)}. {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Problem Description */}
        {problem && (
          <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900">{problem.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${
                problem.difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                problem.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                'text-red-600 bg-red-50 border-red-200'
              }`}>{problem.difficulty}</span>
            </div>
            <p className="leading-relaxed">{problem.description}</p>
            {problem.testCases.slice(0, 1).map((tc, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-3 font-mono text-xs space-y-1 bg-slate-50">
                <div><span className="text-slate-400">Input: </span><span className="text-slate-700">{tc.input}</span></div>
                <div><span className="text-slate-400">Output: </span><span className="text-emerald-700">{tc.output}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <select value={lang} onChange={(e) => setLang(e.target.value)} title="Programming language" aria-label="Programming language" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={16}
            title="Contest code editor"
            aria-label="Contest code editor"
            placeholder="Write your contest solution here"
            className="w-full border border-slate-200 rounded-xl p-4 font-mono text-sm bg-slate-950 text-slate-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={run} disabled={running} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            <Play className="w-4 h-4" /> {running ? 'Running…' : 'Run'}
          </button>
          <button onClick={submit} disabled={running} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>

        {output !== null && (
          <div className={`border rounded-xl p-4 ${
            verdict === 'Accepted' ? 'border-emerald-300 bg-emerald-50' :
            verdict === 'Wrong Answer' ? 'border-red-300 bg-red-50' :
            'border-slate-200 bg-slate-50'
          }`}>
            {verdict && (
              <span className={`inline-block mb-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                verdict === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>{verdict}</span>
            )}
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </StudentPageFrame>
  );
}
