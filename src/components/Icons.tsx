import {
  Eye,
  EyeOff,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  eye: Eye,
  eyeOff: EyeOff,
  spinner: Loader2,
} as const; 