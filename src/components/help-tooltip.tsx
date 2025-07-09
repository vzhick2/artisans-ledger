'use client';

import { ReactNode } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string | ReactNode;
  className?: string;
}

export function HelpTooltip({ content, className = "" }: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-foreground transition-colors ${className}`}
            aria-label="Help"
          >
            <HelpCircle className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs text-sm">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface FormFieldWithHelpProps {
  label: string;
  helpText?: string | ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormFieldWithHelp({ 
  label, 
  helpText, 
  required = false, 
  children, 
  className = "" 
}: FormFieldWithHelpProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helpText && <HelpTooltip content={helpText} />}
      </div>
      {children}
    </div>
  );
}
