// localStorage sync utility

const KEYS = {
  EXAM_INFO: 'kelebek_exam_info',
  STUDENTS: 'kelebek_students',
  ROOMS: 'kelebek_rooms',
  PLAN: 'kelebek_plan',
  ACTIVE_GRADES: 'kelebek_active_grades',
};

export const store = {
  getExamInfo: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.EXAM_INFO)) || {}; } catch { return {}; }
  },
  setExamInfo: (data) => localStorage.setItem(KEYS.EXAM_INFO, JSON.stringify(data)),

  getStudents: () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.STUDENTS));
      return Array.isArray(saved) && saved.length > 0 ? saved : [];
    } catch { return []; }
  },
  setStudents: (data) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data)),

  getRooms: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.ROOMS)) || []; } catch { return []; }
  },
  setRooms: (data) => localStorage.setItem(KEYS.ROOMS, JSON.stringify(data)),

  getPlan: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.PLAN)) || null; } catch { return null; }
  },
  setPlan: (data) => localStorage.setItem(KEYS.PLAN, JSON.stringify(data)),

  getActiveGrades: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.ACTIVE_GRADES)) || ['9', '10', '11', '12']; } catch { return ['9', '10', '11', '12']; }
  },
  setActiveGrades: (data) => localStorage.setItem(KEYS.ACTIVE_GRADES, JSON.stringify(data)),

  clearPlan: () => localStorage.removeItem(KEYS.PLAN),
};