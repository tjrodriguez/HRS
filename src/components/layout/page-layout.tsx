'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LogOut, User, Pin, PinOff, Plus, Bell, Calendar, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchActivityLogs, getActivityTypeDisplay, getActivityIcon, ActivityLog } from '@/lib/activity';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { navItems } from '@/components/navigation';
import { cn } from '@/lib/utils';
import { getUpcomingHolidays, Holiday } from '@/utils/data';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function PageLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [isPinned, setIsPinned] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [upcomingHolidays, setUpcomingHolidays] = React.useState<Holiday[]>([]);
  const [notifications, setNotifications] = React.useState<ActivityLog[]>([]);
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const hoverRef = React.useRef(false);

  // Fetch upcoming holidays for reminders
  React.useEffect(() => {
    const fetchUpcoming = async () => {
      const holidays = await getUpcomingHolidays(7);
      setUpcomingHolidays(holidays);
    };
    fetchUpcoming();
  }, []);

  // Fetch recent activity for notifications panel
  React.useEffect(() => {
    if (!notifOpen) return;
    const load = async () => {
      setNotifLoading(true);
      try {
        const { logs } = await fetchActivityLogs({ limit: 10 });
        setNotifications(logs);
      } catch {
        setNotifications([]);
      } finally {
        setNotifLoading(false);
      }
    };
    load();
  }, [notifOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Handle pin toggle
  const togglePin = React.useCallback(() => {
    setIsPinned((prev) => {
      const newPinned = !prev;
      // When pinning, open the sidebar. When unpinning, close it.
      setOpen(newPinned);
      return newPinned;
    });
  }, []);

  // Handle hover with debounce for smoother UX
  const handleMouseEnter = React.useCallback(() => {
    hoverRef.current = true;
    setIsHovered(true);
    if (!isPinned) {
      setOpen(true);
    }
  }, [isPinned]);

  const handleMouseLeave = React.useCallback(() => {
    hoverRef.current = false;
    setIsHovered(false);
    // Only auto-collapse if not pinned
    if (!isPinned) {
      // Small delay to prevent flickering when moving between sidebar elements
      setTimeout(() => {
        // Use ref to check current hover state (avoids stale closure)
        if (!hoverRef.current) {
          setOpen(false);
        }
      }, 200);
    }
  }, [isPinned]);

  return (
    <SidebarProvider defaultOpen={false} open={open} onOpenChange={setOpen}>
      <div className="flex min-h-svh w-full">
        {/* Sidebar with hover detection */}
        <Sidebar
          collapsible="icon"
          className="border-r border-border"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SidebarHeader className="p-3">
            <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
              <Link
                href="/"
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors flex-1 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:flex-none"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  HolidayBoost
                </span>
              </Link>
              {/* Pin toggle button - only visible when expanded */}
              <button
                onClick={togglePin}
                className={cn(
                  'hidden items-center justify-center w-7 h-7 rounded-md transition-all duration-200 group-data-[collapsible=icon]:hidden md:flex',
                  isPinned
                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </button>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                    const isCalendar = item.path === '/holidays';
                    const hasUpcoming = isCalendar && upcomingHolidays.length > 0;


                    return (
                      <SidebarMenuItem key={item.path}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={item.path}
                              className={cn(
                                'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground',
                                'group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                              )}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <div className="relative">
                                <Icon className="shrink-0 w-4 h-4" />
                                {hasUpcoming && (
                                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                              </div>
                              <span className="group-data-[collapsible=icon]:hidden truncate">
                                {item.label}
                              </span>
                              {hasUpcoming && (
                                <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden">
                                  {upcomingHolidays.length}
                                </span>
                              )}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleLogout}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                      className={cn(
                        'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground cursor-pointer',
                        'group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                        'text-sidebar-foreground hover:text-destructive hover:bg-destructive/10'
                      )}
                    >
                      <LogOut className="shrink-0 w-4 h-4" />
                      <span className="group-data-[collapsible=icon]:hidden truncate">
                        Sign out
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Sign out
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col min-h-svh">
          {/* Minimal Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
            {/* Breadcrumb / Page Title could go here */}
            <div className="flex-1" />

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Create Button - Primary Action */}
              <Link
                href="/holidays"
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Link>

              {/* Activity Notification Bell */}
              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger
                  className="relative flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Notifications"
                  aria-haspopup="dialog"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 sm:w-96 p-0"
                  sideOffset={8}
                >
                  <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-primary/10 px-4 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {notifications.length} new
                        </span>
                      )}
                    </div>
                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-80">
                      {notifLoading ? (
                        <div className="px-4 py-8 text-center">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-xs text-muted-foreground mt-2">Loading notifications...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                          {notifications.map((log) => {
                            const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });
                            const icon = getActivityIcon(log.activity_type);
                            const title = getActivityTypeDisplay(log.activity_type);
                            const preview = log.content_preview || log.holiday_name || (log.caption ? log.caption.slice(0, 60) : '');

                            return (
                              <Link
                                key={log.id}
                                href="/history"
                                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:bg-muted/70"
                                onClick={() => setNotifOpen(false)}
                              >
                                <span className="text-base leading-none mt-0.5 flex-shrink-0 select-none">{icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {title}
                                  </p>
                                  {preview && (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                      {preview}
                                    </p>
                                  )}
                                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                                    {timeAgo}
                                  </p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 mt-1" />
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No recent notifications</p>
                        </div>
                      )}
                    </div>
                    {/* Footer */}
                    <div className="px-4 py-2.5 bg-muted/30 border-t border-border">
                      <Link
                        href="/history"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 font-medium"
                        onClick={() => setNotifOpen(false)}
                      >
                        View all activity
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Profile"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 w-full">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-muted/30 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  &copy; 2026 HolidayBoost. Empower your holiday marketing.
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    Terms
                  </a>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
