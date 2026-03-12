import { FormEvent, useEffect, useMemo, useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminDiscussion, getDiscussions } from '../../../data/adminApi';
import { MessageSquare, ChevronUp, Plus, X } from 'lucide-react';

export default function StudentDiscussions() {
  const [discussions, setDiscussions] = useState<AdminDiscussion[]>([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sync = () => setDiscussions(getDiscussions());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const categories = ['All', ...Array.from(new Set(discussions.map((d) => d.category)))];

  const filtered = useMemo(() => {
    return discussions.filter((d) => {
      if (d.spam || d.flagged) return false;
      const matchCat = category === 'All' || d.category === category;
      const matchQ = !query || d.title.toLowerCase().includes(query.toLowerCase()) || d.author.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [discussions, category, query]);

  const handleVote = (id: string) => {
    if (voted.has(id)) return;
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setVoted((prev) => new Set(prev).add(id));
  };

  const handleNewPost = (e: FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const newDiscussion: AdminDiscussion = {
      id: `LOCAL-${Date.now()}`,
      title,
      author: 'You',
      replies: 0,
      flagged: false,
      category: newCategory,
      spam: false,
      comments: [],
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
    setShowForm(false);
    setNewTitle('');
  };

  return (
    <StudentPageFrame title="Discussions" subtitle="Ask questions, share insights, and collaborate with fellow learners.">
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discussions..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shrink-0"
          >
            <Plus className="w-4 h-4" /> Ask Question
          </button>
        </div>

        {/* New Post Modal */}
        {showForm && (
          <div className="border border-indigo-200 rounded-xl p-5 bg-indigo-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Post a Question</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg hover:bg-indigo-100"
                title="Close form"
                aria-label="Close form"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleNewPost} className="space-y-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's your question?"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                title="Question category"
                aria-label="Question category"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {['General', 'DSA', 'System Design', 'Contests', 'Courses', 'Career'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <textarea placeholder="Describe your question in detail..." rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none" />
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Post</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >{c}</button>
          ))}
        </div>

        {/* Discussion List */}
        <div className="space-y-2">
          {filtered.map((d) => (
            <div key={d.id} className="flex gap-3 border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/20 transition-colors">
              {/* Vote */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  onClick={() => handleVote(d.id)}
                  title="Upvote discussion"
                  aria-label="Upvote discussion"
                  className={`p-1 rounded-lg transition-colors ${voted.has(d.id) ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-100'}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-600">{(votes[d.id] ?? 0)}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{d.title}</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className="text-xs text-slate-500">{d.author}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{d.category}</span>
                </div>
              </div>

              {/* Replies */}
              <div className="flex items-center gap-1 shrink-0 text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs">{d.replies + d.comments.length}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-400">No discussions found. Be the first to ask!</p>}
        </div>
      </div>
    </StudentPageFrame>
  );
}
