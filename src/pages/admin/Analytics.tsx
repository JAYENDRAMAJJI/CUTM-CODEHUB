import { useMemo } from 'react';
import { BarChart3, Users, Code2, Trophy, TrendingUp } from 'lucide-react';
import { getAnalyticsSnapshot } from '../../data/adminApi';

export default function AdminAnalytics() {
  const snapshot = useMemo(() => getAnalyticsSnapshot(), []);
  const trendRows = [
    { metric: 'Daily Active Users', value: snapshot.dailyActiveUsers.toLocaleString(), change: '+6.2%' },
    { metric: 'Problems Solved', value: snapshot.solvedCount.toLocaleString(), change: '+9.8%' },
    { metric: 'Contest Participation', value: snapshot.contestParticipation.toLocaleString(), change: '+3.1%' },
    { metric: 'Avg. Acceptance Rate', value: snapshot.acceptanceRate, change: '+1.4%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Monitor growth, engagement, and platform performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 inline-flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600" /> {snapshot.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Problems Available</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 inline-flex items-center gap-2"><Code2 className="w-5 h-5 text-emerald-600" /> {snapshot.totalProblems.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Active Contests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 inline-flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-600" /> {snapshot.activeContests.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Weekly Growth</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1 inline-flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {snapshot.weeklyGrowth}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            KPI Snapshot
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {trendRows.map((row) => (
            <div key={row.metric} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50">
              <p className="text-sm text-slate-700">{row.metric}</p>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{row.value}</p>
                <p className="text-xs text-emerald-700">{row.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
