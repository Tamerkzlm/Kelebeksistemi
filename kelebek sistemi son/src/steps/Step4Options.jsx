import React from 'react';
import { ChevronRight, ChevronLeft, Play, AlertTriangle } from 'lucide-react';

const GRADE_COLORS = {
  '9': 'bg-blue-100 border-blue-300 text-blue-800',
  '10': 'bg-emerald-100 border-emerald-300 text-emerald-800',
  '11': 'bg-orange-100 border-orange-300 text-orange-800',
  '12': 'bg-purple-100 border-purple-300 text-purple-800',
};

export default function Step4Options({ students, rooms, activeGrades, onGradesChange, onGenerate, onBack }) {
  const availableGrades = [...new Set(students.filter(s => !s.isExempt).map(s => s.grade))].sort();
  const activeCount = students.filter(s => !s.isExempt && activeGrades.includes(s.grade)).length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.rows * r.cols * 2, 0);
  const isOverCapacity = activeCount > totalCapacity;
  const tooFewGrades = activeGrades.filter(g => availableGrades.includes(g)).length < 2;

  const toggle = (grade) => {
    const updated = activeGrades.includes(grade)
      ? activeGrades.filter(g => g !== grade)
      : [...activeGrades, grade];
    onGradesChange(updated);
  };

  const gradeStats = availableGrades.map(g => ({
    grade: g,
    count: students.filter(s => !s.isExempt && s.grade === g).length,
    active: activeGrades.includes(g),
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">Sınav Seçenekleri</h2>
        <p className="text-muted-foreground">Sınava hangi sınıf düzeylerinin gireceğini seçin.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Sınıf Düzeyleri</h3>
        <div className="grid grid-cols-2 gap-3">
          {gradeStats.map(({ grade, count, active }) => (
            <button
              key={grade}
              onClick={() => toggle(grade)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                active
                  ? `${GRADE_COLORS[grade]} border-current`
                  : 'bg-secondary border-transparent text-muted-foreground hover:border-border'
              }`}
            >
              <div>
                <div className="font-bold text-lg">{grade}. Sınıf</div>
                <div className="text-sm opacity-75">{count} öğrenci</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'bg-current border-current' : 'border-muted-foreground'}`}>
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-5">
        <h3 className="font-semibold text-foreground mb-3 text-sm">Özet</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sınava girecek öğrenci</span>
            <span className="font-semibold text-foreground">{activeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toplam salon kapasitesi</span>
            <span className="font-semibold text-foreground">{totalCapacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Boş koltuk</span>
            <span className={`font-semibold ${isOverCapacity ? 'text-red-600' : 'text-emerald-600'}`}>
              {isOverCapacity ? '—' : totalCapacity - activeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {tooFewGrades && activeGrades.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">Kelebek sistemi için en az 2 farklı sınıf düzeyi seçilmelidir.</p>
        </div>
      )}
      {isOverCapacity && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">Öğrenci sayısı salon kapasitesini aşıyor! Plan oluşturulamaz.</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Geri
        </button>
        <button
          onClick={onGenerate}
          disabled={isOverCapacity || activeCount === 0 || tooFewGrades}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" /> Planı Oluştur
        </button>
      </div>
    </div>
  );
}