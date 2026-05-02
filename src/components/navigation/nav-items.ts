import { Calendar, LayoutDashboard, BookOpen, History, User, LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/holidays', label: 'Calendar', icon: Calendar },
  { path: '/templates', label: 'Content Library', icon: BookOpen },
  { path: '/history', label: 'History', icon: History },
  { path: '/profile', label: 'Profile', icon: User },
];
