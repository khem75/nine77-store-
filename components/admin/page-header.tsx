import Link from 'next/link';
import { ChevronRight, Plus, ArrowLeft } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: {
    label: string;
    href?: string;
    onClick?: string; // Not used in server component — use DashboardClient for that
    variant?: 'primary' | 'gold' | 'secondary';
    showPlusIcon?: boolean;
  };
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  const btnClass =
    action?.variant === 'gold'
      ? 'admin-btn-gold'
      : action?.variant === 'secondary'
      ? 'admin-btn-secondary'
      : 'admin-btn-primary';

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-2" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-[#C0C0C8]" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-[12px] text-[#9B9BA4] hover:text-[#6B6B70] transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[12px] text-[#9B9BA4] font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[22px] font-bold text-[#111111] tracking-tight leading-tight">{title}</h1>
        {description && (
          <p className="text-[13px] text-[#9B9BA4] mt-1 font-medium">{description}</p>
        )}
      </div>

      {action?.href && (
        <Link href={action.href} className={`${btnClass} self-start shrink-0`}>
          {action.showPlusIcon !== false && action.variant !== 'secondary' && <Plus size={14} />}
          {action.label}
        </Link>
      )}
    </div>
  );
}
