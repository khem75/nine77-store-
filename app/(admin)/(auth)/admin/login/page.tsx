'use client';

import { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { adminLogin } from '@/lib/auth-actions';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    startTransition(async () => {
      const result = await adminLogin(email, password);
      if (result.success) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(result.error ?? 'Invalid credentials. Please try again.');
      }
    });
  }

  return (
    <div
      className="admin-panel min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #F7F7F8 0%, #EEEEEF 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-black/[0.06] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-black/[0.06]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center shadow-sm">
                <Sparkles size={16} className="text-[#C9A227]" />
              </div>
              <div>
                <p className="text-[14px] font-black tracking-wider text-[#111111] uppercase leading-none">NINE77</p>
                <p className="text-[11px] text-[#9B9BA4] font-medium mt-0.5">Admin Panel</p>
              </div>
            </div>
            <h1 className="text-[22px] font-bold text-[#111111] tracking-tight">Sign in</h1>
            <p className="text-[13px] text-[#9B9BA4] mt-1">Access your store admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
              >
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-[12.5px] text-red-600 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@nine77.com"
                className="admin-input"
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="admin-input pr-10"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9BA4] hover:text-[#6B6B70] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="admin-btn-primary w-full justify-center h-11 text-[14px] mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6">
            <p className="text-[11px] text-[#C0C0C8] text-center">
              NINE77 Admin Panel — Restricted Access
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="admin-panel min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F7F7F8 0%, #EEEEEF 100%)' }}>
        <div className="text-[13px] text-[#9B9BA4] font-medium">Loading session...</div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
