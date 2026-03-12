import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { ContestStatus, getContestById, getProblems, updateContest } from '../../data/adminApi';

export default function AdminContestEdit() {
  const { contestId = '' } = useParams();
  const navigate = useNavigate();
  const availableProblems = useMemo(() => getProblems(), []);

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [status, setStatus] = useState<ContestStatus>('Upcoming');
  const [problemIds, setProblemIds] = useState<string[]>(['']);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const contest = getContestById(contestId);
    if (!contest) {
      setLoaded(true);
      return;
    }
    setTitle(contest.title);
    setStartAt(contest.startAt);
    setDurationMinutes(contest.durationMinutes);
    setStatus(contest.status);
    setProblemIds(contest.problemIds.length ? contest.problemIds : ['']);
    setLoaded(true);
  }, [contestId]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    updateContest(contestId, {
      title: title.trim(),
      startAt: startAt.trim(),
      durationMinutes,
      status,
      problemIds: problemIds.filter(Boolean),
    });

    navigate('/admin/contests', { replace: true });
  };

  if (loaded && !getContestById(contestId)) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900">Contest not found</h1>
        <p className="text-sm text-slate-500 mt-2">This contest record does not exist.</p>
        <Link to="/admin/contests" className="inline-flex mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Back to contest list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/contests" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to contest list
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit Contest</h1>
        <p className="text-slate-500 mt-1">Update problems, duration, and contest state.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label htmlFor="contest-status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              id="contest-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContestStatus)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contest-start" className="block text-sm font-medium text-slate-700 mb-1">Start Date & Time</label>
          <input
            id="contest-start"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
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
          Save Contest
        </button>
      </form>
    </div>
  );
}
