import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import {
  AdminCourse, AdminContest, AdminSubmission,
  getPublishedCourses, getContests, getSubmissions, getProblems,
} from '../../../data/adminApi';
import { Flame, Trophy, BookOpen, Code, BarChart2, Star, ArrowRight } from 'lucide-react';

const RECENTLY_SOLVED = [
  { id: 'PROB-001', title: 'Two Sum', difficulty: 'Easy', time: '2h ago' },
  { id: 'PROB-002', title: 'Merge Intervals', difficulty: 'Medium', time: '1d ago' },
  { id: 'PROB-003', title: 'LRU Cache', difficulty: 'Hard', time: '2d ago' },
];

const diffColor: Record<string, string> = {
  Easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Hard: 'text-red-600 bg-red-50 border-red-200',
};

const statusBadge: Record<string, string> = {
  Live: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-sky-100 text-sky-700',
  Completed: 'bg-slate-100 text-slate-600',
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

export default function StudentDashboard() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);

  useEffect(() => {
    const sync = () => {
      setCourses(getPublishedCourses());
      setContests(getContests());
      setSubmissions(getSubmissions());
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const problems = getProblems().filter((p) => p.status === 'Published');
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;
  const totalProblems = problems.length || 1; // prevent divide-by-zero
  const acceptedCount = submissions.filter((s) => s.verdict === 'Accepted').length;
  const activeContests = contests.filter((c) => c.status === 'Live' || c.status === 'Upcoming');
  const easyPct = Math.min(100, easyCount ? (acceptedCount / easyCount) * 100 : 0);
  const mediumPct = Math.min(100, mediumCount ? (3 / mediumCount) * 100 : 0);
  const hardPct = Math.min(100, hardCount ? (1 / hardCount) * 100 : 0);

  const recommended = problems.filter((p) => p.difficulty === 'Easy').slice(0, 3);

  return (
    <StudentPageFrame title="Dashboard" subtitle="Overview of your learning activity and progress.">
      <div className="space-y-7">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg"><Code className="w-5 h-5 text-indigo-600" /></div>
            <div><p className="text-xs text-slate-500">Solved Today</p><p className="text-2xl font-bold text-slate-900">6</p></div>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><Flame className="w-5 h-5 text-orange-500" /></div>
            <div><p className="text-xs text-slate-500">Streak</p><p className="text-2xl font-bold text-slate-900">14 days</p></div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg"><Trophy className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-slate-500">Rating</p><p className="text-2xl font-bold text-slate-900">1520</p></div>
          </div>
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg"><BookOpen className="w-5 h-5 text-sky-600" /></div>
            <div><p className="text-xs text-slate-500">Live Courses</p><p className="text-2xl font-bold text-slate-900">{courses.length}</p></div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900">Problem Progress</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-emerald-600 font-medium">Easy</span>
                <span className="text-slate-500">{acceptedCount}/{easyCount}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-emerald-400 rounded-full transition-all ${progressWidthClass(easyPct)}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-amber-600 font-medium">Medium</span>
                <span className="text-slate-500">3/{mediumCount}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-amber-400 rounded-full transition-all ${progressWidthClass(mediumPct)}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 font-medium">Hard</span>
                <span className="text-slate-500">1/{hardCount}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-red-400 rounded-full transition-all ${progressWidthClass(hardPct)}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Solved */}
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Recently Solved</h2>
              <Link to="/student/submissions" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {RECENTLY_SOLVED.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <Link to={`/student/coding-problems/${p.id}`} className="text-slate-700 hover:text-indigo-600 truncate">{p.title}</Link>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
                    <span className="text-xs text-slate-400">{p.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contest Summary */}
          <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Contest Activity</h2>
              <Link to="/student/contests" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {activeContests.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <Link to={`/student/contests/${c.id}`} className="text-slate-700 hover:text-indigo-600 truncate">{c.title}</Link>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${statusBadge[c.status]}`}>{c.status}</span>
                </div>
              ))}
              {activeContests.length === 0 && <p className="text-sm text-slate-400">No upcoming contests</p>}
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-900">Enrolled Courses</h2>
            <Link to="/student/courses" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Browse all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.slice(0, 4).map((course) => (
              <Link key={course.id} to={`/student/courses/${course.id}`} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-900 text-sm">{course.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 shrink-0">{course.level}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{course.videos.length} videos · {course.articles.length} articles · {course.enrolled.toLocaleString()} learners</p>
              </Link>
            ))}
            {courses.length === 0 && <p className="text-sm text-slate-400">No published courses yet</p>}
          </div>
        </div>

        {/* Recommended Problems */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900">Recommended for You</h2>
          </div>
          <div className="space-y-2">
            {recommended.map((p) => (
              <Link key={p.id} to={`/student/coding-problems/${p.id}`} className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <span className="text-sm text-slate-800">{p.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
              </Link>
            ))}
            {recommended.length === 0 && (
              <p className="text-sm text-slate-400">No recommended problems available yet.</p>
            )}
          </div>
        </div>
      </div>
    </StudentPageFrame>
  );
}
