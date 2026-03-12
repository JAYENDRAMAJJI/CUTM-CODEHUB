import StudentPageFrame from '../components/StudentPageFrame';

const ACHIEVEMENTS = [
  { id: 1, icon: '🎯', title: 'First Solve', desc: 'Solved your first problem', earned: true, date: 'Jan 5, 2026' },
  { id: 2, icon: '🔥', title: 'Streak 7', desc: 'Maintained a 7-day coding streak', earned: true, date: 'Jan 12, 2026' },
  { id: 3, icon: '⚡', title: 'Speed Demon', desc: 'Solved a problem in under 5 minutes', earned: true, date: 'Jan 18, 2026' },
  { id: 4, icon: '🏆', title: 'Contest Finisher', desc: 'Completed your first contest', earned: true, date: 'Feb 2, 2026' },
  { id: 5, icon: '💯', title: 'Century', desc: 'Solved 100 problems', earned: false, progress: 47 },
  { id: 6, icon: '🌟', title: 'Rating 2000', desc: 'Reach a contest rating of 2000', earned: false, progress: 1520 / 2000 * 100 },
  { id: 7, icon: '📚', title: 'Course Complete', desc: 'Complete an entire course', earned: false, progress: 60 },
  { id: 8, icon: '🤝', title: 'Community Hero', desc: 'Answer 10 discussion questions', earned: false, progress: 30 },
  { id: 9, icon: '🎓', title: 'Graduate', desc: 'Complete a full learning path', earned: false, progress: 45 },
  { id: 10, icon: '🔥', title: 'Streak 30', desc: 'Maintain a 30-day streak', earned: false, progress: 47 },
];

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

export default function StudentAchievements() {
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  const pending = ACHIEVEMENTS.filter((a) => !a.earned);

  return (
    <StudentPageFrame title="Achievements" subtitle="Track your badges, milestones, and coding accomplishments.">
      <div className="space-y-7">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{earned.length}</p>
            <p className="text-xs text-slate-500 mt-1">Earned</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{pending.length}</p>
            <p className="text-xs text-slate-500 mt-1">In Progress</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{ACHIEVEMENTS.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total</p>
          </div>
        </div>

        {/* Earned Badges */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Earned Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {earned.map((a) => (
              <div key={a.id} className="flex items-center gap-4 border border-indigo-200 bg-indigo-50 rounded-xl p-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-2xl shrink-0">
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
                  <p className="text-xs text-indigo-500 mt-1">Earned {a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">In Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pending.map((a) => (
              <div key={a.id} className="flex items-center gap-4 border border-slate-200 bg-white rounded-xl p-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 grayscale opacity-50">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 text-sm">{a.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                  {a.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-indigo-400 rounded-full ${progressWidthClass(Math.min(100, a.progress))}`} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{Math.round(a.progress)}% complete</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentPageFrame>
  );
}
