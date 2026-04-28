"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Sparkles, User, LayoutDashboard, LogOut, BookOpen, History } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/holidays', label: 'Calendar', icon: Calendar },
    { path: '/templates', label: 'Content Library', icon: BookOpen },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Enhanced with better visual hierarchy */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Flat design with solid colors */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-foreground leading-tight">
                  HolidayBoost
                </h1>
                <p className="text-xs text-muted-foreground">Marketing Reminders</p>
              </div>
            </Link>
            
            {/* Navigation - Enhanced with better active states */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile nav & logout */}
            <div className="flex items-center gap-2">
              {/* Mobile nav */}
              <div className="md:hidden flex gap-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
              
              {/* Logout button - Enhanced with better hover state */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive-light transition-all duration-200 focus-ring"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced with better spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>
      
      {/* Footer - Enhanced with better visual separation */}
      <footer className="border-t border-border bg-muted/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 HolidayBoost. Empower your holiday marketing.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors duration-200">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
