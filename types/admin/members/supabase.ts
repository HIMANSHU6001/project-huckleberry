export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          created_at: string;
          profile_photo: string;
          user_name: string;
          email: string;
          mobile_no: number;
          role: string;
          github: string;
          linkedin: string;
          twitter: string;
          other_socials: string[];
          caption: string | null;
          introduction: string;
          is_admin: boolean;
          is_super_admin: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          profile_photo: string;
          user_name: string;
          email: string;
          mobile_no: number;
          role: string;
          github: string;
          linkedin: string;
          twitter: string;
          other_socials: string[];
          caption?: string | null;
          introduction: string;
          is_admin?: boolean;
          is_super_admin?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          profile_photo?: string;
          user_name?: string;
          email?: string;
          mobile_no?: number;
          role?: string;
          github?: string;
          linkedin?: string;
          twitter?: string;
          other_socials?: string[];
          caption?: string | null;
          introduction?: string;
          is_admin?: boolean;
          is_super_admin?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
