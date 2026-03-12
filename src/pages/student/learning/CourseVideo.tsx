import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentPageFrame from '../components/StudentPageFrame';
import { getCourseById } from '../../../data/adminApi';
import { ArrowLeft, ArrowRight, CheckCircle, Play } from 'lucide-react';

const PROGRESS_KEY = 'student.video.progress';

function getProgress(): Record<string, number[]> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}'); } catch { return {}; }
}
function saveProgress(data: Record<string, number[]>) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }

export default function StudentCourseVideo() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const videoIndex = parseInt(videoId ?? '0', 10);
  const course = courseId ? getCourseById(courseId) : null;
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const prog = getProgress();
    setCompleted(prog[courseId ?? ''] ?? []);
  }, [courseId]);

  const markComplete = () => {
    if (!courseId) return;
    const prog = getProgress();
    const existing = new Set(prog[courseId] ?? []);
    existing.add(videoIndex);
    const updated = { ...prog, [courseId]: Array.from(existing) };
    saveProgress(updated);
    setCompleted(Array.from(existing));
  };

  if (!course) {
    return (
      <StudentPageFrame title="Video" subtitle="">
        <p className="text-slate-500 text-sm">Course not found.</p>
        <Link to="/student/courses" className="text-sm text-indigo-600 mt-2 inline-block">Back to Courses</Link>
      </StudentPageFrame>
    );
  }

  const video = course.videos[videoIndex];
  const isComplete = completed.includes(videoIndex);
  const hasPrev = videoIndex > 0;
  const hasNext = videoIndex < course.videos.length - 1;

  return (
    <StudentPageFrame title={video ?? 'Video Lesson'} subtitle={`${course.title} · Lesson ${videoIndex + 1} of ${course.videos.length}`}>
      <div className="space-y-5">
        <Link to={`/student/courses/${courseId}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Back to {course.title}
        </Link>

        {/* Video Player Placeholder */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
          <div className="text-center text-white space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto cursor-pointer hover:bg-white/20 transition-colors">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
            <p className="text-sm opacity-70">{video}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Link
            to={hasPrev ? `/student/courses/${courseId}/video/${videoIndex - 1}` : '#'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              hasPrev ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Link>

          <button
            onClick={markComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isComplete
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isComplete ? 'Completed' : 'Mark Complete'}
          </button>

          <Link
            to={hasNext ? `/student/courses/${courseId}/video/${videoIndex + 1}` : '#'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              hasNext ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            Next <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lesson List */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Course Lessons</h3>
          <div className="space-y-1.5">
            {course.videos.map((v, idx) => (
              <Link
                key={idx}
                to={`/student/courses/${courseId}/video/${idx}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  idx === videoIndex
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                    : 'border border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-5 text-center text-xs font-mono text-slate-400">{idx + 1}</span>
                <span className="flex-1 truncate">{v}</span>
                {completed.includes(idx) && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StudentPageFrame>
  );
}
