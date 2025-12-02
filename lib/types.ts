import { LucideIcon } from "lucide-react";

export interface AuthPayload extends Record<string, unknown> {
  id: number;
  username: string;
  fullname: string;
  iat?: number;
  exp?: number;
}

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
} | undefined;


export type LocaleParams = { locale: 'en' | 'so' | 'ar' };

type ContactLabelKey = 'phone' | 'email' | 'location';

export interface ContactItem {
  icon: LucideIcon;
  label: string;
  labelKey: ContactLabelKey;
  value: string;
  link: string;
}