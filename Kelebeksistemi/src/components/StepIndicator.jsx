import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Sınav Bilgileri' },
  { id: 2, label: 'Öğrenci Listesi' },
  { id: 3, label: 'Salon Bilgileri' },
  { id: 4, label: 'Seçenekler' },
  { id: 5, label: 'Oturma Planı' },
];

export default function StepIndicator({ currentStep, maxStep, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {steps.map((step, i) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isReachable = step.id <= maxStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => isReachable && onStepClick(step.id)}
                disabled={!isReachable}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/80 cursor-pointer'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 cursor-default'
                    : isReachable
                    ? 'bg-secondary text-muted-foreground hover:bg-primary/20 cursor-pointer'
                    : 'bg-secondary text-muted-foreground opacity-40 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </button>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors ${
                  isCurrent
                    ? 'text-primary'
                    : isReachable
                    ? 'text-muted-foreground hover:text-primary cursor-pointer'
                    : 'text-muted-foreground opacity-40'
                }`}
                onClick={() => isReachable && onStepClick(step.id)}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 md:w-20 mx-1 mb-4 transition-all duration-500 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
