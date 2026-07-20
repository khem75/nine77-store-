'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Globe,
  Settings,
  User,
  LogOut,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { adminLogout } from '@/lib/auth-actions';
import { useTransition } from 'react';
import Logo from '@/components/logo';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Homepage', href: '/admin/homepage', icon: Globe },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Profile', href: '/admin/profile', icon: User },
];

export default function AdminSidebar({ onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleLogout() {
    startTransition(async () => {
      await adminLogout();
    });
  }

  return (
    <aside className="flex flex-col h-full bg-white border-r border-black/[0.06] select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/[0.06]">
        <Logo variant="admin" onClick={onClose} />
        {isMobile && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} className="text-[#6B6B70]" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9BA4] px-3 pb-2">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`admin-nav-item group relative ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon
                size={16}
                className={`shrink-0 transition-colors ${active ? 'text-[#C9A227]' : 'text-[#9B9BA4] group-hover:text-[#6B6B70]'}`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[10px] bg-[#C9A227]/10 -z-10"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                />
              )}
              {active && <ChevronRight size={12} className="text-[#C9A227] shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Divider + Logout */}
      <div className="px-3 py-4 border-t border-black/[0.06]">
        <Link
          href="/"
          target="_blank"
          className="admin-nav-item mb-1 text-[#6B6B70] hover:text-[#111111]"
          onClick={onClose}
        >
          <Globe size={15} className="shrink-0 text-[#9B9BA4]" />
          <span>View Store</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="admin-nav-item w-full text-left text-[#dc2626] hover:bg-red-50 hover:text-[#dc2626] transition-colors"
        >
          <LogOut size={15} className="shrink-0" />
          <span>{isPending ? 'Signing out…' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
}
