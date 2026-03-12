import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { AdminCourse, getCourseById } from '../../../data/adminApi';
import { BookOpen, Video, FileText, Users, ArrowLeft, Play, CheckCircle } from 'lucide-react';

const ENROLLED_KEY = 'student.enrolled.courses';

function getEnrolled(): string[] {
  try { return JSON.parse(localStorage.getItem(ENROLLED_KEY) ?? '[]'); } catch { return []; }
}
function setEnrolled(ids: string[]) { localStorage.setItem(ENROLLED_KEY, JSON.stringify(ids)); }

export default function StudentCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [enrolled, setEnrolledState] = useState<string[]>(getEnrolled());

  useEffect(() => {
    if (courseId) setCourse(getCourseById(courseId));
  }, [courseId]);

  const isEnrolled = courseId ? enrolled.includes(courseId) : false;

  const handleEnroll = () => {
    if (!courseId) return;
    const updated = isEnrolled
      ? enrolled.filter((id) => id !== courseId)
      : [...enrolled, courseId];
    setEnrolled(updated);
    setEnrolledState(updated);
  };

  if (!course) {
    return (
      <StudentPageFrame title="Course Detail" subtitle="">
        <p className="text-slate-500 text-sm">Course not found.</p>
        <button onClick={() => navigate('/student/courses')} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
      </StudentPageFrame>
    );
  }

  const levelColor: Record<string, string> = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-amber-100 text-amber-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  return (
    <StudentPageFrame title={course.title} subtitle={`${course.level} course · ${course.enrolled.toLocaleString()} learners enrolled`}>
      <div className="space-y-6">
        <Link to="/student/courses" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${levelColor[course.level] ?? 'bg-slate-100 text-slate-700'}`}>{course.level}</span>
                <span className="text-xs text-slate-400 font-mono">{course.id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
            </div>
            <button
              onClick={handleEnroll}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isEnrolled
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-center mb-1"><Video className="w-5 h-5 text-indigo-400" /></div>
              <p className="text-lg font-bold text-slate-900">{course.videos.length}</p>
              <p className="text-xs text-slate-500">Videos</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-center mb-1"><FileText className="w-5 h-5 text-emerald-400" /></div>
              <p className="text-lg font-bold text-slate-900">{course.articles.length}</p>
              <p className="text-xs text-slate-500">Articles</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-center mb-1"><Users className="w-5 h-5 text-amber-400" /></div>
              <p className="text-lg font-bold text-slate-900">{course.enrolled.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Learners</p>
            </div>
          </div>
        </div>

        {/* Video List */}
        {course.videos.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-500" /> Video Lessons
            </h3>
            <div className="space-y-2">
              {course.videos.map((video, idx) => (
                <Link
                  key={idx}
                  to={`/student/courses/${course.id}/video/${idx}`}
                  className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm text-slate-700 flex-1">{video}</span>
                  {isEnrolled && idx === 0 && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {course.articles.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" /> Reading Materials
            </h3>
            <div className="space-y-2">
              {course.articles.map((article, idx) => (
                <div key={idx} className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700 flex-1">{article}</span>
                  <span className="text-xs text-slate-400">~5 min read</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentPageFrame>
  );
}
