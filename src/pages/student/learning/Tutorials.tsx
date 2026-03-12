import { useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { Clock, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const TUTORIALS = [
  { id: 1, title: 'Binary Search Patterns', category: 'Algorithms', difficulty: 'Easy', time: '8 min', bookmarked: false },
  { id: 2, title: 'Graph Traversal Basics', category: 'Graphs', difficulty: 'Medium', time: '12 min', bookmarked: false },
  { id: 3, title: 'Sliding Window Crash Course', category: 'Patterns', difficulty: 'Medium', time: '10 min', bookmarked: true },
  { id: 4, title: 'Dynamic Programming Fundamentals', category: 'Algorithms', difficulty: 'Hard', time: '20 min', bookmarked: false },
  { id: 5, title: 'Two Pointers Technique', category: 'Patterns', difficulty: 'Easy', time: '6 min', bookmarked: false },
  { id: 6, title: 'Tree Traversal Methods', category: 'Trees', difficulty: 'Medium', time: '15 min', bookmarked: false },
  { id: 7, title: 'Hash Map Usage Patterns', category: 'Data Structures', difficulty: 'Easy', time: '7 min', bookmarked: false },
  { id: 8, title: 'Recursion to Iteration', category: 'Algorithms', difficulty: 'Medium', time: '11 min', bookmarked: false },
  { id: 9, title: 'Dijkstra\'s Algorithm Step-by-Step', category: 'Graphs', difficulty: 'Hard', time: '18 min', bookmarked: false },
];

const CATEGORIES = ['All', ...Array.from(new Set(TUTORIALS.map((t) => t.category)))];

const diffColor: Record<string, string> = {
  Easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Hard: 'text-red-600 bg-red-50 border-red-200',
};

export default function StudentTutorials() {
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set(TUTORIALS.filter((t) => t.bookmarked).map((t) => t.id)));
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const filtered = TUTORIALS.filter(
    (t) => (category === 'All' || t.category === category) && (difficulty === 'All' || t.difficulty === difficulty),
  );

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <StudentPageFrame title="Tutorials" subtitle="Step-by-step guides for core coding topics. Bookmark articles for later.">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            title="Filter by category"
            aria-label="Filter by category"
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            title="Filter by difficulty"
            aria-label="Filter by difficulty"
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          {filtered.map((tutorial) => (
            <div key={tutorial.id} className="flex items-center gap-4 border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/20 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{tutorial.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs text-slate-500">{tutorial.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${diffColor[tutorial.difficulty]}`}>{tutorial.difficulty}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />{tutorial.time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(tutorial.id)}
                title={bookmarked.has(tutorial.id) ? 'Remove bookmark' : 'Bookmark'}
                className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {bookmarked.has(tutorial.id)
                  ? <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                  : <BookmarkPlus className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-400">No tutorials match the selected filters.</p>}
        </div>
      </div>
    </StudentPageFrame>
  );
}
