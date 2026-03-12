import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminProblem, getProblems } from '../../../data/adminApi';
import { Search } from 'lucide-react';

const diffColor: Record<string, string> = {
  Easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Hard: 'text-red-600 bg-red-50 border-red-200',
};

export default function StudentCodingProblems() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    const sync = () => setProblems(getProblems().filter((p) => p.status === 'Published'));
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchQ = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase());
      const matchD = difficulty === 'All' || p.difficulty === difficulty;
      return matchQ && matchD;
    });
  }, [problems, query, difficulty]);

  const counts = { Easy: problems.filter((p) => p.difficulty === 'Easy').length, Medium: problems.filter((p) => p.difficulty === 'Medium').length, Hard: problems.filter((p) => p.difficulty === 'Hard').length };

  return (
    <StudentPageFrame title="Coding Problems" subtitle="Filter and solve problems by difficulty. Progress syncs with the platform.">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(difficulty === d ? 'All' : d)}
              className={`border rounded-xl p-3 text-center transition-colors ${
                difficulty === d ? diffColor[d] + ' border-current' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <p className={`text-xl font-bold ${difficulty === d ? '' : 'text-slate-900'}`}>{counts[d]}</p>
              <p className={`text-xs mt-0.5 ${difficulty === d ? '' : 'text-slate-500'}`}>{d}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems by title or ID…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {filtered.map((p, idx) => (
            <Link
              key={p.id}
              to={`/student/coding-problems/${p.id}`}
              className="flex items-center gap-4 border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
            >
              <span className="text-sm text-slate-400 w-6 text-right shrink-0">{idx + 1}</span>
              <span className="flex-1 text-sm font-medium text-slate-800 truncate">{p.title}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium shrink-0 ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 py-2">
              {problems.length === 0 ? 'No published problems available yet.' : 'No problems match your filters.'}
            </p>
          )}
        </div>
      </div>
    </StudentPageFrame>
  );
}
