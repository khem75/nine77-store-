import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import '../admin.css';
import AdminSidebar from '@/components/admin/sidebar';
import AdminTopbar from '@/components/admin/topbar';
import { getAdminSession } from '@/lib/auth-actions';

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | NINE77 Admin',
  },
  description: 'NINE77 Admin Panel',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="admin-panel flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex flex-col shrink-0 h-full overflow-y-auto"
        style={{ width: 'var(--sidebar-width, 240px)' }}
      >
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar (mobile hamburger + title) */}
        <AdminTopbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="admin-page-enter px-4 sm:px-6 lg:px-8 py-7 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
