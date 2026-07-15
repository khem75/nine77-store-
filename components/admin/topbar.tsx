'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/homepage': 'Homepage Manager',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Profile',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/admin/products/') && pathname.includes('/edit')) return 'Edit Product';
  return 'NINE77 Admin';
}

export default function AdminTopbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <>
      {/* Topbar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 border-b border-black/[0.06] bg-white/90 backdrop-blur-md"
        style={{ height: 'var(--topbar-height, 60px)' }}
      >
        {/* Left: hamburger (mobile) + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors -ml-1"
            aria-label="Open menu"
          >
            <Menu size={18} className="text-[#6B6B70]" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-[#111111] leading-none">{title}</h1>
            <p className="text-[11px] text-[#9B9BA4] mt-0.5 hidden sm:block">NINE77 Admin Panel</p>
          </div>
        </div>

        {/* Right: store link + avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-bold text-[#C9A227]">N</span>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
              style={{ width: 240 }}
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
