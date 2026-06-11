import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Sınav Bilgileri' },
  { id: 2, label: 'Öğrenci Listesi' },
  { id: 3, label: 'Salon Bilgileri' },
  { id: 4, label: 'Seçenekler' },
  { id: 5, label: 'Oturma Planı' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep > step.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : currentStep === step.id
                  ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-4 h-4" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
              }`}
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
      ))}
    </div>
  );
}