import React, { useState } from 'react';
import { SystemUser, AdminSubRole } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { UserCheck, Shield, Key, CheckCircle2, UserPlus } from 'lucide-react';

export interface AdminUsersRolesViewProps {
  users: SystemUser[];
  onUpdateUserRole: (userId: string, newRole: AdminSubRole) => void;
}

export const AdminUsersRolesView: React.FC<AdminUsersRolesViewProps> = ({
  users,
  onUpdateUserRole
}) => {
  const { addToast } = useToast();
  const [userList, setUserList] = useState<SystemUser[]>(users);

  const handleRoleChange = (userId: string, newRole: AdminSubRole) => {
    onUpdateUserRole(userId, newRole);
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addToast({
      type: 'success',
      title: 'Role Permissions Updated',
      message: `User permissions recalculated for ${newRole.toUpperCase()}.`
    });
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState('');
  const [newOperatorEmail, setNewOperatorEmail] = useState('');
  const [newOperatorRole, setNewOperatorRole] = useState<AdminSubRole>('operations');
  const [newOperatorPin, setNewOperatorPin] = useState('4821');

  const handleCreateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperatorName.trim() || !newOperatorEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide the operator full legal name and work email.'
      });
      return;
    }

    const defaultPermissionsMap: Record<AdminSubRole, string[]> = {
      super_admin: ['all_access', 'role_management', 'system_audit', 'content_publish', 'employer_verify', 'payout_authorize'],
      operations: ['job_review', 'queue_dispatch', 'moderation_action'],
      verification: ['employer_verify', 'worker_evidence_verify', 'cac_audit'],
      editorial: ['content_edit', 'content_publish', 'opportunities_review'],
      support: ['ticket_resolve', 'user_assistance'],
      analyst: ['telemetry_read', 'data_export']
    };

    const newStaffUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: newOperatorName.trim(),
      email: newOperatorEmail.trim(),
      role: newOperatorRole,
      status: 'active',
      lastActive: 'Provisioned Just Now',
      permissions: defaultPermissionsMap[newOperatorRole] || ['all_access']
    };

    setUserList((prev) => [newStaffUser, ...prev]);
    setIsAddModalOpen(false);
    setNewOperatorName('');
    setNewOperatorEmail('');

    addToast({
      type: 'success',
      title: 'Staff Credential Provisioned',
      message: `${newStaffUser.name} (${newStaffUser.role.toUpperCase()}) created with PIN: ${newOperatorPin}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
            Admin Users & Role Permissions (Screen 24)
          </h1>
          <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
            Role-Based Access Control (RBAC): Super Admin, Operations, Verification, Editorial, Support, Analyst.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0E5A46] hover:bg-[#08382B] text-white shrink-0 cursor-pointer"
        >
          Add / Provision Staff Account
        </Button>
      </div>

      {/* Provision Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#C4C8C5] p-5 sm:p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#EBEBDD] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#E7F3EF] text-[#0E5A46] rounded">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1F1C]">Provision Staff Account</h3>
                  <p className="text-[11px] text-[#5A6E68]">Super Admin User Onboarding Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-[#5A6E68] hover:text-[#0F1F1C] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOperator} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0F1F1C] block">Full Legal / Staff Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amina Bello"
                  value={newOperatorName}
                  onChange={(e) => setNewOperatorName(e.target.value)}
                  className="w-full bg-[#F7F7EE] border border-[#C4C8C5] rounded p-2 text-xs focus:ring-1 focus:ring-[#0E5A46]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F1F1C] block">Work Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. amina.b@tourmsworkforce.com.ng"
                  value={newOperatorEmail}
                  onChange={(e) => setNewOperatorEmail(e.target.value)}
                  className="w-full bg-[#F7F7EE] border border-[#C4C8C5] rounded p-2 text-xs focus:ring-1 focus:ring-[#0E5A46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#0F1F1C] block">Assigned Role:</label>
                  <select
                    value={newOperatorRole}
                    onChange={(e) => setNewOperatorRole(e.target.value as AdminSubRole)}
                    className="w-full bg-[#F7F7EE] border border-[#C4C8C5] rounded p-2 text-xs focus:ring-1 focus:ring-[#0E5A46]"
                  >
                    <option value="operations">Operations Officer</option>
                    <option value="verification">Verification Lead</option>
                    <option value="editorial">Senior Editorial Desk</option>
                    <option value="support">Platform Support</option>
                    <option value="analyst">Data Analyst</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0F1F1C] block">Initial PIN / Passkey:</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newOperatorPin}
                    onChange={(e) => setNewOperatorPin(e.target.value)}
                    className="w-full bg-[#F7F7EE] border border-[#C4C8C5] rounded p-2 text-xs font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#F2F7F4] border border-[#C2DDD3] rounded text-[11px] text-[#0E5A46]">
                <strong>Security Policy:</strong> Accounts created here are immediately authenticated for the Staff & Admin Console.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EBEBDD]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#0E5A46] hover:bg-[#08382B]"
                >
                  Create Staff Credential
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#C4C8C5] overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EBEBDD] text-[#0F1F1C] border-b border-[#C4C8C5] font-bold">
            <tr>
              <th className="p-3.5">Operator Name & Email</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Assigned Capabilities</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Active</th>
              <th className="p-3.5 text-right">Role Configuration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBDD]">
            {userList.map((user) => (
              <tr key={user.id} className="hover:bg-[#F7F7EE] transition-colors">
                <td className="p-3.5">
                  <p className="font-bold text-[#0F1F1C]">{user.name}</p>
                  <p className="text-[#5A6E68] font-mono text-[11px]">{user.email}</p>
                </td>
                <td className="p-3.5">
                  <span className="font-mono px-2 py-0.5 bg-[#EBEBDD] rounded text-[11px] font-bold text-[#0F1F1C] uppercase">
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5">
                  <div className="flex flex-wrap gap-1 text-[10px] text-[#0E5A46]">
                    {user.permissions.slice(0, 3).map((perm) => (
                      <span key={perm} className="bg-[#E7F3EF] px-1.5 py-0.5 rounded">
                        {perm}
                      </span>
                    ))}
                    {user.permissions.length > 3 && (
                      <span className="text-[#5A6E68]">+{user.permissions.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E5A46]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46]" />
                    <span>Active</span>
                  </span>
                </td>
                <td className="p-3.5 text-[#5A6E68] tabular-nums">{user.lastActive}</td>
                <td className="p-3.5 text-right">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as AdminSubRole)}
                    className="p-1 bg-white border border-[#C4C8C5] rounded text-xs text-[#0F1F1C] focus:outline-none focus:ring-1 focus:ring-[#0E5A46] min-h-[32px]"
                    aria-label={`Change role for ${user.name}`}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="operations">Operations</option>
                    <option value="verification">Verification</option>
                    <option value="editorial">Editorial</option>
                    <option value="support">Support</option>
                    <option value="analyst">Analyst</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
