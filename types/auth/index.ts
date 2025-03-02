import { AuthError } from '@supabase/supabase-js';

export type FormData = {
  email: string;
  password: string;
};

export type ActionType = {
  (formData: FormData): Promise<{ status: string; error: AuthError }>;
  (formData: FormData): Promise<{ status: string; error: AuthError }>;
  (arg0: { email: string; password: string }): Promise<{
    status: string;
    error: AuthError;
  }>;
};
