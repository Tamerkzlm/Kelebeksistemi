import React, { useState } from 'react';
import SeatCell from './SeatCell';
import { getSeatLabel } from '../../lib/algorithm';

export default function RoomGrid({ assignment, onSwap }) {
  const { room, grid, violations } = assignment;
  const [dragSource, setDragSource] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  // Build violation set for quick lookup
  const violationSet = new Set(violations.map(v => `${v.row}-${v.col}`));

  const handleDragStart = (row, col, seatInBank) => {
    setDragSource({ row, col, seatInBank });
  };

  const handleDragOver = (row, col, seatInBank) => {
    setDragOver({ row, col, seatInBank });
  };

  const handleDrop = (row, col, seatInBank) => {
    if (!dragSource) return;
    const src = dragSource;
    const dst = { row, col, seatInBank };
    if (src.row !== dst.row || src.col !== dst.col || src.seatInBank !== dst.seatInBank) {
      onSwap(src, dst);
    }
    setDragSource(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragOver(null);
  };

  // Column headers
  const colLetters = Array.from({ length: room.cols }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="overflow-x-auto">
      {/* Teacher desk indicator */}
      <div className="flex justify-center mb-4">
        <div className="px-6 py-1.5 rounded-lg bg-secondary border border-border text-xs font-semibold text-muted-foreground tracking-wide">
          TAHTA / ÖĞRETMEN MASASI
        </div>
      </div>

      {/* Column headers */}
      <div className="flex gap-1 mb-1 pl-[44px]">
        {colLetters.map(letter => (
          <div key={letter} className="flex gap-1" style={{ width: `${100 / room.cols}%` }}>
            <div className="flex-1 text-center text-xs font-bold text-muted-foreground">{letter} Sol</div>
            <div className="flex-1 text-center text-xs font-bold text-muted-foreground">{letter} Sağ</div>
          </div>
        ))}
      </div>

      {/* Grid rows */}
      <div className="flex">
        {/* Window (CAM) left side */}
        <div className="flex items-center justify-center w-6 mr-2 rounded-lg border-2 border-blue-300 bg-blue-50/60 text-blue-500 text-[10px] font-bold tracking-widest" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>
          CAM
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-1">
              {/* Row number */}
              <div className="w-5 shrink-0 text-xs font-semibold text-muted-foreground text-right pr-1">
                {rowIdx + 1}
              </div>

              {/* Banks */}
              {colLetters.map((_, colIdx) => {
                const leftSeatIdx = colIdx * 2;
                const rightSeatIdx = colIdx * 2 + 1;
                const leftStudent = row[leftSeatIdx];
                const rightStudent = row[rightSeatIdx];
                const leftLabel = getSeatLabel(colIdx, rowIdx, 0);
                const rightLabel = getSeatLabel(colIdx, rowIdx, 1);
                const isLeftViolation = violationSet.has(`${rowIdx}-${colIdx}`) && leftStudent;
                const isRightViolation = violationSet.has(`${rowIdx}-${colIdx}`) && rightStudent;
                const isLeftDragOver = dragOver?.row === rowIdx && dragOver?.col === colIdx && dragOver?.seatInBank === 0;
                const isRightDragOver = dragOver?.row === rowIdx && dragOver?.col === colIdx && dragOver?.seatInBank === 1;

                return (
                  <div key={colIdx} className="flex gap-0.5 flex-1">
                    {/* Bank separator line */}
                    <div className="flex-1">
                      <SeatCell
                        student={leftStudent}
                        seatLabel={leftLabel}
                        isViolation={!!isLeftViolation}
                        isDragOver={isLeftDragOver}
                        onDragStart={() => handleDragStart(rowIdx, colIdx, 0)}
                        onDragOver={() => handleDragOver(rowIdx, colIdx, 0)}
                        onDrop={() => handleDrop(rowIdx, colIdx, 0)}
                        onDragEnd={handleDragEnd}
                      />
                    </div>
                    <div className="w-px bg-border/60 self-stretch my-0.5" />
                    <div className="flex-1">
                      <SeatCell
                        student={rightStudent}
                        seatLabel={rightLabel}
                        isViolation={!!isRightViolation}
                        isDragOver={isRightDragOver}
                        onDragStart={() => handleDragStart(rowIdx, colIdx, 1)}
                        onDragOver={() => handleDragOver(rowIdx, colIdx, 1)}
                        onDrop={() => handleDrop(rowIdx, colIdx, 1)}
                        onDragEnd={handleDragEnd}
                      />
                    </div>
                    {colIdx < colLetters.length - 1 && (
                      <div className="w-2 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="px-6 py-1.5 rounded-lg bg-secondary border border-border text-xs font-semibold text-muted-foreground tracking-wide">
          ARKA DUVAR
        </div>
      </div>
    </div>
  );
}