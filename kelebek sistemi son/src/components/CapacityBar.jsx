import React from 'react';
import { Users, Building2 } from 'lucide-react';

export default function CapacityBar({ students, rooms, activeGrades }) {
  const activeCount = students.filter(s => !s.isExempt && activeGrades.includes(s.grade)).length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.rows * r.cols * 2, 0);
  const pct = totalCapacity > 0 ? Math.min((activeCount / totalCapacity) * 100, 100) : 0;
  const isOverCapacity = activeCount > totalCapacity && totalCapacity > 0;
  const isNearCapacity = pct >= 90 && !isOverCapacity;

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
          <Users className="w-4 h-4" />
          <span className="text-foreground font-semibold">{activeCount}</span>
          <span>öğrenci</span>
        </div>

        <div className="flex-1 relative">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverCapacity ? 'bg-red-500' : isNearCapacity ? 'bg-amber-400' : 'bg-primary'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
          <Building2 className="w-4 h-4" />
          <span>Kapasite:</span>
          <span className={`font-semibold ${isOverCapacity ? 'text-red-600' : 'text-foreground'}`}>
            {totalCapacity}
          </span>
          {rooms.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({rooms.length} salon)
            </span>
          )}
        </div>

        {isOverCapacity && (
          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            Kapasite aşıldı!
          </span>
        )}
        {isNearCapacity && (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Kapasite dolmak üzere
          </span>
        )}
      </div>
    </div>
  );
}