import React from 'react';
import { getSeatLabel } from '../../lib/algorithm';

const GRADE_COLORS_PRINT = {
  '9':  'bg-blue-100 border-blue-300',
  '10': 'bg-emerald-100 border-emerald-300',
  '11': 'bg-orange-100 border-orange-300',
  '12': 'bg-purple-100 border-purple-300',
};

export function PrintRoomList({ plan, examInfo }) {
  if (!plan) return null;

  return (
    <>
      {plan.assignments.map((assignment, aIdx) => {
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

        const colLetters = Array.from({ length: room.cols }, (_, i) => String.fromCharCode(65 + i));

        return (
          <div key={aIdx} className="page-break-after print-page" style={{ pageBreakAfter: 'always' }}>
            {/* Header */}
            <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '8px', marginBottom: '12px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>{examInfo.okulAdi || 'Okul Adı'}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                <span><strong>Ders:</strong> {examInfo.sinavDersi}</span>
                <span><strong>Tarih:</strong> {examInfo.sinavTarihi}</span>
                <span><strong>Saat:</strong> {examInfo.sinavSaati}</span>
                <span><strong>Tür:</strong> {examInfo.sinavTuru}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Student list */}
              <div style={{ width: '50%' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #d1d5db', paddingBottom: '4px' }}>
                  {room.name} — Öğrenci Listesi
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ border: '1px solid #d1d5db', padding: '4px 6px', textAlign: 'left' }}>Koltuk</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '4px 6px', textAlign: 'left' }}>Ad Soyad</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '4px 6px', textAlign: 'left' }}>Sınıf</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '4px 6px', textAlign: 'center', minWidth: '60px' }}>İmza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                        <td style={{ border: '1px solid #d1d5db', padding: '3px 6px', fontWeight: 'bold' }}>{s.koltuk}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '3px 6px' }}>{s.adSoyad}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '3px 6px' }}>{s.sinif}</td>
                        <td style={{ border: '1px solid #d1d5db', padding: '3px 6px' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual seating plan */}
              <div style={{ width: '50%' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #d1d5db', paddingBottom: '4px' }}>
                  {room.name} — Oturma Planı
                </h2>
                <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', border: '1px solid #9ca3af', padding: '3px', marginBottom: '6px', backgroundColor: '#f3f4f6' }}>
                  TAHTA
                </div>

                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '8px', fontWeight: 'bold', border: '1px solid #9ca3af', padding: '2px', marginRight: '4px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', justifyContent: 'center' }}>
                    CAM
                  </div>
                  <div style={{ flex: 1 }}>
                    {/* Col headers */}
                    <div style={{ display: 'flex', marginBottom: '2px', paddingLeft: '20px' }}>
                      {colLetters.map(l => (
                        <div key={l} style={{ display: 'flex', flex: 1 }}>
                          <div style={{ flex: 1, textAlign: 'center', fontSize: '8px', fontWeight: 'bold' }}>{l}L</div>
                          <div style={{ flex: 1, textAlign: 'center', fontSize: '8px', fontWeight: 'bold' }}>{l}R</div>
                        </div>
                      ))}
                    </div>

                    {grid.map((row, ri) => (
                      <div key={ri} style={{ display: 'flex', alignItems: 'center', marginBottom: '1px' }}>
                        <div style={{ width: '18px', fontSize: '8px', textAlign: 'right', paddingRight: '2px', fontWeight: 'bold', flexShrink: 0 }}>{ri + 1}</div>
                        {colLetters.map((_, ci) => {
                          const l = row[ci * 2];
                          const r = row[ci * 2 + 1];
                          const lColors = l ? { backgroundColor: ci === 0 ? '#dbeafe' : ci === 1 ? '#d1fae5' : ci === 2 ? '#ffedd5' : '#f3e8ff' } : { backgroundColor: '#f9fafb' };
                          const rColors = r ? { backgroundColor: ci === 0 ? '#dbeafe' : ci === 1 ? '#d1fae5' : ci === 2 ? '#ffedd5' : '#f3e8ff' } : { backgroundColor: '#f9fafb' };
                          return (
                            <div key={ci} style={{ display: 'flex', flex: 1 }}>
                              <div style={{ flex: 1, border: '0.5px solid #d1d5db', fontSize: '7px', textAlign: 'center', padding: '1px', lineHeight: '1.2', ...lColors }}>
                                {l ? <><div style={{ fontWeight: 'bold' }}>{getSeatLabel(ci, ri, 0)}</div><div>{l.adSoyad.split(' ').slice(-1)[0]}</div></> : ''}
                              </div>
                              <div style={{ flex: 1, border: '0.5px solid #d1d5db', fontSize: '7px', textAlign: 'center', padding: '1px', lineHeight: '1.2', ...rColors }}>
                                {r ? <><div style={{ fontWeight: 'bold' }}>{getSeatLabel(ci, ri, 1)}</div><div>{r.adSoyad.split(' ').slice(-1)[0]}</div></> : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', border: '1px solid #9ca3af', padding: '3px', marginTop: '6px', backgroundColor: '#f3f4f6' }}>
                  ARKA DUVAR
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {[['9.Sınıf','#dbeafe'],['10.Sınıf','#d1fae5'],['11.Sınıf','#ffedd5'],['12.Sınıf','#f3e8ff']].map(([label, color]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8px', padding: '2px 5px', border: '1px solid #d1d5db', borderRadius: '3px', backgroundColor: color }}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function PrintClassList({ plan, examInfo }) {
  if (!plan) return null;

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

  return (
    <>
      {classes.map((sinif, ci) => {
        const students = classMap[sinif].sort((a, b) => a.adSoyad.localeCompare(b.adSoyad, 'tr'));
        return (
          <div key={ci} style={{ pageBreakAfter: ci < classes.length - 1 ? 'always' : 'auto', padding: '4px' }}>
            <div style={{ borderBottom: '2px solid #1f2937', paddingBottom: '6px', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{examInfo.okulAdi}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '2px' }}>
                <span>{examInfo.sinavDersi} — {examInfo.sinavTuru}</span>
                <span>{examInfo.sinavTarihi} / {examInfo.sinavSaati}</span>
              </div>
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>{sinif} Şubesi — Sınav Salon ve Koltuk Bilgileri</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', textAlign: 'left' }}>No</th>
                  <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', textAlign: 'left' }}>Ad Soyad</th>
                  <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', textAlign: 'center' }}>Salon</th>
                  <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', textAlign: 'center' }}>Koltuk</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <td style={{ border: '1px solid #d1d5db', padding: '5px 10px' }}>{s.no}</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '5px 10px', fontWeight: '500' }}>{s.adSoyad}</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>{s.salon}</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '5px 10px', textAlign: 'center', fontWeight: 'bold' }}>{s.koltuk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px' }}>Bu liste {sinif} öğrencilerine sınav öncesinde dağıtılacaktır.</p>
          </div>
        );
      })}
    </>
  );
}