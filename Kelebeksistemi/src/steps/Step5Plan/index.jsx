import React, { useState } from 'react';
import { ChevronLeft, Printer, AlertTriangle, CheckCircle2, Building2, RotateCcw } from 'lucide-react';
import RoomGrid from './RoomGrid';
import { getSeatLabel } from '../../lib/algorithm';
import { buildRoomListHTML, buildClassListHTML } from './printBuilder';

const GRADE_COLORS = {
  '9':  'bg-blue-100 border-blue-300 text-blue-800',
  '10': 'bg-emerald-100 border-emerald-300 text-emerald-800',
  '11': 'bg-orange-100 border-orange-300 text-orange-800',
  '12': 'bg-purple-100 border-purple-300 text-purple-800',
};

function openPrintWindow(html) {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 600);
}

export default function Step5Plan({ plan, examInfo, onBack, onRegenerate }) {
  const [activeRoom, setActiveRoom] = useState(0);
  const [localPlan, setLocalPlan] = useState(plan);

  // Sync localPlan when parent regenerates a new plan
  React.useEffect(() => {
    setLocalPlan(plan);
  }, [plan]);

  if (!localPlan) return null;

  const { assignments, violations } = localPlan;

  const handleSwap = (src, dst) => {
    const newAssignments = localPlan.assignments.map((a, ai) => {
      if (ai !== activeRoom) return a;
      const newGrid = a.grid.map(row => [...row]);

      const srcGridCol = src.col * 2 + src.seatInBank;
      const dstGridCol = dst.col * 2 + dst.seatInBank;

      const srcStudent = newGrid[src.row][srcGridCol];
      const dstStudent = newGrid[dst.row][dstGridCol];

      if (srcStudent) srcStudent.koltuk = getSeatLabel(dst.col, dst.row, dst.seatInBank);
      if (dstStudent) dstStudent.koltuk = getSeatLabel(src.col, src.row, src.seatInBank);

      newGrid[dst.row][dstGridCol] = srcStudent;
      newGrid[src.row][srcGridCol] = dstStudent;

      const newViolations = [];
      for (let r = 0; r < a.room.rows; r++) {
        for (let c = 0; c < a.room.cols; c++) {
          const left = newGrid[r][c * 2];
          const right = newGrid[r][c * 2 + 1];
          if (left && right && left.grade === right.grade) {
            newViolations.push({ row: r, col: c });
          }
        }
      }

      return { ...a, grid: newGrid, violations: newViolations };
    });

    const totalViolations = newAssignments.reduce((s, a) => s + a.violations.length, 0);
    setLocalPlan({ ...localPlan, assignments: newAssignments, violations: totalViolations });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Oturma Planı</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {examInfo.okulAdi} — {examInfo.sinavDersi} — {examInfo.sinavTarihi}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openPrintWindow(buildRoomListHTML(localPlan, examInfo))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Printer className="w-4 h-4" /> Salon Listesi
          </button>
          <button
            onClick={() => openPrintWindow(buildClassListHTML(localPlan, examInfo))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Printer className="w-4 h-4" /> Şube Listesi
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Yeniden Oluştur
          </button>
        </div>
      </div>

      {/* Status bar */}
      {violations === 0 ? (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">Mükemmel! Hiçbir bankta ihlal yok. Tüm öğrenciler farklı sınıf düzeylerinde oturuyor.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>{violations} bankta kaçınılmaz ihlal</strong> oluştu — sınıf düzey sayıları dengesiz. İhlalli koltuklar kırmızı vurgulu gösteriliyor.
          </p>
        </div>
      )}

      {/* Grade legend */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries({ '9': '9. Sınıf', '10': '10. Sınıf', '11': '11. Sınıf', '12': '12. Sınıf' }).map(([g, label]) => (
          <div key={g} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${GRADE_COLORS[g]}`}>
            <div className={`w-2.5 h-2.5 rounded-sm border ${GRADE_COLORS[g]}`} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-red-300 bg-red-50 text-xs font-semibold text-red-700">
          <div className="w-2.5 h-2.5 rounded-sm border border-red-400 bg-red-100 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
          Kelebek İhlali
        </div>
      </div>

      {/* Room tabs */}
      <div className="flex gap-1 border-b border-border mb-5 overflow-x-auto">
        {assignments.map((a, i) => (
          <button
            key={i}
            onClick={() => setActiveRoom(i)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
              activeRoom === i
                ? 'border-primary text-primary bg-accent/50'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            {a.room.name}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeRoom === i ? 'bg-primary/10' : 'bg-secondary'}`}>
              {a.grid.flat().filter(Boolean).length}
            </span>
            {a.violations.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Active room grid */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">{assignments[activeRoom].room.name}</h3>
            <p className="text-xs text-muted-foreground">
              {assignments[activeRoom].room.rows} sıra × {assignments[activeRoom].room.cols} bank —{' '}
              <strong>{assignments[activeRoom].grid.flat().filter(Boolean).length}</strong> öğrenci —{' '}
              {assignments[activeRoom].violations.length === 0 ? (
                <span className="text-emerald-600 font-semibold">İhlal yok</span>
              ) : (
                <span className="text-red-600 font-semibold">{assignments[activeRoom].violations.length} ihlal</span>
              )}
            </p>
          </div>
          <p className="text-xs text-muted-foreground hidden md:block">Öğrenci yerlerini değiştirmek için sürükleyip bırakın</p>
        </div>
        <RoomGrid
          assignment={assignments[activeRoom]}
          onSwap={handleSwap}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Geri
        </button>
        <p className="text-xs text-muted-foreground">
          Yapımcı: <span className="font-semibold">Tamer Közleme</span> — Instagram: <a href="https://instagram.com/tamerkzlm" target="_blank" rel="noreferrer" className="text-primary hover:underline">@tamerkzlm</a>
        </p>
      </div>
    </div>
  );
}