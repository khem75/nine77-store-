import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="admin-empty">
      <div className="w-16 h-16 rounded-2xl bg-black/[0.04] flex items-center justify-center mb-2">
        <Icon size={28} className="text-[#C0C0C8]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#111111]">{title}</h3>
      {description && (
        <p className="text-[13px] text-[#9B9BA4] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="admin-btn-primary mt-2 text-sm"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="admin-btn-primary mt-2 text-sm"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
