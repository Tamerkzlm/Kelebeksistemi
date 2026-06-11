import React, { useState, useEffect } from 'react';
import { store } from '../lib/store';
import { runAlgorithm } from '../lib/algorithm';
import CapacityBar from '../components/CapacityBar';
import StepIndicator from '../components/StepIndicator';
import Step1ExamInfo from '../steps/Step1ExamInfo';
import Step2Students from '../steps/Step2Students';
import Step3Rooms from '../steps/Step3Rooms';
import Step4Options from '../steps/Step4Options';
import Step5Plan from '../steps/Step5Plan/index';

export default function KelebekApp() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [examInfo, setExamInfo] = useState(store.getExamInfo());
  const [students, setStudents] = useState(store.getStudents());
  const [rooms, setRooms] = useState(store.getRooms());
  const [activeGrades, setActiveGrades] = useState(store.getActiveGrades());
  const [plan, setPlan] = useState(store.getPlan());
  const [error, setError] = useState(null);

  useEffect(() => { store.setExamInfo(examInfo); }, [examInfo]);
  useEffect(() => { store.setStudents(students); }, [students]);
  useEffect(() => { store.setRooms(rooms); }, [rooms]);
  useEffect(() => { store.setActiveGrades(activeGrades); }, [activeGrades]);

  // localStorage'dan yüklenince maxStep'i ayarla
  useEffect(() => {
    let max = 1;
    if (students.length > 0) max = Math.max(max, 2);
    if (rooms.length > 0) max = Math.max(max, 3);
    if (rooms.length > 0 && students.length > 0) max = Math.max(max, 4);
    if (plan) max = Math.max(max, 5);
    setMaxStep(max);
  }, []);

  const goToStep = (n) => {
    setError(null);
    setStep(n);
    setMaxStep(prev => Math.max(prev, n));
  };

  const handleNext = (n) => {
    goToStep(n);
  };

  const handleGenerate = () => {
    setError(null);
    try {
      const newPlan = runAlgorithm(students, rooms, activeGrades);
      setPlan(newPlan);
      store.setPlan(newPlan);
      goToStep(5);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegenerate = () => {
    setError(null);
    try {
      const newPlan = runAlgorithm(students, rooms, activeGrades);
      setPlan(newPlan);
      store.setPlan(newPlan);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl select-none">
            🦋
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Kelebek Sistemi</h1>
            <p className="text-xs text-primary-foreground/70 leading-tight">Sınav Oturma Düzeni Yöneticisi</p>
          </div>
        </div>
      </header>

      <CapacityBar students={students} rooms={rooms} activeGrades={activeGrades} />

      <div className="max-w-6xl mx-auto px-4">
        <StepIndicator currentStep={step} maxStep={maxStep} onStepClick={goToStep} />
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-medium">
            ⚠️ {error}
          </div>
        </div>
      )}

      <div className="text-center -mt-2 mb-2 flex flex-col items-center gap-0.5">
        <span className="text-[10px] text-muted-foreground/50 tracking-widest font-mono">v2.4 — Tabakalı Oransal Dağıtım + Ardışık Kısıt</span>
        <span className="text-[10px] text-muted-foreground/40 font-mono">
          Yapımcı: Tamer Közleme &nbsp;·&nbsp;
          <a href="https://instagram.com/tamerkzlm" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">@tamerkzlm</a>
        </span>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {step === 1 && (
          <Step1ExamInfo examInfo={examInfo} onChange={setExamInfo} onNext={() => handleNext(2)} />
        )}
        {step === 2 && (
          <Step2Students students={students} onChange={setStudents} onNext={() => handleNext(3)} onBack={() => goToStep(1)} />
        )}
        {step === 3 && (
          <Step3Rooms rooms={rooms} onChange={setRooms} onNext={() => handleNext(4)} onBack={() => goToStep(2)} />
        )}
        {step === 4 && (
          <Step4Options students={students} rooms={rooms} activeGrades={activeGrades} onGradesChange={setActiveGrades} onGenerate={handleGenerate} onBack={() => goToStep(3)} />
        )}
        {step === 5 && plan && (
          <Step5Plan plan={plan} examInfo={examInfo} onBack={() => goToStep(4)} onRegenerate={handleRegenerate} />
        )}
      </main>
    </div>
  );
}
