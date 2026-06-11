// Pure HTML string builders for print windows
// No React dependency — renders to a new browser window for reliable printing

function getSeatLabel(colIndex, rowIndex, seatInBank) {
  const seatIndex = colIndex * 2 + seatInBank;
  const letter = String.fromCharCode(65 + seatIndex);
  const number = rowIndex + 1;
  return `${letter}${number}`;
}

const GRADE_BG = {
  '9':  '#dbeafe',
  '10': '#d1fae5',
  '11': '#ffedd5',
  '12': '#f3e8ff',
};

const GRADE_BORDER = {
  '9':  '#93c5fd',
  '10': '#6ee7b7',
  '11': '#fdba74',
  '12': '#d8b4fe',
};

const BASE_STYLES_LANDSCAPE = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 10px; color: #111; background: white; }
    @page { size: A4 landscape; margin: 0.7cm; }
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page-break { page-break-after: always; break-after: page; }
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 2px 5px; }
    th { background: #f3f4f6; font-weight: bold; }
    .header { border-bottom: 2px solid #1f2937; padding-bottom: 5px; margin-bottom: 8px; }
    .header h1 { font-size: 13px; text-align: center; margin-bottom: 3px; }
    .header .meta { display: flex; justify-content: space-between; font-size: 9px; flex-wrap: wrap; gap: 3px; }
    .footer-credit { margin-top: 6px; font-size: 8px; color: #9ca3af; text-align: right; }
    
    .two-col { display: flex; gap: 18px; align-items: stretch; height: calc(100vh - 85px); }
    .left-col { width: 36%; flex-shrink: 0; display: flex; flex-direction: column; }
    .right-col { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
    
    .sig-table { flex: 1; table-layout: auto; width: 100%; }
    
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 3px; padding: 4px 7px; font-size: 8px; max-width: 220px; }
    .info-box h3 { font-size: 9px; font-weight: bold; margin-bottom: 3px; color: #1e40af; }
    .info-box .info-row { display: flex; justify-content: space-between; padding: 1px 0; border-bottom: 1px dashed #e2e8f0; }
    .info-box .info-row:last-child { border-bottom: none; }

    /* DÜZELTME: Sınav Notları Alanı El Yazısı İçin Genişletildi ve Çizgilendirildi */
    .supervisor-section { display: flex; gap: 12px; margin-top: 8px; max-width: 580px; width: 100%; }
    .notes-box { flex: 1; border: 1px solid #cbd5e1; border-radius: 3px; padding: 6px 8px; min-height: 90px; display: flex; flex-direction: column; }
    .notes-box h4 { font-size: 9px; font-weight: bold; color: #334155; margin-bottom: 4px; }
    .notes-lines { flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin-top: 4px; }
    .notes-line-item { border-bottom: 1px dashed #cbd5e1; height: 18px; }
    
    .sig-box { width: 180px; border: 1px solid #cbd5e1; border-radius: 3px; padding: 6px; display: flex; flex-direction: column; text-align: center; }
    .sig-box h4 { font-size: 9px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 15px; }
    .sig-line { font-size: 8px; color: #64748b; margin-top: auto; padding-top: 20px; }
  </style>
`;

const BASE_STYLES_PORTRAIT = `
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
        ${extra}
      </div>
    </div>
  `;
}

function creditFooter() {
  return `<div class="footer-credit">Kelebek Sistemi — Yapımcı: Tamer Közleme | Instagram: @tamerkzlm</div>`;
}

function gradeInfoBox(students) {
  const gradeCounts = {};
  for (const s of students) {
    gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
  }
  const grades = Object.keys(gradeCounts).sort();
  const rows = grades.map(g => `
    <div class="info-row">
      <span style="font-weight:bold;background:${GRADE_BG[g]};padding:0 4px;border-radius:2px;border:1px solid ${GRADE_BORDER[g]}">${g}. Sınıf</span>
      <span><b>${gradeCounts[g]}</b> öğrenci</span>
    </div>
  `).join('');
  return `
    <div class="info-box">
      <h3>Sınıf Düzeyi Dağılımı</h3>
      ${rows}
      <div class="info-row" style="margin-top:4px;font-weight:bold">
        <span>Toplam</span>
        <span>${students.length} öğrenci</span>
      </div>
    </div>
  `;
}

function buildGridHTML(grid, room, compact = false) {
  const colLetters = Array.from({ length: room.cols }, (_, i) => String.fromCharCode(65 + i));
  const cellW = compact ? Math.floor(180 / room.cols) : Math.floor(380 / room.cols);

  let colHeaders = colLetters.map((_, ci) => {
    const l = String.fromCharCode(65 + ci * 2);
    const r = String.fromCharCode(65 + ci * 2 + 1);
    return `<th colspan="2" style="text-align:center;font-size:8px;padding:1px">${l}/${r}</th>`;
  }).join('');

  let gridRows = grid.map((row, ri) => {
    let cells = colLetters.map((_, ci) => {
      const l = row[ci * 2];
      const r = row[ci * 2 + 1];
      const lBg = l ? (GRADE_BG[l.grade] || '#f0f0f0') : '#f9fafb';
      const rBg = r ? (GRADE_BG[r.grade] || '#f0f0f0') : '#f9fafb';
      const lLabel = l
        ? `<b style="font-size:7.5px">${getSeatLabel(ci, ri, 0)}</b><br/><span style="font-size:6.5px">${l.adSoyad}</span><br/><span style="font-size:6px;color:#555">${(l.sinif||'').toUpperCase()}</span>`
        : '';
      const rLabel = r
        ? `<b style="font-size:7.5px">${getSeatLabel(ci, ri, 1)}</b><br/><span style="font-size:6.5px">${r.adSoyad}</span><br/><span style="font-size:6px;color:#555">${(r.sinif||'').toUpperCase()}</span>`
        : '';
      return `
        <td style="background:${lBg};text-align:center;width:${cellW/2}px;padding:2px 1px;line-height:1.3">${lLabel}</td>
        <td style="background:${rBg};text-align:center;width:${cellW/2}px;padding:2px 1px;line-height:1.3">${rLabel}</td>
      `;
    }).join('');
    return `<tr><td style="font-size:7px;font-weight:bold;text-align:right;padding:1px 2px;border:none;width:14px">${ri+1}</td>${cells}</tr>`;
  }).join('');

  return `
    <div style="max-width: 580px; width: 100%;">
      <div style="text-align:center;font-size:8px;font-weight:bold;border:1px solid #9ca3af;padding:2px;margin-bottom:3px;background:#f3f4f6">TAHTA</div>
      <div style="display:flex;gap:3px;align-items:stretch">
        <div style="width:12px;flex-shrink:0;background:#eff6ff;border:2px solid #93c5fd;border-radius:3px;display:flex;align-items:center;justify-content:center">
          <span style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:6px;font-weight:bold;color:#3b82f6;letter-spacing:2px">CAM</span>
        </div>
        <table style="font-size:7px;table-layout:fixed;width:100%">
          <thead><tr><th style="width:14px;border:none"></th>${colHeaders}</tr></thead>
          <tbody>${gridRows}</tbody>
        </table>
      </div>
    </div>
  `;
}

export function buildRoomListHTML(plan, examInfo) {
  let pages = '';

  const sortedAssignments = [...plan.assignments].sort((a, b) => 
    a.room.name.localeCompare(b.room.name, 'tr', { numeric: true, sensitivity: 'base' })
  );

  sortedAssignments.forEach((assignment, aIdx) => {
    const { room, grid } = assignment;

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

    let studentRows = students.map((s, i) => `
      <tr style="background:${i % 2 === 0 ? 'white' : '#f9fafb'}">
        <td style="font-weight:bold;font-size:8px;white-space:nowrap;">${s.koltuk}</td>
        <td style="font-size:8px;white-space:nowrap;">${s.adSoyad}</td>
        <td style="font-size:8px;text-align:center;">${(s.sinif||'').toUpperCase()}</td>
        <td style="height:23px;"></td>
      </tr>
    `).join('');

    const legendHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;max-width:580px;">
      ${Object.entries({'9.Sınıf':GRADE_BG['9'],'10.Sınıf':GRADE_BG['10'],'11.Sınıf':GRADE_BG['11'],'12.Sınıf':GRADE_BG['12']}).map(([l,c],i)=>`
        <span style="font-size:8px;padding:1px 5px;border:1px solid ${Object.values(GRADE_BORDER)[i]};border-radius:3px;background:${c}">${l}</span>
      `).join('')}
    </div>`;

    const isLast = aIdx === sortedAssignments.length - 1;
    pages += `
      <div class="${isLast ? '' : 'page-break'}" style="padding:4px">
        ${headerHTML(examInfo, `<span><b>Salon:</b> ${room.name}</span>`)}
        <div class="two-col">
          <div class="left-col">
            <h2 style="font-size:11px;font-weight:bold;margin-bottom:4px;border-bottom:1px solid #d1d5db;padding-bottom:2px">${room.name} — İmza Sirküsü</h2>
            <table class="sig-table" style="font-size:8px;">
              <thead>
                <tr>
                  <th style="width:35px; min-width:35px;">Koltuk</th>
                  <th style="white-space:nowrap;">Ad Soyad</th>
                  <th style="width:35px; min-width:35px; text-align:center">Sınıf</th>
                  <th style="width:100%; min-width:70px;">İmza</th>
                </tr>
              </thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
          <div class="right-col">
            <div>
              <h2 style="font-size:11px;font-weight:bold;margin-bottom:4px;border-bottom:1px solid #d1d5db;padding-bottom:2px;max-width:580px;">${room.name} — Oturma Planı</h2>
              ${buildGridHTML(grid, room)}
              ${legendHTML}
              <div style="margin-top: 6px;">
                ${gradeInfoBox(students)}
              </div>
            </div>
            
            <div class="supervisor-section">
              <div class="notes-box">
                <h4>Notlar:</h4>
                <div style="font-size: 8px; color: #475569; font-weight: 500;">
                Devamsız Öğrenci Sayısı: ...........
                </div>
                <div class="notes-lines">
                  <div class="notes-line-item"></div>
                  <div class="notes-line-item"></div>
                  <div class="notes-line-item"></div>
                </div>
              </div>
              <div class="sig-box">
                <h4>Salon Gözetmeni</h4>
                <div class="sig-line">Adı Soyadı / İmza</div>
              </div>
            </div>
            
          </div>
        </div>
        ${creditFooter()}
      </div>
    `;
  });

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Salon Listesi</title>${BASE_STYLES_LANDSCAPE}</head><body>${pages}</body></html>`;
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
        <h2 style="font-size:14px;font-weight:bold;margin-bottom:10px">${(sinif||'').toUpperCase()} Şubesi — Sınav Salon ve Koltuk Bilgileri</h2>
        <table>
          <thead><tr><th>No</th><th>Ad Soyad</th><th style="text-align:center">Salon</th><th style="text-align:center">Koltuk</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-size:10px;color:#6b7280;margin-top:8px">Bu liste ${(sinif||'').toUpperCase()} öğrencilerine sınav öncesinde dağıtılacaktır.</p>
        ${creditFooter()}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Şube Listesi</title>${BASE_STYLES_PORTRAIT}</head><body>${pages}</body></html>`;
}