import { useEffect, useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { NotificationTemplate, getNotifications } from '../../../data/adminApi';
import { Bell, Trophy, BookOpen, AlertCircle } from 'lucide-react';

const FALLBACK_NOTIFICATIONS: Pick<NotificationTemplate, 'id' | 'title' | 'message' | 'audience' | 'channel'>[] = [
  { id: 'N-fallback-1', title: 'Contest starts in 2 hours', message: 'Weekly Challenge 42 begins at 8 PM tonight. Make sure you\'re registered!', audience: 'All Students', channel: 'Email' },
  { id: 'N-fallback-2', title: 'New DP tutorial uploaded', message: 'A new tutorial on Dynamic Programming Fundamentals has been added to the Courses section.', audience: 'All Students', channel: 'In-App' },
  { id: 'N-fallback-3', title: 'Your submission was accepted', message: 'Congratulations! Your solution for "Two Sum" has been accepted.', audience: 'Student', channel: 'In-App' },
];

function notifIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('contest')) return <Trophy className="w-4 h-4 text-amber-500" />;
  if (t.includes('course') || t.includes('tutorial')) return <BookOpen className="w-4 h-4 text-sky-500" />;
  return <AlertCircle className="w-4 h-4 text-indigo-500" />;
}

export default function StudentNotifications() {
  const [all, setAll] = useState<NotificationTemplate[]>([]);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const sync = () => setAll(getNotifications());
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const sent = all.filter((n) => n.status === 'Sent');
  const displayed = sent.length > 0
    ? sent
    : (FALLBACK_NOTIFICATIONS as NotificationTemplate[]);

  const filtered = tab === 'unread' ? displayed.filter((n) => !read.has(n.id)) : displayed;
  const unreadCount = displayed.filter((n) => !read.has(n.id)).length;

  const markRead = (id: string) => setRead((prev) => new Set(prev).add(id));
  const markAllRead = () => setRead(new Set(displayed.map((n) => n.id)));

  return (
    <StudentPageFrame title="Notifications" subtitle="Stay updated with contest announcements, course updates, and system alerts.">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 border-b border-slate-200">
            {(['all', 'unread'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                  tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'unread' ? `Unread (${unreadCount})` : 'All'}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-700">
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.map((n) => {
            const isRead = read.has(n.id);
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full text-left flex items-start gap-4 border rounded-xl p-4 transition-colors ${
                  isRead ? 'border-slate-200 bg-white' : 'border-indigo-200 bg-indigo-50/40'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                  isRead ? 'bg-slate-100' : 'bg-indigo-100'
                }`}>
                  {notifIcon(n.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">{n.channel}</span>
                    <span className="text-slate-200">.</span>
                    <span className="text-xs text-slate-400">{n.audience}</span>
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-10 text-slate-400">
              <Bell className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No notifications to show</p>
            </div>
          )}
        </div>
      </div>
    </StudentPageFrame>
  );
}
