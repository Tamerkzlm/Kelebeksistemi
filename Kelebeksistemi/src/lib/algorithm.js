// Kelebek Algorithm — Layered Proportional Distribution + Bucket Seating

function fisherYatesShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate seat label: A1, B1, C1... for each physical seat
// Each bank has 2 seats. With cols banks: seats are A1,B1 | C1,D1 | E1,F1 per row
// seatIndex = colIndex*2 + seatInBank  → letter = chr(65+seatIndex), number = rowIndex+1
export function getSeatLabel(colIndex, rowIndex, seatInBank) {
  const seatIndex = colIndex * 2 + seatInBank;
  const letter = String.fromCharCode(65 + seatIndex); // A, B, C, D...
  const number = rowIndex + 1;
  return `${letter}${number}`;
}

// Phase 1: Balanced Proportional Distribution
// Distributes students evenly across rooms so no room has drastically more/fewer students.
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
  const totalCapacity = rooms.reduce((sum, r) => sum + r.rows * r.cols * 2, 0);
  const grades = Object.keys(gradeGroups);

  // Target: fill each room proportionally to its capacity
  // Each room gets: floor(totalStudents * roomCapacity / totalCapacity) students
  const roomCapacities = rooms.map(r => r.rows * r.cols * 2);
  let roomTargets = roomCapacities.map(cap => Math.floor(totalStudents * cap / totalCapacity));

  // Distribute remainder one-by-one to largest-capacity rooms
  let assigned = roomTargets.reduce((a, b) => a + b, 0);
  const sortedByCapIdx = roomCapacities
    .map((cap, i) => ({ cap, i }))
    .sort((a, b) => b.cap - a.cap);
  let extra = totalStudents - assigned;
  for (let k = 0; k < extra; k++) {
    roomTargets[sortedByCapIdx[k % sortedByCapIdx.length].i]++;
  }

  // Shuffle all active students together, then distribute grade-proportionally per room
  const gradeRatios = {};
  for (const g of grades) gradeRatios[g] = gradeGroups[g].length / totalStudents;

  const gradePointers = {};
  for (const g of grades) gradePointers[g] = 0;

  const roomStudents = rooms.map(() => []);

  for (let ri = 0; ri < rooms.length; ri++) {
    const target = roomTargets[ri];
    const allocation = {};
    for (const g of grades) allocation[g] = Math.floor(target * gradeRatios[g]);

    for (const g of grades) {
      for (let k = 0; k < allocation[g]; k++) {
        if (gradePointers[g] < gradeGroups[g].length) {
          roomStudents[ri].push(gradeGroups[g][gradePointers[g]++]);
        }
      }
    }
  }

  // Distribute any remaining students (due to floor rounding) round-robin by room
  const remaining = [];
  for (const g of grades) {
    while (gradePointers[g] < gradeGroups[g].length) {
      remaining.push(gradeGroups[g][gradePointers[g]++]);
    }
  }
  const remainShuffled = fisherYatesShuffle(remaining);
  let rri = 0;
  for (const s of remainShuffled) {
    // Find room with most space relative to target
    let bestRoom = -1, bestRem = -1;
    for (let ri = 0; ri < rooms.length; ri++) {
      const rem = roomCapacities[ri] - roomStudents[ri].length;
      if (rem > 0 && rem > bestRem) { bestRem = rem; bestRoom = ri; }
    }
    if (bestRoom >= 0) roomStudents[bestRoom].push(s);
  }

  return roomStudents;
}

// Phase 2: Bucket Seating (Kelebek Kuralı)
// Öncelik 1: Aynı bankta (sol-sağ) aynı sınıf düzeyi olmasın
// Öncelik 2: Aynı sütun çiftinde (AB, CD, EF) üst-alt komşu banklarda
//            çapraz oturma da dahil aynı sınıf düzeyi olmasın
//   Yani: grid[r][c*2] ile grid[r-1][c*2+1] ve grid[r][c*2+1] ile grid[r-1][c*2] de farklı olmalı
function bucketSeating(students, room) {
  const { rows, cols } = room;

  const buckets = {};
  for (const s of students) {
    if (!buckets[s.grade]) buckets[s.grade] = [];
    buckets[s.grade].push(s);
  }
  for (const g in buckets) buckets[g] = fisherYatesShuffle(buckets[g]);

  const grid = Array.from({ length: rows }, () => Array(cols * 2).fill(null));
  const violations = [];

  const gradeAt = (r, c) => (r >= 0 && grid[r][c]) ? grid[r][c].grade : null;

  // Get bucket with most students, excluding specified grades
  const getMaxBucket = (...excludeGrades) => {
    let maxGrade = null, maxCount = -1;
    for (const g in buckets) {
      if (excludeGrades.includes(g)) continue;
      if (buckets[g].length > maxCount) { maxCount = buckets[g].length; maxGrade = g; }
    }
    return maxGrade;
  };

  // Fill row by row, column by column
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const total = Object.values(buckets).reduce((s, b) => s + b.length, 0);
      if (total === 0) break;

      // Grades to exclude for left seat (c*2):
      // - above-left same col: grid[r-1][c*2]
      // - above-right (çapraz): grid[r-1][c*2+1]
      const excludeLeft = new Set([
        gradeAt(r - 1, c * 2),
        gradeAt(r - 1, c * 2 + 1),
      ].filter(Boolean));

      let leftGrade = getMaxBucket(...excludeLeft);
      if (!leftGrade) leftGrade = getMaxBucket(...[gradeAt(r - 1, c * 2)].filter(Boolean)); // relax çapraz
      if (!leftGrade) leftGrade = getMaxBucket(); // forced

      let leftStudent = null;
      if (leftGrade && buckets[leftGrade].length > 0) {
        leftStudent = buckets[leftGrade].pop();
        grid[r][c * 2] = { ...leftStudent, koltuk: getSeatLabel(c, r, 0) };
      }

      const total2 = Object.values(buckets).reduce((s, b) => s + b.length, 0);
      if (total2 === 0) break;

      // Grades to exclude for right seat (c*2+1):
      // - same bank partner (left seat) — öncelik 1
      // - above-right same col: grid[r-1][c*2+1]
      // - above-left (çapraz): grid[r-1][c*2]
      const leftGradeNow = leftStudent ? leftStudent.grade : null;
      const excludeRight = new Set([
        leftGradeNow,
        gradeAt(r - 1, c * 2 + 1),
        gradeAt(r - 1, c * 2),
      ].filter(Boolean));

      let rightGrade = getMaxBucket(...excludeRight);
      if (!rightGrade) rightGrade = getMaxBucket(...[leftGradeNow, gradeAt(r - 1, c * 2 + 1)].filter(Boolean)); // relax çapraz
      if (!rightGrade) rightGrade = getMaxBucket(leftGradeNow); // relax ardışık, koru bank
      if (!rightGrade) rightGrade = getMaxBucket(); // forced violation

      if (rightGrade && buckets[rightGrade].length > 0) {
        const rightStudent = buckets[rightGrade].pop();
        grid[r][c * 2 + 1] = { ...rightStudent, koltuk: getSeatLabel(c, r, 1) };

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