import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronDown } from 'lucide-react';
import { AdminProblem, deleteProblem, getProblems, ProblemDifficulty, ProblemStatus, toggleProblemStatus } from '../../data/adminApi';

const ITEMS_PER_PAGE = 10;

export default function AdminProblems() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | ProblemDifficulty>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ProblemStatus>('All');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProblems(getProblems());
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const query = search.toLowerCase();
      const matchesSearch =
        problem.id.toLowerCase().includes(query) ||
        problem.title.toLowerCase().includes(query);
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === 'All' || problem.status === statusFilter;
      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [difficultyFilter, statusFilter, problems, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficultyFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / ITEMS_PER_PAGE));
  const pagedProblems = filteredProblems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Problem Management</h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage coding problems.</p>
        </div>
        <Link
          to="/admin/problems/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
          title="Create problem"
          aria-label="Create problem"
        >
          <Plus className="w-4 h-4" />
          Create Problem
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems by ID or title..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as 'All' | ProblemDifficulty)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              title="Filter by difficulty"
              aria-label="Filter by difficulty"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-2"
              title="More filters"
              aria-label="Open filters"
              onClick={() => setShowStatusFilter((prev) => !prev)}
            >
              <Filter className="w-4 h-4" />
              <ChevronDown className={`w-3 h-3 transition-transform ${showStatusFilter ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showStatusFilter && (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">Status:</span>
            {(['All', 'Published', 'Draft'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Problem ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Test Cases</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{problem.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{problem.title}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      problem.difficulty === 'Easy' ? 'text-emerald-600' :
                      problem.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{problem.author}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      problem.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{problem.testCases.length}</td>
                  <td className="px-6 py-4 text-slate-500">{problem.created}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/problems/${problem.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title={`Edit ${problem.title}`}
                        aria-label={`Edit ${problem.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={`Toggle status for ${problem.title}`}
                        aria-label={`Toggle status for ${problem.title}`}
                        onClick={() => setProblems(toggleProblemStatus(problem.id))}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={`Delete ${problem.title}`}
                        aria-label={`Delete ${problem.title}`}
                        onClick={() => setProblems(deleteProblem(problem.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title={`More actions for ${problem.title}`}
                        aria-label={`More actions for ${problem.title}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProblems.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length} problem{filteredProblems.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="px-2 text-xs">{currentPage} / {totalPages}</span>
            <button
              className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
