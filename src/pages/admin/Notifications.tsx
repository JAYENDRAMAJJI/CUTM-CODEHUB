import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bell, CalendarClock, Megaphone, SendHorizontal, Trash2 } from 'lucide-react';
import {
  createNotification,
  deleteNotification,
  getAnnouncementSummary,
  getNotifications,
  NotificationTemplate,
  scheduleAnnouncement,
  sendAnnouncementNow,
} from '../../data/adminApi';

export default function AdminNotifications() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All users');
  const [channel, setChannel] = useState('In-app');
  const [scheduledFor, setScheduledFor] = useState('');

  useEffect(() => {
    setTemplates(getNotifications());
  }, []);

  const summary = useMemo(() => getAnnouncementSummary(), [templates]);

  const onSendAnnouncement = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      return;
    }

    const next = createNotification({
      title: title.trim(),
      message: message.trim(),
      audience,
      channel,
      scheduledFor: scheduledFor ? toStorageDateTime(scheduledFor) : undefined,
    });

    const created = next[0];
    if (!created) {
      setTemplates(next);
      return;
    }

    setTemplates(scheduledFor ? next : sendAnnouncementNow(created.id));
    setTitle('');
    setMessage('');
    setScheduledFor('');
  };

  const onSendNow = (id: string) => {
    setTemplates(sendAnnouncementNow(id));
  };

  const onScheduleOneHour = (id: string) => {
    const nextHour = new Date(Date.now() + 60 * 60 * 1000);
    const scheduleAt = toStorageDateTime(toDateTimeLocalValue(nextHour));
    setTemplates(scheduleAnnouncement(id, scheduleAt));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Announcement Page</h1>
        <p className="text-slate-500 mt-1">Send announcements, notify users, and schedule notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Sent</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.sent}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Scheduled</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{summary.scheduled}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Draft</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.draft}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Notified Users</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{summary.notifiedUsers.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={onSendAnnouncement} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-indigo-600" />
          Create Announcement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="announcement-title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              id="announcement-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="announcement-channel" className="block text-sm font-medium text-slate-700 mb-1">Channel</label>
            <select
              id="announcement-channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="In-app">In-app</option>
              <option value="Email">Email</option>
              <option value="In-app + Email">In-app + Email</option>
              <option value="Banner + In-app">Banner + In-app</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="announcement-message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            id="announcement-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="announcement-audience" className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
            <select
              id="announcement-audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="All users">All users</option>
              <option value="All students">All students</option>
              <option value="Beginner track">Beginner track</option>
              <option value="Intermediate track">Intermediate track</option>
              <option value="Admins">Admins</option>
            </select>
          </div>
          <div>
            <label htmlFor="announcement-schedule" className="block text-sm font-medium text-slate-700 mb-1">Schedule (optional)</label>
            <input
              id="announcement-schedule"
              type="datetime-local"
              value={scheduledFor}
              onChange={(event) => setScheduledFor(event.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {scheduledFor ? <CalendarClock className="w-4 h-4" /> : <SendHorizontal className="w-4 h-4" />}
          {scheduledFor ? 'Schedule Notification' : 'Send Announcement'}
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            Announcement Queue
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {templates.map((template) => (
            <div key={template.id} className="px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">{template.title}</p>
                <p className="text-sm text-slate-500">{template.message}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {template.audience} • {template.channel} • Created {readableDate(template.createdAt)}
                  {template.scheduledFor ? ` • Scheduled ${readableDate(template.scheduledFor)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  template.status === 'Sent'
                    ? 'bg-emerald-100 text-emerald-700'
                    : template.status === 'Scheduled'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {template.status}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {template.deliveredCount.toLocaleString()} users
                </span>
                <button
                  title={`Send now ${template.title}`}
                  aria-label={`Send now ${template.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  onClick={() => onSendNow(template.id)}
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
                <button
                  title={`Schedule ${template.title}`}
                  aria-label={`Schedule ${template.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                  onClick={() => onScheduleOneHour(template.id)}
                >
                  <CalendarClock className="w-4 h-4" />
                </button>
                <button
                  title={`Delete ${template.title}`}
                  aria-label={`Delete ${template.title}`}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setTemplates(deleteNotification(template.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function toStorageDateTime(dateTimeLocal: string): string {
  return dateTimeLocal.replace('T', ' ');
}

function readableDate(value: string): string {
  const normalized = value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}
