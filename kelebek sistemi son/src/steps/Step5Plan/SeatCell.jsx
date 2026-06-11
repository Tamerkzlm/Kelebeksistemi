import React from 'react';

const GRADE_COLORS = {
  '9':  { bg: 'bg-blue-100',    border: 'border-blue-300',    text: 'text-blue-800',    dragBg: 'bg-blue-200' },
  '10': { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800', dragBg: 'bg-emerald-200' },
  '11': { bg: 'bg-orange-100',  border: 'border-orange-300',  text: 'text-orange-800',  dragBg: 'bg-orange-200' },
  '12': { bg: 'bg-purple-100',  border: 'border-purple-300',  text: 'text-purple-800',  dragBg: 'bg-purple-200' },
};

export default function SeatCell({ student, seatLabel, isViolation, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const colors = student ? (GRADE_COLORS[student.grade] || { bg: 'bg-secondary', border: 'border-border', text: 'text-foreground', dragBg: 'bg-secondary' }) : null;

  if (!student) {
    return (
      <div
        onDragOver={e => { e.preventDefault(); onDragOver?.(); }}
        onDrop={e => { e.preventDefault(); onDrop?.(); }}
        className={`relative rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all min-h-[52px] ${
          isDragOver ? 'border-primary bg-accent' : 'border-border/40 bg-secondary/30'
        }`}
      >
        <span className="text-[10px] text-muted-foreground/50 font-medium">{seatLabel}</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e)}
      onDragOver={e => { e.preventDefault(); onDragOver?.(); }}
      onDrop={e => { e.preventDefault(); onDrop?.(); }}
      onDragEnd={onDragEnd}
      className={`relative rounded-lg border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all min-h-[52px] px-1 py-1.5 select-none ${
        colors.bg
      } ${
        isViolation
          ? 'border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          : isDragOver
          ? 'border-primary shadow-md scale-105'
          : `${colors.border} hover:shadow-sm hover:scale-[1.02]`
      }`}
    >
      <span className={`text-[9px] font-bold ${colors.text} opacity-60`}>{seatLabel}</span>
      <span className={`text-[10px] font-semibold ${colors.text} text-center leading-tight mt-0.5 line-clamp-2`}>
        {student.adSoyad}
      </span>
      <span className={`text-[9px] font-medium ${colors.text} opacity-75 mt-0.5`}>{student.sinif?.toUpperCase()}</span>
    </div>
  );
}