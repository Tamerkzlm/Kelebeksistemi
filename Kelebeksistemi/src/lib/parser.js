import * as XLSX from 'xlsx';

// Türkçe başlık formatına çevir: "ŞEYDA NUR" → "Şeyda Nur"
function toTitleCaseTR(str) {
  const lower = str
    .replace(/İ/g, 'i_dot')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/i_dot/g, 'i');
  return lower.replace(/(^|\s)\S/g, ch => ch.toUpperCase());
}

// "9. Sınıf / A Şubesi" → { sinif: "9A", grade: "9" }
// "Hazırlık Sınıfı / A Şubesi" → { sinif: "HAZA", grade: "haz" }
function parseSinifFromHeader(line) {
  const m1 = line.match(/(\d+)\.\s*S[ıi]n[ıi]f\s*\/\s*([A-Za-z]+)\s*[Şş]ubesi/);
  if (m1) return { sinif: m1[1] + m1[2].toUpperCase(), grade: m1[1] };
  const m2 = line.match(/Haz[ıi]rl[ıi]k\s*S[ıi]n[ıi]f[ıi]\s*\/\s*([A-Za-z]+)\s*[Şş]ubesi/i);
  if (m2) return { sinif: 'HAZ' + m2[1].toUpperCase(), grade: 'haz' };
  return null;
}

export function parseEOkulXLS(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: true });

        const students = [];
        const errors = [];
        let currentSinif = null;
        let currentGrade = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const firstCell = String(row[0] || '');

          // Şube başlığı satırı
          if (firstCell.includes('AİHL') || firstCell.includes('AIHL')) {
            for (const line of firstCell.split('\n')) {
              const parsed = parseSinifFromHeader(line);
              if (parsed) {
                currentSinif = parsed.sinif;
                currentGrade = parsed.grade;
                break;
              }
            }
            continue;
          }

          // Öğrenci satırı: ilk kolon pozitif tam sayı (sıra no)
          const sno = row[0];
          const ono = row[1];
          const ad = String(row[3] || '').trim();
          const soyad = String(row[7] || '').trim();

          if (
            typeof sno === 'number' && Number.isInteger(sno) && sno > 0 &&
            ad && soyad &&
            currentSinif
          ) {
            const adSoyad = toTitleCaseTR(ad + ' ' + soyad);
            students.push({
              no: String(Math.round(ono) || sno),
              adSoyad,
              sinif: currentSinif,
              grade: currentGrade,
              isExempt: false,
            });
          }
        }

        if (students.length === 0) {
          reject(new Error('Listede hiç öğrenci bulunamadı. Lütfen e-Okul XLS formatını kontrol edin.'));
          return;
        }

        resolve({ students, errors });
      } catch (err) {
        reject(new Error('e-Okul XLS okunamadı: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsArrayBuffer(file);
  });
}
