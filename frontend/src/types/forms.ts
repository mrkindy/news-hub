// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Form Errors Types
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
