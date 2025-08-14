import { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';

// Common UI Types
export type Option = {
  label: string;
  value: string;
};

// Common UI Types
export type UseQueryMap = {
  data: Option[];
  isLoading: boolean;
};

// Button Component Types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

// Input Component Types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// Card Component Types
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Loading Spinner Types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Multi Select Autocomplete Types
export interface MultiSelectAutocompleteProps {
  label: string;
  fetchOptions: (query: string, page?: number) => Promise<Option[]>;
  value: Option[];
  onChange: (selected: Option[]) => void;
  isLoading?: boolean;
  onInputChange?: (query: string) => void;
}

// Date Range Picker Types
export interface DateRangePickerProps {
  onRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  initialRange?: { from: Date | null; to: Date | null };
  className?: string;
}

export interface QuickRange {
  label: string;
  getValue: () => { from: Date; to: Date };
}
