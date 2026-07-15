'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, LogOut, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { adminLogout, changeAdminPassword } from '@/lib/auth-actions';
import type { AdminUser } from '@/types/admin';

interface ProfileFormProps {
  user: AdminUser;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, startLogout] = useTransition();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    startTransition(async () => {
      const result = await changeAdminPassword(newPassword);
      if (result.success) {
        toast.success('Password changed successfully');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(result.error ?? 'Failed to change password');
      }
    });
  }

  function handleLogout() {
    startLogout(async () => {
      await adminLogout();
    });
  }

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Admin';

  return (
    <div className="space-y-6 max-w-xl">
      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 mb-5 flex items-center gap-2">
          <User size={15} className="text-[#C9A227]" />
          Admin Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center shadow-sm">
            <span className="text-[22px] font-black text-[#C9A227]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[16px] font-bold text-[#111111]">{displayName}</p>
            <p className="text-[13px] text-[#9B9BA4]">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C9A227]/10 text-[#8a6e1a]">
              Super Admin
            </span>
          </div>
        </div>

        {/* Read-only fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={displayName}
              readOnly
              className="admin-input bg-[#F4F4F6] text-[#6B6B70] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user.email ?? ''}
              readOnly
              className="admin-input bg-[#F4F4F6] text-[#6B6B70] cursor-not-allowed font-mono text-[13px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-4"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 flex items-center gap-2">
          <Lock size={15} className="text-[#C9A227]" />
          Change Password
        </h2>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="admin-input pr-10"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9BA4] hover:text-[#6B6B70] transition-colors"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`admin-input pr-10 ${
                confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : ''
              }`}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9BA4] hover:text-[#6B6B70] transition-colors"
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-500 text-[11.5px] mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={isPending}
          className="admin-btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Changing…
            </>
          ) : (
            <>
              <Save size={15} />
              Change Password
            </>
          )}
        </button>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 mb-4">
          Session
        </h2>
        <p className="text-[13px] text-[#9B9BA4] mb-4">
          Sign out of the NINE77 Admin Panel. You'll be redirected to the login screen.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="admin-btn-danger"
        >
          {isLoggingOut ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Signing out…
            </>
          ) : (
            <>
              <LogOut size={15} />
              Sign Out
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
