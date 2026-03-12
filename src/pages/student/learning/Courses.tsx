import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminCourse, getPublishedCourses } from '../../../data/adminApi';
import { ExternalLink } from 'lucide-react';

const ENROLLED_KEY = 'student.enrolled.courses';
function getEnrolled(): string[] {
  try { return JSON.parse(localStorage.getItem(ENROLLED_KEY) ?? '[]'); } catch { return []; }
}
function setEnrolled(ids: string[]) { localStorage.setItem(ENROLLED_KEY, JSON.stringify(ids)); }

const levelColor: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function StudentCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [query, setQuery] = useState('');
  const [enrolled, setEnrolledState] = useState<string[]>(getEnrolled());

  useEffect(() => {
    const syncCourses = () => setCourses(getPublishedCourses());
    syncCourses();
    window.addEventListener('storage', syncCourses);
    return () => window.removeEventListener('storage', syncCourses);
  }, []);

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) =>
      c.title.toLowerCase().includes(q) || c.level.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [courses, query]);

  const toggleEnroll = (id: string) => {
    const updated = enrolled.includes(id) ? enrolled.filter((x) => x !== id) : [...enrolled, id];
    setEnrolled(updated);
    setEnrolledState(updated);
  };

  return (
    <StudentPageFrame title="Courses" subtitle="Browse and enroll in published courses. Changes made by admin reflect instantly.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Published Courses</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{courses.length}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Enrolled</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{enrolled.length}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Total Enrollments</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{courses.reduce((sum, c) => sum + c.enrolled, 0).toLocaleString()}</p>
          </div>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, level, or ID..."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <div key={course.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-semibold text-slate-900">{course.title}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColor[course.level] ?? 'bg-slate-100 text-slate-700'}`}>{course.level}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">{course.id}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{course.videos.length} videos</span>
                    <span>{course.articles.length} articles</span>
                    <span>{course.enrolled.toLocaleString()} learners</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </Link>
                  <button
                    onClick={() => toggleEnroll(course.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      enrolled.includes(course.id)
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {enrolled.includes(course.id) ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && <p className="text-sm text-slate-500">No published courses match your search.</p>}
        </div>
      </div>
    </StudentPageFrame>
  );
}
