// Pure HTML string builders for print windows
// No React dependency — renders to a new browser window for reliable printing

function getSeatLabel(colIndex, rowIndex, seatInBank) {
  const colLetter = String.fromCharCode(65 + colIndex);
  const seatNo = rowIndex * 2 + seatInBank + 1;
  return `${colLetter}${seatNo}`;
}

const GRADE_BG = {
  '9':  '#dbeafe',
  '10': '#d1fae5',
  '11': '#ffedd5',
  '12': '#f3e8ff',
};

const BASE_STYLES = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; background: white; }
    @page { size: A4 portrait; margin: 1cm; }
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page-break { page-break-after: always; break-after: page; }
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 4px 7px; }
    th { background: #f3f4f6; font-weight: bold; }
    .header { border-bottom: 2px solid #1f2937; padding-bottom: 8px; margin-bottom: 12px; }
    .header h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
    .header .meta { display: flex; justify-content: space-between; font-size: 11px; }
    .footer-credit { margin-top: 10px; font-size: 9px; color: #9ca3af; text-align: right; }
  </style>
`;

function headerHTML(examInfo, extra = '') {
  return `
    <div class="header">
      <h1>${examInfo.okulAdi || 'Okul Adı'}</h1>
      <div class="meta">
        <span><b>Ders:</b> ${examInfo.sinavDersi || ''}</span>
        <span><b>Tarih:</b> ${examInfo.sinavTarihi || ''}</span>
        <span><b>Saat:</b> ${(examInfo.sinavSaati || '').replace(/\s*\(.*?\)\s*/g, '').trim()}</span>
        <span><b>Tür:</b> ${examInfo.sinavTuru || ''}</span>
        ${extra}
      </div>
    </div>
  `;
}

function creditFooter() {
  return `<div class="footer-credit">Kelebek Sistemi — Yapımcı: Tamer Közleme | Instagram: @tamerkzlm</div>`;
}

export function buildRoomListHTML(plan, examInfo) {
  let pages = '';

  plan.assignments.forEach((assignment, aIdx) => {
    const { room, grid } = assignment;
    const colLetters = Array.from({ length: room.cols }, (_, i) => String.fromCharCode(65 + i));

    // Collect and sort students
    const students = [];
    grid.forEach((row, ri) => {
      row.forEach((student, ci) => {
        if (student) {
          const colIdx = Math.floor(ci / 2);
          const bankIdx = ci % 2;
          students.push({ ...student, koltuk: getSeatLabel(colIdx, ri, bankIdx) });
        }
      });
    });
    students.sort((a, b) => a.adSoyad.localeCompare(b.adSoyad, 'tr'));

    // Student list table
    let studentRows = students.map((s, i) => `
      <tr style="background:${i % 2 === 0 ? 'white' : '#f9fafb'}">
        <td style="font-weight:bold">${s.koltuk}</td>
        <td>${s.adSoyad}</td>
        <td>${s.sinif}</td>
        <td></td>
      </tr>
    `).join('');

    // Visual seating grid
    let colHeaders = colLetters.map(l => `
      <th colspan="2" style="text-align:center;font-size:9px">${l}</th>
    `).join('');

    let gridRows = grid.map((row, ri) => {
      let cells = colLetters.map((_, ci) => {
        const l = row[ci * 2];
        const r = row[ci * 2 + 1];
        const lBg = l ? (GRADE_BG[l.grade] || '#f0f0f0') : '#f9fafb';
        const rBg = r ? (GRADE_BG[r.grade] || '#f0f0f0') : '#f9fafb';
        const lLabel = l ? `<b style="font-size:7px">${getSeatLabel(ci, ri, 0)}</b><br/><span style="font-size:6px">${l.adSoyad.split(' ').slice(-1)[0]}</span>` : '';
        const rLabel = r ? `<b style="font-size:7px">${getSeatLabel(ci, ri, 1)}</b><br/><span style="font-size:6px">${r.adSoyad.split(' ').slice(-1)[0]}</span>` : '';
        return `
          <td style="background:${lBg};text-align:center;width:${60/room.cols}px;padding:1px;line-height:1.3">${lLabel}</td>
          <td style="background:${rBg};text-align:center;width:${60/room.cols}px;padding:1px;line-height:1.3">${rLabel}</td>
        `;
      }).join('');
      return `<tr><td style="font-size:8px;font-weight:bold;text-align:right;padding:1px 3px;border:none;width:16px">${ri+1}</td>${cells}</tr>`;
    }).join('');

    const isLast = aIdx === plan.assignments.length - 1;
    pages += `
      <div class="${isLast ? '' : 'page-break'}" style="padding:4px">
        ${headerHTML(examInfo, `<span><b>Salon:</b> ${room.name}</span>`)}
        <div style="display:flex;gap:20px;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <h2 style="font-size:13px;font-weight:bold;margin-bottom:6px;border-bottom:1px solid #d1d5db;padding-bottom:3px">${room.name} — Öğrenci Listesi</h2>
            <table style="font-size:10px">
              <thead><tr><th>Koltuk</th><th>Ad Soyad</th><th>Sınıf</th><th style="min-width:50px">İmza</th></tr></thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
          <div style="width:220px;flex-shrink:0">
            <h2 style="font-size:13px;font-weight:bold;margin-bottom:6px;border-bottom:1px solid #d1d5db;padding-bottom:3px">${room.name} — Oturma Planı</h2>
            <div style="text-align:center;font-size:9px;font-weight:bold;border:1px solid #9ca3af;padding:2px;margin-bottom:4px;background:#f3f4f6">TAHTA</div>
            <div style="display:flex;align-items:stretch">
              <div style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center;font-size:8px;font-weight:bold;border:1px solid #9ca3af;padding:2px;margin-right:4px;background:#e0f2fe;color:#0284c7;display:flex;justify-content:center">CAM</div>
              <div style="flex:1">
                <table style="font-size:7px;table-layout:fixed;width:100%">
                  <thead><tr><th style="width:16px;border:none"></th>${colHeaders}</tr></thead>
                  <tbody>${gridRows}</tbody>
                </table>
              </div>
            </div>
            <div style="text-align:center;font-size:9px;font-weight:bold;border:1px solid #9ca3af;padding:2px;margin-top:4px;background:#f3f4f6">ARKA DUVAR</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
              ${Object.entries({'9.Sınıf':GRADE_BG['9'],'10.Sınıf':GRADE_BG['10'],'11.Sınıf':GRADE_BG['11'],'12.Sınıf':GRADE_BG['12']}).map(([l,c])=>`
                <span style="font-size:8px;padding:1px 5px;border:1px solid #d1d5db;border-radius:3px;background:${c}">${l}</span>
              `).join('')}
            </div>
          </div>
        </div>
        ${creditFooter()}
      </div>
    `;
  });

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Salon Listesi</title>${BASE_STYLES}</head><body>${pages}</body></html>`;
}

export function buildClassListHTML(plan, examInfo) {
  const classMap = {};
  plan.assignments.forEach(({ room, grid }) => {
    grid.forEach((row, ri) => {
      row.forEach((student, ci) => {
        if (student) {
          const colIdx = Math.floor(ci / 2);
          const bankIdx = ci % 2;
          const withSeat = { ...student, koltuk: getSeatLabel(colIdx, ri, bankIdx), salon: room.name };
          if (!classMap[student.sinif]) classMap[student.sinif] = [];
          classMap[student.sinif].push(withSeat);
        }
      });
    });
  });

  const classes = Object.keys(classMap).sort((a, b) => a.localeCompare(b, 'tr'));

  let pages = classes.map((sinif, ci) => {
    const students = classMap[sinif].sort((a, b) => a.adSoyad.localeCompare(b.adSoyad, 'tr'));
    const isLast = ci === classes.length - 1;

    const rows = students.map((s, i) => `
      <tr style="background:${i % 2 === 0 ? 'white' : '#f9fafb'}">
        <td>${s.no}</td>
        <td style="font-weight:500">${s.adSoyad}</td>
        <td style="text-align:center;font-weight:bold">${s.salon}</td>
        <td style="text-align:center;font-weight:bold">${s.koltuk}</td>
      </tr>
    `).join('');

    return `
      <div class="${isLast ? '' : 'page-break'}" style="padding:4px">
        ${headerHTML(examInfo)}
        <h2 style="font-size:14px;font-weight:bold;margin-bottom:10px">${sinif} Şubesi — Sınav Salon ve Koltuk Bilgileri</h2>
        <table>
          <thead><tr><th>No</th><th>Ad Soyad</th><th style="text-align:center">Salon</th><th style="text-align:center">Koltuk</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-size:10px;color:#6b7280;margin-top:8px">Bu liste ${sinif} öğrencilerine sınav öncesinde dağıtılacaktır.</p>
        ${creditFooter()}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Şube Listesi</title>${BASE_STYLES}</head><body>${pages}</body></html>`;
}