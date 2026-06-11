// Kelebek Algorithm — Layered Proportional Distribution + Bucket Seating

function fisherYatesShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate seat label: column letter + seat number
// col: 0-based column index, row: 0-based row index, seatInBank: 0 or 1
export function getSeatLabel(colIndex, rowIndex, seatInBank) {
  const colLetter = String.fromCharCode(65 + colIndex); // A, B, C...
  const seatNo = rowIndex * 2 + seatInBank + 1;
  return `${colLetter}${seatNo}`;
}

// Phase 1: Layered Proportional Distribution
function layeredDistribution(activeStudents, rooms) {
  const gradeGroups = {};
  for (const s of activeStudents) {
    if (!gradeGroups[s.grade]) gradeGroups[s.grade] = [];
    gradeGroups[s.grade].push(s);
  }

  for (const g in gradeGroups) {
    gradeGroups[g] = fisherYatesShuffle(gradeGroups[g]);
  }

  const totalStudents = activeStudents.length;
  const grades = Object.keys(gradeGroups);

  const gradeRatios = {};
  for (const g of grades) {
    gradeRatios[g] = gradeGroups[g].length / totalStudents;
  }

  const roomAllocations = rooms.map(room => {
    const capacity = room.rows * room.cols * 2;
    const allocation = {};
    for (const g of grades) {
      allocation[g] = Math.floor(capacity * gradeRatios[g]);
    }
    return { room, capacity, allocation };
  });

  const roomStudents = rooms.map(() => []);
  const gradePointers = {};
  for (const g of grades) gradePointers[g] = 0;

  for (let ri = 0; ri < roomAllocations.length; ri++) {
    const { allocation } = roomAllocations[ri];
    for (const g of grades) {
      const count = allocation[g];
      for (let k = 0; k < count; k++) {
        if (gradePointers[g] < gradeGroups[g].length) {
          roomStudents[ri].push(gradeGroups[g][gradePointers[g]]);
          gradePointers[g]++;
        }
      }
    }
  }

  const remainingStudents = [];
  for (const g of grades) {
    while (gradePointers[g] < gradeGroups[g].length) {
      remainingStudents.push(gradeGroups[g][gradePointers[g]]);
      gradePointers[g]++;
    }
  }

  const remainShuffled = fisherYatesShuffle(remainingStudents);
  for (const s of remainShuffled) {
    let bestRoom = -1;
    let bestRemaining = -1;
    for (let ri = 0; ri < rooms.length; ri++) {
      const cap = roomAllocations[ri].capacity;
      const rem = cap - roomStudents[ri].length;
      if (rem > 0 && rem > bestRemaining) {
        bestRemaining = rem;
        bestRoom = ri;
      }
    }
    if (bestRoom >= 0) {
      roomStudents[bestRoom].push(s);
    }
  }

  return roomStudents;
}

// Phase 2: Bucket Seating (Kovalı Kelebek Kuralı)
// Kural: Aynı bank içinde YAN YANA (L-R) aynı sınıf düzeyi olamaz
//        Aynı sütunda ART ARDA (üst-alt) aynı sınıf düzeyi olamaz
function bucketSeating(students, room) {
  const { rows, cols } = room;

  const buckets = {};
  for (const s of students) {
    if (!buckets[s.grade]) buckets[s.grade] = [];
    buckets[s.grade].push(s);
  }

  for (const g in buckets) {
    buckets[g] = fisherYatesShuffle(buckets[g]);
  }

  const grid = Array.from({ length: rows }, () => Array(cols * 2).fill(null));
  const violations = [];

  // Returns grade of student above in the same seat slot (same col, row-1)
  const gradeAbove = (col, row, seatInBank) => {
    if (row === 0) return null;
    const above = grid[row - 1][col * 2 + seatInBank];
    return above ? above.grade : null;
  };

  // Get bucket with most students, excluding specified grades
  const getMaxBucket = (...excludeGrades) => {
    let maxGrade = null, maxCount = -1;
    for (const g in buckets) {
      if (excludeGrades.includes(g)) continue;
      if (buckets[g].length > maxCount) {
        maxCount = buckets[g].length;
        maxGrade = g;
      }
    }
    return maxGrade;
  };

  // Fill column by column, row by row
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const totalRemaining = Object.values(buckets).reduce((s, b) => s + b.length, 0);
      if (totalRemaining === 0) break;

      // --- Left seat (bank 0) ---
      const aboveLeft = gradeAbove(c, r, 0);
      // Exclude the grade above (ardışık kısıt)
      let leftGrade = getMaxBucket(aboveLeft);
      if (!leftGrade) leftGrade = getMaxBucket(); // forced if only one grade remains

      let leftStudent = null;
      if (leftGrade && buckets[leftGrade].length > 0) {
        leftStudent = buckets[leftGrade].pop();
        grid[r][c * 2] = { ...leftStudent, koltuk: getSeatLabel(c, r, 0) };
      }

      const totalRemaining2 = Object.values(buckets).reduce((s, b) => s + b.length, 0);
      if (totalRemaining2 === 0) break;

      // --- Right seat (bank 1) ---
      const aboveRight = gradeAbove(c, r, 1);
      const leftGradeNow = leftStudent ? leftStudent.grade : null;
      // Exclude: same as left seat (yan yana kısıt) AND same as above-right (ardışık kısıt)
      let rightGrade = getMaxBucket(leftGradeNow, aboveRight);
      if (!rightGrade) rightGrade = getMaxBucket(leftGradeNow); // relax ardışık
      if (!rightGrade) rightGrade = getMaxBucket(); // forced violation

      if (rightGrade && buckets[rightGrade].length > 0) {
        const rightStudent = buckets[rightGrade].pop();
        grid[r][c * 2 + 1] = { ...rightStudent, koltuk: getSeatLabel(c, r, 1) };

        // Record violation only if same grade as left neighbor
        if (leftStudent && rightStudent.grade === leftStudent.grade) {
          violations.push({ row: r, col: c });
        }
      }
    }
  }

  return { grid, violations };
}

// Main algorithm entry point
export function runAlgorithm(students, rooms, activeGrades) {
  const activeStudents = students.filter(s => !s.isExempt && activeGrades.includes(s.grade));

  if (activeStudents.length === 0) {
    throw new Error('Sınava girecek aktif öğrenci bulunamadı.');
  }

  const totalCapacity = rooms.reduce((sum, r) => sum + r.rows * r.cols * 2, 0);
  if (activeStudents.length > totalCapacity) {
    throw new Error(`Kapasite yetersiz! Öğrenci: ${activeStudents.length}, Toplam Kapasite: ${totalCapacity}`);
  }

  const roomStudentsList = layeredDistribution(activeStudents, rooms);

  const assignments = [];
  let totalViolations = 0;

  for (let ri = 0; ri < rooms.length; ri++) {
    const room = rooms[ri];
    const roomStudents = roomStudentsList[ri];
    const { grid, violations } = bucketSeating(roomStudents, room);
    assignments.push({ room, grid, violations });
    totalViolations += violations.length;
  }

  return {
    assignments,
    violations: totalViolations,
    timestamp: new Date().toISOString(),
    activeGrades,
  };
}