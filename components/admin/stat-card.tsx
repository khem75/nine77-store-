'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  accent?: boolean;
  index?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  description,
  accent = false,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="admin-card p-5 group hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9B9BA4] mb-2">{label}</p>
          <p className={`text-3xl font-black tracking-tight leading-none ${accent ? 'text-[#C9A227]' : 'text-[#111111]'}`}>
            {value}
          </p>
          {description && (
            <p className="text-[12px] text-[#9B9BA4] mt-2 font-medium">{description}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            accent
              ? 'bg-[#C9A227]/10'
              : 'bg-black/[0.04]'
          }`}
        >
          <Icon
            size={18}
            className={accent ? 'text-[#C9A227]' : 'text-[#6B6B70]'}
          />
        </div>
      </div>
    </motion.div>
  );
}
