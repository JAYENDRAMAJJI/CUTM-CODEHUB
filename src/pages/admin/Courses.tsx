import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookOpenCheck, Trash2, Pencil } from 'lucide-react';
import { AdminCourse, deleteCourse, getCourses, toggleCourseStatus } from '../../data/adminApi';

export default function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalEnrollment = filteredCourses.reduce((sum, course) => sum + course.enrolled, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-500 mt-1">Publish and maintain the learning catalog.</p>
        </div>
        <Link
          to="/admin/courses/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
          title="Create course"
          aria-label="Create course"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Visible Courses</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{filteredCourses.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Published</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{filteredCourses.filter((c) => c.status === 'Published').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Total Enrollments</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{totalEnrollment}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course title or ID"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Published' | 'Draft')}
            className="w-full lg:w-48 py-2 px-3 border border-slate-200 rounded-lg text-sm"
            title="Filter by course status"
            aria-label="Filter by course status"
          >
            <option value="All">All status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Level</th>
                <th className="px-5 py-3">Enrolled</th>
                <th className="px-5 py-3">Videos</th>
                <th className="px-5 py-3">Articles</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{course.title}</p>
                    <p className="text-xs font-mono text-slate-500">{course.id}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{course.level}</td>
                  <td className="px-5 py-3 text-slate-700">{course.enrolled}</td>
                  <td className="px-5 py-3 text-slate-700">{course.videos.length}</td>
                  <td className="px-5 py-3 text-slate-700">{course.articles.length}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        title={`Edit ${course.title}`}
                        aria-label={`Edit ${course.title}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        title={`Toggle publish status for ${course.title}`}
                        aria-label={`Toggle publish status for ${course.title}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => setCourses(toggleCourseStatus(course.id))}
                      >
                        <BookOpenCheck className="w-4 h-4" />
                      </button>
                      <button
                        title={`Delete ${course.title}`}
                        aria-label={`Delete ${course.title}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setCourses(deleteCourse(course.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
