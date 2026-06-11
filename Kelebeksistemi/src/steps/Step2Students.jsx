import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, ChevronRight, ChevronLeft, Search, Users, FileSpreadsheet, Loader2, UserPlus, X, Check } from 'lucide-react';
import { parseEOkulXLS } from '../lib/parser';
import { DEFAULT_STUDENTS } from '../lib/defaultStudents';

const GRADE_COLORS = {
  '9': 'bg-blue-50 border-blue-200 text-blue-700',
  '10': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  '11': 'bg-orange-50 border-orange-200 text-orange-700',
  '12': 'bg-purple-50 border-purple-200 text-purple-700',
};

function gradeFrom(sinif) {
  if (!sinif) return '9';
  const s = sinif.trim().toLowerCase();
  if (s.startsWith('12')) return '12';
  if (s.startsWith('11')) return '11';
  if (s.startsWith('10')) return '10';
  if (s.startsWith('9')) return '9';
  return '9';
}

export default function Step2Students({ students, onChange, onNext, onBack }) {
  const [addTab, setAddTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [manualForm, setManualForm] = useState({ no: '', adSoyad: '', sinif: '', grade: '9' });
  const fileRef = useRef();

  const loadDefaults = () => {
    onChange(DEFAULT_STUDENTS);
    setErrors([]);
  };

  const handleXLS = async (file) => {
    if (!file) return;
    setLoading(true);
    setErrors([]);
    try {
      const { students: parsed, errors: errs } = await parseEOkulXLS(file);
      onChange([...students, ...parsed]);
      setErrors(errs);
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = () => {
    if (!manualForm.adSoyad.trim()) { setErrors(['Ad Soyad gerekli.']); return; }
    const student = {
      no: manualForm.no || String(students.length + 1),
      adSoyad: manualForm.adSoyad.trim(),
      sinif: manualForm.sinif.trim() || manualForm.grade,
      grade: manualForm.grade || gradeFrom(manualForm.sinif),
      isExempt: false,
    };
    onChange([...students, student]);
    setManualForm({ no: '', adSoyad: '', sinif: '', grade: '9' });
    setErrors([]);
  };

  const removeStudent = (idx) => onChange(students.filter((_, i) => i !== idx));
  const removeClass = (sinif) => onChange(students.filter(s => s.sinif !== sinif));
  const toggleExempt = (idx) => onChange(students.map((s, i) => i === idx ? { ...s, isExempt: !s.isExempt } : s));

  const grades = [...new Set(students.map(s => s.grade))].sort();
  const siniflar = [...new Set(students.map(s => s.sinif))].sort();
  const filtered = students.filter(s => {
    const mG = filterGrade === 'all' || s.grade === filterGrade;
    const mS = !search || s.adSoyad.toLowerCase().includes(search.toLowerCase()) || s.sinif.toLowerCase().includes(search.toLowerCase());
    return mG && mS;
  });

  const activeCount = students.filter(s => !s.isExempt).length;
  const exemptCount = students.filter(s => s.isExempt).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-foreground mb-1">Öğrenci Listesi</h2>
        <p className="text-muted-foreground text-sm">Hz. Ayşe Kız AİHL öğrencileri önceden yüklenmiştir. Ek öğrenci ekleyebilirsiniz.</p>
      </div>

      {students.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-800 text-sm">Hz. Ayşe Kız AİHL öğrenci listesi hazır</p>
            <p className="text-xs text-blue-600 mt-0.5">{DEFAULT_STUDENTS.length} öğrenci — 9/A'dan 12/H'ye tüm şubeler</p>
          </div>
          <button onClick={loadDefaults} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
            Listeyi Yükle
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setAddTab(addTab === 'xls' ? null : 'xls')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${addTab === 'xls' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-secondary'}`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" /> XLS Ekle
        </button>
        <button
          onClick={() => setAddTab(addTab === 'manual' ? null : 'manual')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${addTab === 'manual' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-secondary'}`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Tek Öğrenci
        </button>
        {students.length > 0 && (
          <button onClick={loadDefaults} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors ml-auto">
            Listeyi sıfırla
          </button>
        )}
      </div>

      {addTab === 'xls' && (
        <div className="mb-4 space-y-2">
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            <span className="text-base leading-none mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold mb-0.5">e-Okul'dan nasıl indirilir?</p>
              <p>e-Okul → Öğrenci İşleri → Raporlar bölümünden <span className="font-semibold">OOG01001R020 – Şube Listesi (Öğrenci No Sıralı)</span> raporunu <span className="font-semibold">Excel (Sadece Veri)</span> formatında indirip buraya yükleyebilirsiniz.</p>
            </div>
          </div>
          <div
            onDrop={e => { e.preventDefault(); handleXLS(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all"
          >
            <input ref={fileRef} type="file" accept=".xls,.xlsx" style={{display:'none'}} onChange={e => handleXLS(e.target.files[0])} />
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Dosya okunuyor...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-7 h-7 text-primary" />
                <p className="text-sm font-semibold text-foreground">e-Okul XLS dosyasını sürükleyin veya tıklayın</p>
              </div>
            )}
          </div>
        </div>
      )}

      {addTab === 'manual' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Okul No</label>
              <input type="text" value={manualForm.no}
                onChange={e => setManualForm(f => ({ ...f, no: e.target.value }))}
                placeholder="123"
                className="w-full px-2.5 py-1.5 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Ad Soyad *</label>
              <input type="text" value={manualForm.adSoyad}
                onChange={e => setManualForm(f => ({ ...f, adSoyad: e.target.value }))}
                placeholder="Ayşe Yılmaz"
                className="w-full px-2.5 py-1.5 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Şube</label>
              <input type="text" value={manualForm.sinif}
                onChange={e => setManualForm(f => ({ ...f, sinif: e.target.value, grade: gradeFrom(e.target.value) }))}
                placeholder="9a"
                className="w-full px-2.5 py-1.5 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Sınıf</label>
              <select value={manualForm.grade}
                onChange={e => setManualForm(f => ({ ...f, grade: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                {['9','10','11','12'].map(g => <option key={g} value={g}>{g}. Sınıf</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleManualAdd} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Check className="w-4 h-4" /> Ekle
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold text-xs mb-1">
            <AlertCircle className="w-4 h-4" /> {errors.length} uyarı
          </div>
          <ul className="text-xs text-red-600 space-y-0.5 max-h-24 overflow-y-auto">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {students.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-bold text-foreground">{students.length}</div>
              <div className="text-xs text-muted-foreground">Toplam</div>
            </div>
            <div className="bg-white rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-bold text-primary">{activeCount}</div>
              <div className="text-xs text-muted-foreground">Sınava Girecek</div>
            </div>
            <div className="bg-white rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-bold text-amber-600">{exemptCount}</div>
              <div className="text-xs text-muted-foreground">Muaf</div>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="İsim veya sınıf ara..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              <option value="all">Tüm Sınıflar</option>
              {grades.map(g => <option key={g} value={g}>{g}. Sınıf</option>)}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-xs text-muted-foreground self-center">Şubeyi sil:</span>
            {siniflar.map(sinif => (
              <button key={sinif} onClick={() => removeClass(sinif)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors">
                {sinif.toUpperCase()} <X className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary/90 backdrop-blur border-b border-border">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs w-12">No</th>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Ad Soyad</th>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs w-20">Sınıf</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs w-24">Sınava Giriyor</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s) => {
                    const realIdx = students.indexOf(s);
                    return (
                      <tr key={realIdx} className={`transition-colors ${s.isExempt ? 'opacity-40' : 'hover:bg-secondary/20'}`}>
                        <td className="px-3 py-2 text-muted-foreground text-xs">{s.no}</td>
                        <td className="px-3 py-2 font-medium text-foreground">{s.adSoyad}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border ${GRADE_COLORS[s.grade] || 'bg-secondary text-foreground border-border'}`}>
                            {s.sinif}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => toggleExempt(realIdx)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${!s.isExempt ? 'bg-primary' : 'bg-border'}`}>
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${!s.isExempt ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-1 py-2 text-center">
                          <button onClick={() => removeStudent(realIdx)}
                            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">Sonuç bulunamadı</div>}
          </div>
        </>
      )}

      {students.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Yukarıdan listeyi yükleyin ya da öğrenci ekleyin</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Geri
        </button>
        <button onClick={onNext} disabled={students.length === 0}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
          Devam <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
