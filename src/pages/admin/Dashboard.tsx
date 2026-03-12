import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Code, Trophy, TrendingUp, Activity, PieChart, BarChart3 } from 'lucide-react';
import { getAnalyticsSnapshot, getContests, getCourses, getProblems, getSubmissions, getUsers } from '../../data/adminApi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const users = useMemo(() => getUsers(), []);
  const courses = useMemo(() => getCourses(), []);
  const problems = useMemo(() => getProblems(), []);
  const contests = useMemo(() => getContests(), []);
  const submissions = useMemo(() => getSubmissions(), []);
  const analytics = useMemo(() => getAnalyticsSnapshot(), []);
  const recentSubmissions = useMemo(() => submissions.slice(0, 4), [submissions]);

  const submissionStats = useMemo(() => {
    const accepted = submissions.filter((row) => row.verdict === 'Accepted').length;
    const wrongAnswer = submissions.filter((row) => row.verdict === 'Wrong Answer').length;
    const tle = submissions.filter((row) => row.verdict === 'Time Limit Exceeded').length;
    const runtime = submissions.filter((row) => row.verdict === 'Runtime Error').length;
    return {
      total: submissions.length,
      accepted,
      wrongAnswer,
      tle,
      runtime,
    };
  }, [submissions]);

  const stats = [
    { label: 'Total Users', value: users.length.toLocaleString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Courses', value: courses.length.toLocaleString(), change: '+3', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Problems', value: problems.length.toLocaleString(), change: '+24', icon: Code, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Contests', value: contests.filter((row) => row.status === 'Live').length.toLocaleString(), change: '0', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 mt-1">Monitor key metrics and recent activity.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
          onClick={() => {
            const lines = [
              `CodeLearn Platform Report - ${new Date().toLocaleDateString()}`,
              ``,
              `Total Users: ${users.length}`,
              `Total Courses: ${courses.length}`,
              `Total Problems: ${problems.length}`,
              `Active Contests: ${contests.filter((c) => c.status === 'Live').length}`,
              `Total Submissions: ${submissions.length}`,
              `Acceptance Rate: ${analytics.acceptanceRate}`,
              `Daily Active Users: ${analytics.dailyActiveUsers}`,
              `Problems Solved: ${analytics.solvedCount}`,
              `Contest Participation: ${analytics.contestParticipation}`,
            ];
            const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `codelearn-report-${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          <TrendingUp className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Submission Statistics */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 inline-flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Submission Statistics
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
              Total: {submissionStats.total}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Accepted</span>
              <span className="font-semibold text-emerald-700">{submissionStats.accepted}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Wrong Answer</span>
              <span className="font-semibold text-red-700">{submissionStats.wrongAnswer}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Time Limit Exceeded</span>
              <span className="font-semibold text-amber-700">{submissionStats.tle}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Runtime Error</span>
              <span className="font-semibold text-slate-700">{submissionStats.runtime}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Acceptance Rate</span>
              <span className="font-semibold text-indigo-700">{analytics.acceptanceRate}</span>
            </div>
          </div>
        </section>

        {/* Platform Analytics */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 inline-flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Platform Analytics
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {analytics.weeklyGrowth}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Daily Active Users</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{analytics.dailyActiveUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Problems Solved</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{analytics.solvedCount.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 col-span-2">
              <p className="text-xs text-slate-500">Contest Participation</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{analytics.contestParticipation.toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Live Submissions
            </h2>
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              onClick={() => navigate('/admin/submissions')}
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Problem</th>
                  <th className="px-5 py-3">Lang</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{sub.id}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{sub.user}</td>
                    <td className="px-5 py-3 text-slate-600">{sub.problem}</td>
                    <td className="px-5 py-3 text-slate-600">{sub.language}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sub.verdict === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                        sub.verdict === 'Wrong Answer' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-slate-500 text-xs">{sub.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <h2 className="font-bold text-slate-900 mb-4">System Status</h2>
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">API Gateway</span>
                <span className="text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Judge0 Execution Engine</span>
                <span className="text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Queue: 12 pending</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">MongoDB Cluster</span>
                <span className="text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              className="w-full py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200"
              onClick={() => navigate('/admin/analytics')}
            >
              View Detailed Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
