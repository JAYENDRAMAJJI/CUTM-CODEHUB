import { useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { Play, Send, RotateCcw, ChevronDown } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'C'];

const DEFAULT_CODE: Record<string, string> = {
  JavaScript: '// JavaScript\nfunction solve(nums) {\n  // Write your solution\n  return 0;\n}',
  Python: '# Python\ndef solve(nums):\n    # Write your solution\n    return 0',
  Java: '// Java\npublic class Solution {\n    public int solve(int[] nums) {\n        // Write your solution\n        return 0;\n    }\n}',
  'C++': '// C++\n#include <vector>\nusing namespace std;\nint solve(vector<int>& nums) {\n    // Write your solution\n    return 0;\n}',
  C: '// C\nint solve(int* nums, int n) {\n    /* Write your solution */\n    return 0;\n}',
};

const TEST_CASES = [
  { input: '[2, 7, 11, 15], target = 9', expected: '[0, 1]' },
  { input: '[3, 2, 4], target = 6', expected: '[1, 2]' },
];

export default function StudentCodeEditor() {
  const [lang, setLang] = useState('JavaScript');
  const [code, setCode] = useState(DEFAULT_CODE['JavaScript']);
  const [output, setOutput] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<'Accepted' | 'Wrong Answer' | null>(null);
  const [running, setRunning] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLang = (l: string) => {
    setLang(l);
    setCode(DEFAULT_CODE[l]);
    setShowLangMenu(false);
    setOutput(null);
    setVerdict(null);
  };

  const runCode = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput('Output:\n[0, 1]\n\nAll test cases passed!');
      setVerdict(null);
      setRunning(false);
    }, 1200);
  };

  const submitCode = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput('Final Result:\n[0, 1]\n\nTest Cases: 2 / 2 passed\nTime: 48ms  Memory: 42MB');
      setVerdict('Accepted');
      setRunning(false);
    }, 1800);
  };

  const reset = () => {
    setCode(DEFAULT_CODE[lang]);
    setOutput(null);
    setVerdict(null);
  };

  return (
    <StudentPageFrame title="Code Editor" subtitle="Write, run and submit your solution. Select language and test your code.">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
            >
              {lang} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>
            {showLangMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-full">
                {LANGUAGES.map((l) => (
                  <button key={l} onClick={() => changeLang(l)} className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    l === lang ? 'text-indigo-600 font-medium' : 'text-slate-700'
                  }`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={runCode} disabled={running} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
              <Play className="w-3.5 h-3.5" /> Run
            </button>
            <button onClick={submitCode} disabled={running} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              <Send className="w-3.5 h-3.5" /> Submit
            </button>
          </div>
        </div>

        {/* Code Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          title="Code editor"
          aria-label="Code editor"
          placeholder="Write your solution here"
          className="w-full h-72 border border-slate-200 rounded-xl p-4 font-mono text-sm bg-slate-950 text-slate-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Test Cases */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Test Cases</h3>
          <div className="space-y-2">
            {TEST_CASES.map((tc, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-3 text-xs font-mono">
                <span className="text-slate-400">Input: </span><span className="text-slate-700">{tc.input}</span>
                <span className="text-slate-400 ml-4">Expected: </span><span className="text-slate-700">{tc.expected}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        {output !== null && (
          <div className={`border rounded-xl p-4 ${
            verdict === 'Accepted' ? 'border-emerald-300 bg-emerald-50' :
            verdict === 'Wrong Answer' ? 'border-red-300 bg-red-50' :
            'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {verdict && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  verdict === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>{verdict}</span>
              )}
              <span className="text-xs text-slate-500">{running ? 'Running…' : 'Result'}</span>
            </div>
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </StudentPageFrame>
  );
}
