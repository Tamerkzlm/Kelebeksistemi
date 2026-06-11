import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronLeft, Building2, RotateCcw } from 'lucide-react';

const DEFAULT_ROOMS = [
  '9a','9b','9c','9d','9h',
  '10a','10b','10c','10d',
  '11a','11b','11c','11d','11e',
  '12a','12b','12c','12d','12h',
].map((name, i) => ({ id: `default-${i}`, name, rows: 5, cols: 3 }));

// Mini room sketch preview
function RoomSketch({ rows, cols, onDeleteRow, onAddRow }) {
  const r = Math.min(Math.max(parseInt(rows) || 0, 0), 20);
  const c = Math.min(Math.max(parseInt(cols) || 0, 0), 10);
  if (r === 0 || c === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3 select-none">
      {/* Board */}
      <div className="text-center text-[9px] font-bold text-muted-foreground bg-slate-200 rounded py-0.5 mb-2 tracking-widest">TAHTA</div>
      <div className="flex gap-1">
        {/* Glass wall on the left */}
        <div className="flex flex-col justify-center items-center w-5 rounded-l-lg border-2 border-blue-300 bg-blue-50/60" style={{minHeight: r * 20}}>
          <span className="text-[7px] text-blue-400 font-bold tracking-widest" style={{writingMode:'vertical-rl', textOrientation:'mixed', transform: 'rotate(180deg)'}}>CAM</span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          {Array.from({ length: r }, (_, ri) => (
            <div key={ri} className="flex items-center gap-1">
              <span className="text-[9px] text-muted-foreground w-4 text-right shrink-0">{ri + 1}</span>
              <div className="flex gap-1 flex-1">
                {Array.from({ length: c }, (_, ci) => (
                  <div key={ci} className="flex gap-0.5 flex-1">
                    <div className="flex-1 h-4 rounded-sm bg-blue-100 border border-blue-200" />
                    <div className="flex-1 h-4 rounded-sm bg-blue-100 border border-blue-200" />
                  </div>
                ))}
              </div>
              {/* Row actions */}
              {onDeleteRow && (
                <button
                  onClick={() => onDeleteRow(ri)}
                  title="Bu sırayı sil"
                  className="w-4 h-4 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-[10px] flex items-center justify-center shrink-0"
                >×</button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Add row button */}
      {onAddRow && (
        <button
          onClick={onAddRow}
          className="mt-1.5 w-full text-[10px] text-primary hover:bg-primary/10 rounded py-0.5 border border-dashed border-primary/30 transition-colors"
        >
          + Sıra Ekle
        </button>
      )}
      <p className="text-center text-[9px] text-muted-foreground mt-1">
        {c} bank × {r} sıra = <b>{c * r * 2}</b> kişi
      </p>
    </div>
  );
}

export default function Step3Rooms({ rooms, onChange, onNext, onBack }) {
  const [newRoom, setNewRoom] = useState({ name: '', rows: 5, cols: 3 });
  const [errors, setErrors] = useState({});
  const [expandedRoom, setExpandedRoom] = useState(null);

  React.useEffect(() => {
    if (rooms.length === 0) onChange(DEFAULT_ROOMS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRoom = () => {
    const e = {};
    if (!newRoom.name.trim()) e.name = 'Salon adı gerekli';
    if (!newRoom.rows || newRoom.rows < 1) e.rows = 'Geçersiz';
    if (!newRoom.cols || newRoom.cols < 1) e.cols = 'Geçersiz';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const room = {
      id: `salon-${Date.now()}`,
      name: newRoom.name.trim(),
      rows: parseInt(newRoom.rows),
      cols: parseInt(newRoom.cols),
    };
    onChange([...rooms, room]);
    setNewRoom({ name: '', rows: 5, cols: 3 });
  };

  const removeRoom = (id) => {
    onChange(rooms.filter(r => r.id !== id));
    if (expandedRoom === id) setExpandedRoom(null);
  };

  const deleteRowFromRoom = (roomId, rowIndex) => {
    onChange(rooms.map(r => {
      if (r.id !== roomId) return r;
      const newRows = r.rows - 1;
      return newRows < 1 ? r : { ...r, rows: newRows };
    }));
  };

  const addRowToRoom = (roomId) => {
    onChange(rooms.map(r => r.id === roomId ? { ...r, rows: r.rows + 1 } : r));
  };

  const totalCap = rooms.reduce((sum, r) => sum + r.rows * r.cols * 2, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Salon Bilgileri</h2>
        <p className="text-muted-foreground text-sm">Salon ekleyin. Salona tıklayarak krokirden sıra silebilir veya ekleyebilirsiniz.</p>
      </div>

      {/* Add room form */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
        <h3 className="font-semibold text-foreground mb-3 text-sm">Yeni Salon Ekle</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-3 sm:col-span-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Salon Adı</label>
            <input
              type="text"
              value={newRoom.name}
              onChange={e => { setNewRoom(r => ({ ...r, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
              placeholder="A Salonu"
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.name ? 'border-red-400' : 'border-border'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Sıra Sayısı</label>
            <input type="number" min={1} max={20} value={newRoom.rows}
              onChange={e => setNewRoom(r => ({ ...r, rows: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Bank Sayısı</label>
            <input type="number" min={1} max={10} value={newRoom.cols}
              onChange={e => setNewRoom(r => ({ ...r, cols: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Live preview for new room */}
        <RoomSketch rows={newRoom.rows} cols={newRoom.cols} />

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Kapasite: <strong>{parseInt(newRoom.rows || 0) * parseInt(newRoom.cols || 0) * 2}</strong> kişi
          </p>
          <button onClick={addRoom} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Ekle
          </button>
        </div>
      </div>

      {/* Reset button */}
      {rooms.length > 0 && (
        <div className="flex justify-end mb-2">
          <button onClick={() => onChange(DEFAULT_ROOMS)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <RotateCcw className="w-3 h-3" /> Varsayılana sıfırla
          </button>
        </div>
      )}

      {/* Room list */}
      {rooms.length > 0 && (
        <div className="space-y-2 mb-5">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Room header — click to expand/collapse sketch */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{room.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {room.rows} sıra × {room.cols} bank = <strong>{room.rows * room.cols * 2}</strong> kişi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">{expandedRoom === room.id ? '▲' : '▼'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeRoom(room.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expandable sketch */}
              {expandedRoom === room.id && (
                <div className="px-3 pb-3 border-t border-border">
                  <RoomSketch
                    rows={room.rows}
                    cols={room.cols}
                    onDeleteRow={(ri) => deleteRowFromRoom(room.id, ri)}
                    onAddRow={() => addRowToRoom(room.id)}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-2.5 bg-accent rounded-xl border border-primary/20">
            <span className="text-sm font-semibold text-primary">Toplam Kapasite</span>
            <span className="text-sm font-bold text-primary">{totalCap} kişi</span>
          </div>
        </div>
      )}

      {rooms.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Henüz salon eklenmedi</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Geri
        </button>
        <button
          onClick={onNext}
          disabled={rooms.length === 0}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Devam <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}