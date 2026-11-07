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
      </div>

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
