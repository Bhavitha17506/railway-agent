import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Search } from 'lucide-react';
import { authService } from '../services/authService';
import { LoadingState } from '../components/ReviewModal';
import { useNotifications } from '../context/NotificationContext';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'ENGINEER',
    badge_id: '',
    department: 'Track Infrastructure'
  });

  const { addToast } = useNotifications();

  const loadUsers = async () => {
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await authService.createUser(newUser);
      addToast(`User ${newUser.username} created successfully.`, 'success');
      setShowAddModal(false);
      loadUsers();
    } catch (err) {
      addToast("Failed to create user.", "error");
    }
  };

  if (loading) return <LoadingState message="Loading enterprise user directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Role-Based Access Control & User Directory
          </h2>
          <p className="text-xs text-slate-500">
            Manage railway engineer credentials, inspector privileges, and maintenance team permissions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#16A34A] text-white text-xs font-bold shadow-md flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add System User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Role & RBAC Access</th>
              <th className="py-3 px-4">License / Badge ID</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">
                  {u.first_name} {u.last_name}
                  <span className="text-[11px] text-slate-500 block font-mono">@{u.username}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {u.role_display || u.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">{u.badge_id || 'N/A'}</td>
                <td className="py-3 px-4 text-slate-600">{u.department}</td>
                <td className="py-3 px-4 font-mono text-slate-500">{u.email}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-emerald-600 font-bold">● Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add New Railway Operational User</h3>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                  placeholder="e.g. inspector_mark"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Permission</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                >
                  <option value="ENGINEER">Railway Engineer (Full Review)</option>
                  <option value="ADMIN">System Administrator (Full)</option>
                  <option value="INSPECTOR">Field Inspector (Upload/Patrol)</option>
                  <option value="MAINTENANCE">Maintenance Team (Work Orders)</option>
                  <option value="VIEWER">Auditor / Viewer (Read Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge / License ID</label>
                <input
                  type="text"
                  value={newUser.badge_id}
                  onChange={(e) => setNewUser({ ...newUser, badge_id: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                  placeholder="e.g. RE-9942"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#14532D] text-white font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
