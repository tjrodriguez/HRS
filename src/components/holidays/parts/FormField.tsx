'use client';

import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2">{label}</Label>
      {children}
    </div>
  );
}
