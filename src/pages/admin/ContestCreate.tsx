import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { createContest, getProblems } from '../../data/adminApi';

export default function AdminContestCreate() {
  const navigate = useNavigate();
  const availableProblems = useMemo(() => getProblems(), []);

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [problemIds, setProblemIds] = useState<string[]>(['']);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    createContest({
      title: title.trim(),
      startAt: startAt.trim() || new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      durationMinutes,
      problemIds: problemIds.filter(Boolean),
    });

    navigate('/admin/contests', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/contests" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to contest list
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Create Contest</h1>
        <p className="text-slate-500 mt-1">Create coding contests, add problems, and set duration.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="contest-title" className="block text-sm font-medium text-slate-700 mb-1">Contest Title</label>
            <input
              id="contest-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="contest-duration" className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
            <input
              id="contest-duration"
              type="number"
              min={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.max(15, Number(e.target.value) || 15))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contest-start" className="block text-sm font-medium text-slate-700 mb-1">Start Date & Time</label>
          <input
            id="contest-start"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            placeholder="Mar 20, 2026 7:00 PM"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Contest Problems</h2>
            <button
              type="button"
              onClick={() => setProblemIds((prev) => [...prev, ''])}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Plus className="w-3 h-3" />
              Add Problem
            </button>
          </div>

          {problemIds.map((problemId, index) => (
            <div key={`problem-${index}`} className="grid grid-cols-[1fr_auto] gap-2">
              <select
                value={problemId}
                onChange={(e) => {
                  const next = [...problemIds];
                  next[index] = e.target.value;
                  setProblemIds(next);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                title="Select contest problem"
                aria-label="Select contest problem"
              >
                <option value="">Select a problem</option>
                {availableProblems.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title} ({problem.difficulty})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setProblemIds((prev) => prev.filter((_, i) => i !== index))}
                className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                title="Remove problem"
                aria-label="Remove problem"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Save className="w-4 h-4" />
          Create Contest
        </button>
      </form>
    </div>
  );
}
