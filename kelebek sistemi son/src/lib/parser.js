import * as XLSX from 'xlsx';

// Clean class name e.g. "9/A" → "9A", "10-B" → "10B"
function cleanClassName(raw) {
  if (!raw) return '';
  return String(raw).replace(/[\/\-\s]/g, '').trim().toUpperCase();
}

function extractGrade(sinif) {
  const match = sinif.match(/^(\d+)/);
  return match ? match[1] : null;
}

// Try to parse e-Okul XLS format
// e-Okul exports have varying column orders; we try to detect them heuristically
export function parseEOkulXLS(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        const students = [];
        const errors = [];
        let headerRowIndex = -1;

        // Find header row - look for typical e-Okul headers
        const headerKeywords = ['no', 'ad', 'soyad', 'sınıf', 'sinif', 'numara', 'öğrenci'];
        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const rowStr = rows[i].join(' ').toLowerCase();
          if (headerKeywords.some(kw => rowStr.includes(kw))) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          // Try generic approach - assume first row is header
          headerRowIndex = 0;
        }

        const headers = rows[headerRowIndex].map(h => String(h).toLowerCase().trim());

        // Detect column indices
        const colNo = headers.findIndex(h => h === 'no' || h === 'numara' || h === 'öğrenci no' || h === 'sıra no');
        const colAd = headers.findIndex(h => h.includes('ad') && !h.includes('soyad') || h === 'öğrenci adı' || h === 'isim');
        const colSoyad = headers.findIndex(h => h.includes('soyad'));
        const colAdSoyad = headers.findIndex(h => (h.includes('ad') && h.includes('soyad')) || h === 'ad soyad' || h === 'adı soyadı');
        const colSinif = headers.findIndex(h => h.includes('sınıf') || h.includes('sinif') || h === 'şube' || h === 'sube');

        // Process data rows
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.every(cell => !cell)) continue; // skip empty rows

          let no = '';
          let adSoyad = '';
          let sinif = '';

          if (colNo >= 0) no = String(row[colNo] || '').trim();
          
          if (colAdSoyad >= 0) {
            adSoyad = String(row[colAdSoyad] || '').trim();
          } else if (colAd >= 0 && colSoyad >= 0) {
            adSoyad = `${String(row[colAd] || '').trim()} ${String(row[colSoyad] || '').trim()}`.trim();
          } else if (colAd >= 0) {
            adSoyad = String(row[colAd] || '').trim();
          }

          if (colSinif >= 0) sinif = cleanClassName(row[colSinif]);

          // Validation
          if (!adSoyad) {
            if (row.some(c => c)) {
              errors.push(`Satır ${i + 1}: Ad/Soyad bulunamadı.`);
            }
            continue;
          }

          if (!sinif) {
            errors.push(`Satır ${i + 1}: "${adSoyad}" için sınıf bilgisi bulunamadı.`);
            continue;
          }

          const grade = extractGrade(sinif);
          if (!grade) {
            errors.push(`Satır ${i + 1}: "${sinif}" sınıf formatı tanınamadı.`);
            continue;
          }

          students.push({
            no: no || String(i - headerRowIndex),
            adSoyad,
            sinif,
            grade,
            isExempt: false,
          });
        }

        if (students.length === 0) {
          reject(new Error('Listede hiç öğrenci bulunamadı. Lütfen e-Okul XLS formatını kontrol edin.'));
          return;
        }

        resolve({ students, errors });
      } catch (err) {
        reject(new Error('e-Okul XLS formatı tanınamadı. Lütfen dosyayı kontrol edin.'));
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsArrayBuffer(file);
  });
}