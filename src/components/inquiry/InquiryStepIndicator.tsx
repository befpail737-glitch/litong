'use client';

import { Check , LucideIcon } from 'lucide-react';

import { InquiryFormStep } from '@/contexts/InquiryContext';
import { cn } from '@/lib/utils';

interface Step {
  key: InquiryFormStep
  title: string
  description: string
  icon: LucideIcon
  required: boolean
}

interface InquiryStepIndicatorProps {
  steps: Step[]
  currentStep: InquiryFormStep
  completedSteps: InquiryFormStep[]
  onStepClick: (step: InquiryFormStep) => void
}

export function InquiryStepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick
}: InquiryStepIndicatorProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.key === currentStep;
        const isCompleted = completedSteps.includes(step.key);
        const isClickable = isCompleted || isActive || index <= steps.findIndex(s => s.key === currentStep);

        return (
          <button
            key={step.key}
            onClick={() => isClickable && onStepClick(step.key)}
            disabled={!isClickable}
            className={cn(
              'w-full text-left p-4 rounded-lg border transition-all duration-200',
              'hover:shadow-sm',
              {
                'bg-blue-50 border-blue-200 shadow-sm': isActive,
                'bg-green-50 border-green-200': isCompleted && !isActive,
                'bg-white border-gray-200': !isActive && !isCompleted && isClickable,
                'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed': !isClickable,
                'hover:border-blue-300': !isActive && !isCompleted && isClickable,
              }
            )}
          >
            <div className="flex items-start gap-3">
              {/* 图标或状态指示器 */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                {
                  'bg-blue-100 text-blue-600': isActive,
                  'bg-green-100 text-green-600': isCompleted && !isActive,
                  'bg-gray-100 text-gray-600': !isActive && !isCompleted,
                }
              )}>
                {isCompleted && !isActive ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* 步骤信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={cn(
                    'h-4 w-4 flex-shrink-0',
                    {
                      'text-blue-600': isActive,
                      'text-green-600': isCompleted && !isActive,
                      'text-gray-500': !isActive && !isCompleted,
                    }
                  )} />
                  <h3 className={cn(
                    'font-medium text-sm truncate',
                    {
                      'text-blue-900': isActive,
                      'text-green-900': isCompleted && !isActive,
                      'text-gray-900': !isActive && !isCompleted && isClickable,
                      'text-gray-500': !isClickable,
                    }
                  )}>
                    {step.title}
                    {step.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>
                <p className={cn(
                  'text-xs mt-1',
                  {
                    'text-blue-600': isActive,
                    'text-green-600': isCompleted && !isActive,
                    'text-gray-500': !isActive && !isCompleted && isClickable,
                    'text-gray-400': !isClickable,
                  }
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
