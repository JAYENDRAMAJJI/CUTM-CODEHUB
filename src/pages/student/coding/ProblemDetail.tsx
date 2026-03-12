import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminProblem, getProblemById } from '../../../data/adminApi';
import { ArrowLeft, Play, Send, RotateCcw } from 'lucide-react';

const diffColor: Record<string, string> = {
  Easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Hard: 'text-red-600 bg-red-50 border-red-200',
};

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

export default function StudentProblemDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<AdminProblem | null>(null);
  const [code, setCode] = useState('// Write your solution here\n');
  const [lang, setLang] = useState('JavaScript');
  const [output, setOutput] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<'Accepted' | 'Wrong Answer' | null>(null);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'description' | 'testcases'>('description');

  useEffect(() => {
    if (problemId) setProblem(getProblemById(problemId));
  }, [problemId]);

  const run = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput('Output:\n[0, 1]\n\nTest cases: 2 / 2 passed');
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
      setOutput(pass
        ? 'All test cases passed!\nTime: 52ms  Memory: 41MB'
        : 'Wrong Answer on test case 2.\nExpected: [1, 2]\nGot: [0, 1]');
      setRunning(false);
    }, 1600);
  };

  if (!problem) {
    return (
      <StudentPageFrame title="Problem" subtitle="">
        <p className="text-slate-500 text-sm">Problem not found.</p>
        <Link to="/student/coding-problems" className="text-sm text-indigo-600 mt-2 inline-block flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Problems
        </Link>
      </StudentPageFrame>
    );
  }

  return (
    <StudentPageFrame title={problem.title} subtitle={`By ${problem.author} · ${problem.created}`}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link to="/student/coding-problems" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" /> Problems
          </Link>
          <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium ${diffColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(['description', 'testcases'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
                tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'testcases' ? 'Test Cases' : 'Description'}
            </button>
          ))}
        </div>

        {tab === 'description' ? (
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="leading-relaxed">{problem.description}</p>
            </div>
            {problem.inputFormat && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Input Format</h3>
                <p className="leading-relaxed">{problem.inputFormat}</p>
              </div>
            )}
            {problem.outputFormat && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Output Format</h3>
                <p className="leading-relaxed">{problem.outputFormat}</p>
              </div>
            )}
            {problem.constraints && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Constraints</h3>
                <pre className="font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap">{problem.constraints}</pre>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {problem.testCases.length > 0 ? problem.testCases.map((tc, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-3 text-xs font-mono space-y-1">
                <div><span className="text-slate-400">Input: </span><span className="text-slate-700">{tc.input}</span></div>
                <div><span className="text-slate-400">Output: </span><span className="text-emerald-700">{tc.output}</span></div>
              </div>
            )) : <p className="text-sm text-slate-400">No test cases available.</p>}
          </div>
        )}

        {/* Editor */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              title="Programming language"
              aria-label="Programming language"
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={() => setCode('// Write your solution here\n')} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={14}
            title="Problem code editor"
            aria-label="Problem code editor"
            placeholder="Write your solution here"
            className="w-full border border-slate-200 rounded-xl p-4 font-mono text-sm bg-slate-950 text-slate-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={run} disabled={running} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            <Play className="w-4 h-4" /> {running ? 'Running…' : 'Run Code'}
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
