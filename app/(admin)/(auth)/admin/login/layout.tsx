import type { Metadata } from 'next';
import '../../../admin.css';

export const metadata: Metadata = {
  title: 'Sign In | NINE77 Admin',
  description: 'Sign in to NINE77 Admin Panel',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-panel">{children}</div>;
}
