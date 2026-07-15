// Admin skeleton loading components

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`admin-skeleton ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`admin-card p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2.5 flex-1">
          <SkeletonLine className="h-3 w-20" />
          <SkeletonLine className="h-8 w-16" />
          <SkeletonLine className="h-3 w-28" />
        </div>
        <SkeletonLine className="w-10 h-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-10 w-10 rounded-lg" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-4 w-36" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-4 w-20" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-4 w-16" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-6 w-16 rounded-md" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-6 w-10 rounded-md" />
      </td>
      <td className="px-4 py-3.5">
        <SkeletonLine className="h-4 w-24" />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex gap-2">
          <SkeletonLine className="h-7 w-7 rounded-lg" />
          <SkeletonLine className="h-7 w-7 rounded-lg" />
          <SkeletonLine className="h-7 w-7 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-5 border-b border-black/[0.06]">
          <SkeletonLine className="h-5 w-48" />
        </div>
        <table className="admin-table">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
