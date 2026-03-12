import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserX, UserCheck, Trash2, Activity } from 'lucide-react';
import { AdminUser, AdminUserActivity, deleteUser, getUserActivity, getUserById, toggleUserStatus, updateUserDetails, UserRole } from '../../data/adminApi';

export default function AdminUserDetail() {
  const { userId = '' } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [activity, setActivity] = useState<AdminUserActivity[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Student');

  useEffect(() => {
    const foundUser = getUserById(userId);
    setUser(foundUser);
    setActivity(getUserActivity(userId));
    if (foundUser) {
      setName(foundUser.name);
      setEmail(foundUser.email);
      setRole(foundUser.role);
    }
  }, [userId]);

  const isValidForm = useMemo(() => {
    return Boolean(name.trim()) && Boolean(email.trim());
  }, [email, name]);

  if (!user) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900">User not found</h1>
        <p className="text-sm text-slate-500 mt-2">The requested user record does not exist.</p>
        <Link to="/admin/users" className="inline-flex mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          Back to user list
        </Link>
      </div>
    );
  }

  const refreshUser = () => {
    const latest = getUserById(userId);
    setUser(latest);
    setActivity(getUserActivity(userId));
  };

  const onSave = () => {
    if (!isValidForm) {
      return;
    }
    updateUserDetails(userId, { name: name.trim(), email: email.trim(), role });
    refreshUser();
  };

  const onToggleStatus = () => {
    toggleUserStatus(userId);
    refreshUser();
  };

  const onDelete = () => {
    deleteUser(userId);
    navigate('/admin/users', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to users
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">User Detail</h1>
          <p className="text-slate-500 mt-1">View user activity and update account details.</p>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {user.id}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-slate-900">Edit User Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                id="user-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="user-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="user-role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                id="user-role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <div className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 bg-slate-50">
                {user.status}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onSave}
              disabled={!isValidForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

            <button
              onClick={onToggleStatus}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
            </button>

            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </button>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-slate-900 inline-flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            User Activity
          </h2>

          <div className="mt-4 space-y-3">
            {activity.length === 0 ? (
              <p className="text-sm text-slate-500">No activity recorded for this user yet.</p>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-sm font-medium text-slate-800">{item.description}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.type}</span>
                    <span>{item.at}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
