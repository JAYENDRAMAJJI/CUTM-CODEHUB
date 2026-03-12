import StudentPageFrame from '../components/StudentPageFrame';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const PATH_STAGES = [
  {
    phase: 'Phase 1',
    title: 'Foundations',
    color: 'indigo',
    steps: [
      { id: 1, title: 'Arrays & Strings', desc: 'Master basic data structure operations', done: true },
      { id: 2, title: 'Recursion Basics', desc: 'Understand recursive thinking and base cases', done: true },
      { id: 3, title: 'Sorting Algorithms', desc: 'Bubble, selection, insertion sort', done: true },
      { id: 4, title: 'Binary Search', desc: 'Search in O(log n) time', done: false },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Core Data Structures',
    color: 'emerald',
    steps: [
      { id: 5, title: 'Linked Lists', desc: 'Singly, doubly, and circular lists', done: false },
      { id: 6, title: 'Stacks & Queues', desc: 'LIFO and FIFO implementations', done: false },
      { id: 7, title: 'Trees & BST', desc: 'Binary trees, traversals, BST operations', done: false },
      { id: 8, title: 'Hash Tables', desc: 'Hashing, collision resolution', done: false },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Advanced Algorithms',
    color: 'amber',
    steps: [
      { id: 9, title: 'Graph Algorithms', desc: 'BFS, DFS, shortest paths', done: false },
      { id: 10, title: 'Dynamic Programming', desc: 'Memoization, tabulation, classic DP problems', done: false },
      { id: 11, title: 'Greedy Algorithms', desc: 'Interval scheduling, activity selection', done: false },
      { id: 12, title: 'Advanced Trees', desc: 'Heaps, Tries, Segment Trees', done: false },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'System Design & Mastery',
    color: 'rose',
    steps: [
      { id: 13, title: 'System Design Basics', desc: 'Scalability, databases, caching', done: false },
      { id: 14, title: 'Competitive Programming', desc: 'Contest strategies and speed coding', done: false },
      { id: 15, title: 'Mock Interviews', desc: 'Timed problem-solving simulations', done: false },
      { id: 16, title: 'Full Stack Capstone', desc: 'Build a complete project from scratch', done: false },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
};

function progressWidthClass(percent: number) {
  if (percent >= 90) return 'w-[90%]';
  if (percent >= 80) return 'w-[80%]';
  if (percent >= 70) return 'w-[70%]';
  if (percent >= 60) return 'w-[60%]';
  if (percent >= 50) return 'w-[50%]';
  if (percent >= 40) return 'w-[40%]';
  if (percent >= 30) return 'w-[30%]';
  if (percent >= 20) return 'w-[20%]';
  if (percent > 0) return 'w-[10%]';
  return 'w-0';
}

export default function StudentLearningPath() {
  const totalSteps = PATH_STAGES.flatMap((s) => s.steps).length;
  const doneSteps = PATH_STAGES.flatMap((s) => s.steps).filter((s) => s.done).length;
  const completionPercent = (doneSteps / totalSteps) * 100;

  return (
    <StudentPageFrame title="Learning Path" subtitle="Your structured journey from foundations to mastery.">
      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Overall Progress</h2>
            <span className="text-sm font-medium text-indigo-600">{doneSteps} / {totalSteps} steps</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-indigo-500 rounded-full transition-all ${progressWidthClass(completionPercent)}`} />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">{Math.round(completionPercent)}% complete</p>
        </div>

        {/* Phases */}
        {PATH_STAGES.map((stage, stageIdx) => {
          const colors = colorMap[stage.color];
          const stageDone = stage.steps.filter((s) => s.done).length;
          const isLocked = stageIdx > 0 && PATH_STAGES[stageIdx - 1].steps.every((s) => !s.done);

          return (
            <div key={stage.phase} className={`border ${colors.border} rounded-xl overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
              <div className={`flex items-center justify-between px-5 py-3 ${colors.bg} border-b ${colors.border}`}>
                <div className="flex items-center gap-3">
                  {isLocked && <Lock className="w-4 h-4 text-slate-400" />}
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>{stage.phase}</p>
                    <p className="font-bold text-slate-900">{stage.title}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${colors.text}`}>{stageDone}/{stage.steps.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {stage.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4 px-5 py-3.5">
                    <div className="mt-0.5 shrink-0">
                      {step.done
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <Circle className="w-5 h-5 text-slate-300" />
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{step.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </StudentPageFrame>
  );
}
