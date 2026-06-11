import React, { useState } from 'react';
import { School, BookOpen, Calendar, Clock, FileText, ChevronRight } from 'lucide-react';

const EXAM_TYPES = ['Yazılı Sınav', 'Ortak Sınav', 'Deneme Sınavı'];
const LESSON_HOURS = [
  '1. Ders', '2. Ders', '3. Ders', '4. Ders',
  '5. Ders', '6. Ders', '7. Ders', '8. Ders',
];

// Default school name injected once if empty
const DEFAULT_OKUL = 'Hz. Ayşe Kız AİHL';

export default function Step1ExamInfo({ examInfo, onChange, onNext }) {
  // Set default school name on first render if empty
  React.useEffect(() => {
    if (!examInfo.okulAdi) {
      onChange({ ...examInfo, okulAdi: DEFAULT_OKUL });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    onChange({ ...examInfo, [field]: value });
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!examInfo.okulAdi?.trim()) e.okulAdi = 'Okul adı gerekli';
    if (!examInfo.sinavDersi?.trim()) e.sinavDersi = 'Sınav dersi gerekli';
    if (!examInfo.sinavTarihi?.trim()) e.sinavTarihi = 'Sınav tarihi gerekli';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">Sınav Bilgileri</h2>
        <p className="text-muted-foreground">Bu bilgiler yazdırma çıktılarında görünecektir.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
        {/* Okul Adı */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <span className="flex items-center gap-1.5"><School className="w-4 h-4 text-primary" /> Okul Adı</span>
          </label>
          <input
            type="text"
            value={examInfo.okulAdi || ''}
            onChange={e => update('okulAdi', e.target.value)}
            placeholder="Hz. Ayşe Kız AİHL"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.okulAdi ? 'border-red-400' : 'border-border'}`}
          />
          {errors.okulAdi && <p className="text-xs text-red-500 mt-1">{errors.okulAdi}</p>}
        </div>

        {/* Sınav Dersi */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> Sınav Dersi</span>
          </label>
          <input
            type="text"
            value={examInfo.sinavDersi || ''}
            onChange={e => update('sinavDersi', e.target.value)}
            placeholder="Türk Dili ve Edebiyatı"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.sinavDersi ? 'border-red-400' : 'border-border'}`}
          />
          {errors.sinavDersi && <p className="text-xs text-red-500 mt-1">{errors.sinavDersi}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sınav Tarihi */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Tarih</span>
            </label>
            <input
              type="text"
              value={examInfo.sinavTarihi || ''}
              onChange={e => update('sinavTarihi', e.target.value)}
              placeholder="12.06.2026"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.sinavTarihi ? 'border-red-400' : 'border-border'}`}
            />
            {errors.sinavTarihi && <p className="text-xs text-red-500 mt-1">{errors.sinavTarihi}</p>}
          </div>

          {/* Sınav Türü */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-primary" /> Sınav Türü</span>
            </label>
            <select
              value={examInfo.sinavTuru || EXAM_TYPES[0]}
              onChange={e => update('sinavTuru', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Sınav Saati */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Sınav Saati</span>
          </label>
          <select
            value={examInfo.sinavSaati || LESSON_HOURS[0]}
            onChange={e => update('sinavSaati', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {LESSON_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
        >
          Devam <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}