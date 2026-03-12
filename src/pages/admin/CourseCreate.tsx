import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { CourseLevel, createCourse } from '../../data/adminApi';

export default function AdminCourseCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [videos, setVideos] = useState<string[]>(['']);
  const [articles, setArticles] = useState<string[]>(['']);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    createCourse({
      title: title.trim(),
      level,
      videos: videos.map((item) => item.trim()).filter(Boolean),
      articles: articles.map((item) => item.trim()).filter(Boolean),
    });

    navigate('/admin/courses', { replace: true });
  };

  const onFileUpload = (kind: 'video' | 'article', files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    const fileNames = Array.from(files).map((file) => `uploaded://${file.name}`);
    if (kind === 'video') {
      setVideos((prev) => [...prev.filter(Boolean), ...fileNames]);
      return;
    }
    setArticles((prev) => [...prev.filter(Boolean), ...fileNames]);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to course list
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Create Course</h1>
        <p className="text-slate-500 mt-1">Add course details, videos, and articles.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="course-title" className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
            <input
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="course-level" className="block text-sm font-medium text-slate-700 mb-1">Level</label>
            <select
              id="course-level"
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseLevel)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Upload Videos</h2>
              <button
                type="button"
                onClick={() => setVideos((prev) => [...prev, ''])}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Plus className="w-3 h-3" />
                Add URL
              </button>
            </div>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => onFileUpload('video', e.target.files)}
              title="Upload video files"
              aria-label="Upload video files"
              className="block w-full text-xs text-slate-600"
            />
            {videos.map((video, index) => (
              <div key={`video-${index}`} className="flex gap-2">
                <input
                  value={video}
                  onChange={(e) => {
                    const next = [...videos];
                    next[index] = e.target.value;
                    setVideos(next);
                  }}
                  placeholder="Video URL"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => setVideos((prev) => prev.filter((_, i) => i !== index))}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                  title="Remove video"
                  aria-label="Remove video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Upload Articles</h2>
              <button
                type="button"
                onClick={() => setArticles((prev) => [...prev, ''])}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Plus className="w-3 h-3" />
                Add URL
              </button>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.md,.txt"
              multiple
              onChange={(e) => onFileUpload('article', e.target.files)}
              title="Upload article files"
              aria-label="Upload article files"
              className="block w-full text-xs text-slate-600"
            />
            {articles.map((article, index) => (
              <div key={`article-${index}`} className="flex gap-2">
                <input
                  value={article}
                  onChange={(e) => {
                    const next = [...articles];
                    next[index] = e.target.value;
                    setArticles(next);
                  }}
                  placeholder="Article URL"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => setArticles((prev) => prev.filter((_, i) => i !== index))}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                  title="Remove article"
                  aria-label="Remove article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>
        </div>

        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Save className="w-4 h-4" />
          Create Course
        </button>
      </form>
    </div>
  );
}
