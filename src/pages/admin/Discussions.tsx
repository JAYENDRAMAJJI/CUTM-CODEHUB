import { useEffect, useMemo, useState } from 'react';
import { Search, MessageSquareMore, Flag, ShieldAlert, Trash2, Ban, AlertTriangle } from 'lucide-react';
import {
  AdminDiscussion,
  banDiscussionUser,
  deleteDiscussion,
  deleteSpamDiscussion,
  getBannedDiscussionUsers,
  getDiscussionModerationSummary,
  getDiscussions,
  removeInappropriateComment,
  toggleDiscussionFlag,
} from '../../data/adminApi';

export default function AdminDiscussions() {
  const [threads, setThreads] = useState<AdminDiscussion[]>([]);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setThreads(getDiscussions());
    setBannedUsers(getBannedDiscussionUsers());
  }, []);

  const summary = useMemo(() => getDiscussionModerationSummary(), [threads, bannedUsers]);

  const filteredThreads = useMemo(() => {
    const q = search.toLowerCase();
    return threads.filter((row) => {
      return (
        row.id.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.author.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      );
    });
  }, [search, threads]);

  const onBanUser = (userHandle: string) => {
    setBannedUsers(banDiscussionUser(userHandle));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discussion Management</h1>
        <p className="text-slate-500 mt-1">Delete spam posts, remove inappropriate comments, and ban users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Discussions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.totalDiscussions}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Spam Posts</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{summary.spamPosts}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Inappropriate Comments</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{summary.inappropriateComments}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Banned Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.bannedUsers}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search discussions"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredThreads.map((row) => {
            const inappropriateComments = row.comments.filter((comment) => comment.inappropriate);

            return (
            <div key={row.id} className="p-5 space-y-3 hover:bg-slate-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-mono text-slate-500">{row.id}</p>
                  <h2 className="text-base font-semibold text-slate-900 truncate">{row.title}</h2>
                  <p className="text-sm text-slate-600 mt-1">By {row.author} in {row.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                    <MessageSquareMore className="w-3 h-3" />
                    {row.replies} replies
                  </span>
                  {row.flagged ? (
                    <button
                      className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 inline-flex items-center gap-1"
                      onClick={() => setThreads(toggleDiscussionFlag(row.id))}
                      title={`Unflag ${row.title}`}
                      aria-label={`Unflag ${row.title}`}
                    >
                      <Flag className="w-3 h-3" />
                      Flagged
                    </button>
                  ) : (
                    <button
                      className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center gap-1"
                      onClick={() => setThreads(toggleDiscussionFlag(row.id))}
                      title={`Flag ${row.title}`}
                      aria-label={`Flag ${row.title}`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      Clean
                    </button>
                  )}
                  {row.spam ? (
                    <button
                      className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 inline-flex items-center gap-1"
                      onClick={() => setThreads(deleteSpamDiscussion(row.id))}
                      title={`Delete spam post ${row.title}`}
                      aria-label={`Delete spam post ${row.title}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Spam Post
                    </button>
                  ) : (
                    <button
                      className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 inline-flex items-center gap-1"
                      onClick={() => setThreads(deleteDiscussion(row.id))}
                      title={`Delete ${row.title}`}
                      aria-label={`Delete ${row.title}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Post
                    </button>
                  )}
                  <button
                    className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 inline-flex items-center gap-1"
                    onClick={() => onBanUser(row.author)}
                    title={`Ban ${row.author}`}
                    aria-label={`Ban ${row.author}`}
                    disabled={bannedUsers.includes(row.author)}
                  >
                    <Ban className="w-3 h-3" />
                    {bannedUsers.includes(row.author) ? 'Banned' : 'Ban User'}
                  </button>
                </div>
              </div>

              {inappropriateComments.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Inappropriate Comments</p>
                  {inappropriateComments.map((comment) => (
                    <div key={comment.id} className="border border-red-200 bg-red-50 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="text-sm text-red-800">
                        <span className="font-medium">{comment.author}:</span> {comment.content}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 inline-flex items-center gap-1"
                          onClick={() => setThreads(removeInappropriateComment(row.id, comment.id))}
                          title={`Remove comment ${comment.id}`}
                          aria-label={`Remove comment ${comment.id}`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Remove Comment
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 inline-flex items-center gap-1"
                          onClick={() => onBanUser(comment.author)}
                          title={`Ban ${comment.author}`}
                          aria-label={`Ban ${comment.author}`}
                          disabled={bannedUsers.includes(comment.author)}
                        >
                          <Ban className="w-3 h-3" />
                          {bannedUsers.includes(comment.author) ? 'Banned' : 'Ban User'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {bannedUsers.includes(row.author) ? (
                <p className="text-xs text-rose-700 font-medium">Author is currently banned from discussions.</p>
              ) : null}
            </div>
          );
          })}
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No discussions match this search.</div>
          ) : null}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Banned Users</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {bannedUsers.length > 0 ? (
              bannedUsers.map((user) => (
                <span key={user} className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700 inline-flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  {user}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No banned users.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
