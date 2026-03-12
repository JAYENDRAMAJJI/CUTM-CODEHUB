import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, UserCheck, UserX, Mail, Trash2, Pencil, Eye } from 'lucide-react';
import { AdminUser, createUser, deleteUser, getUsers, toggleUserStatus, updateUserDetails, UserRole } from '../../data/adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Student' | 'Admin'>('All');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  const activeUsers = filteredUsers.filter((user) => user.status === 'Active').length;

  const onAddUser = () => {
    const name = window.prompt('Enter user name');
    if (!name) {
      return;
    }
    const email = window.prompt('Enter user email', `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    if (!email) {
      return;
    }
    const roleInput = window.prompt('Role: Student or Admin', 'Student');
    const role: UserRole = roleInput?.toLowerCase() === 'admin' ? 'Admin' : 'Student';
    setUsers(createUser({ name, email, role }));
  };

  const onQuickEdit = (user: AdminUser) => {
    const name = window.prompt('Update user name', user.name);
    if (!name) {
      return;
    }
    const email = window.prompt('Update user email', user.email);
    if (!email) {
      return;
    }
    const roleInput = window.prompt('Role: Student or Admin', user.role);
    const role: UserRole = roleInput?.toLowerCase() === 'admin' ? 'Admin' : 'Student';
    setUsers(updateUserDetails(user.id, { name, email, role }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage administrators and students on the platform.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
          onClick={onAddUser}
          title="Add user"
          aria-label="Add user"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Visible Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{filteredUsers.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Active Accounts</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{activeUsers}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500">Suspended Accounts</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{filteredUsers.length - activeUsers}</p>
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
              placeholder="Search by name, email or ID"
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'All' | 'Student' | 'Admin')}
            className="w-full lg:w-48 py-2 px-3 border border-slate-200 rounded-lg text-sm"
            title="Filter by role"
            aria-label="Filter by role"
          >
            <option value="All">All roles</option>
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3">User ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{user.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-slate-500 text-xs">{user.email}</p>
                  </td>
                  <td className="px-5 py-3">{user.role}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{user.joinedOn}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title={`Email ${user.name}`}
                        aria-label={`Email ${user.name}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => { window.location.href = `mailto:${user.email}`; }}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        title={`Edit ${user.name}`}
                        aria-label={`Edit ${user.name}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => onQuickEdit(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/admin/users/${user.id}`}
                        title={`View details of ${user.name}`}
                        aria-label={`View details of ${user.name}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        title={`Activate or suspend ${user.name}`}
                        aria-label={`Activate or suspend ${user.name}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => setUsers(toggleUserStatus(user.id))}
                      >
                        {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        title={`Delete ${user.name}`}
                        aria-label={`Delete ${user.name}`}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setUsers(deleteUser(user.id))}
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
