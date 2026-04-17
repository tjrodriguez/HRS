"use client";
import Link from 'next/link';
import { useBusiness } from '@/context/BusinessContext';
import { Calendar, Bell, TrendingUp, Sparkles, Clock, ArrowRight, Gift, Zap, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { useState, useMemo } from 'react';

export function Dashboard() {
  const { profile, holidays, engagementData } = useBusiness();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get today's date
  const today = new Date();
  
  // Filter upcoming holidays (within next 60 days)
  const upcomingHolidays = holidays
    .filter(holiday => {
      const holidayDate = parseISO(holiday.date);
      const daysUntil = differenceInDays(holidayDate, today);
      return daysUntil >= 0 && daysUntil <= 60;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);

  // Get holidays needing reminders (7 days before)
  const needsReminder = holidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    const reminderDate = addDays(holidayDate, -7);
    const daysUntilReminder = differenceInDays(reminderDate, today);
    return daysUntilReminder <= 0 && daysUntilReminder >= -1 && !holiday.reminderSent;
  });

  // Calculate stats
  const totalEngagement = engagementData.reduce((sum, record) => 
    sum + record.likes + record.comments + record.shares, 0
  );
  const totalReach = engagementData.reduce((sum, record) => sum + record.reach, 0);

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Map holidays to dates for quick lookup
  const holidaysByDate = useMemo(() => {
    const map = new Map<string, typeof holidays>();
    holidays.forEach(holiday => {
      const dateStr = format(parseISO(holiday.date), 'yyyy-MM-dd');
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)!.push(holiday);
    });
    return map;
  }, [holidays]);

  const getHolidaysForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidaysByDate.get(dateStr) || [];
  };

  const isHolidayDay = (date: Date) => getHolidaysForDay(date).length > 0;
  const needsReminderDay = (date: Date) => {
    const dayHolidays = getHolidaysForDay(date);
    return dayHolidays.some(h => {
      const reminderDate = addDays(parseISO(h.date), -7);
      return isSameDay(reminderDate, date);
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section with Enhanced Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-accent/10 mix-blend-overlay"></div>
        
        {/* Animated decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/30 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative p-8 md:p-12 z-10 backdrop-blur-md border border-white/20 rounded-3xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-white/95 animate-bounce" />
                <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Welcome Back</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
                Hi {profile?.name}! 🎉
              </h2>
              <p className="text-base md:text-lg font-medium text-white/95 max-w-2xl leading-relaxed drop-shadow-md">
                Ready to boost your holiday marketing? Let's create amazing content that drives engagement.
              </p>
            </div>
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl px-8 py-6 border border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Today</p>
                  <p className="text-2xl font-extrabold text-white tracking-tight mb-2">{format(today, 'MMM dd')}</p>
                  <div className="text-4xl">📅</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Upcoming Holidays */}
        <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 bg-gradient-to-br from-card/60 to-card/40 p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full mix-blend-overlay filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-primary/30">
                <Calendar className="w-6 md:w-7 h-6 md:h-7 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary bg-primary/30 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider border border-primary/40">Next 60d</span>
            </div>
            <div className="mb-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 tracking-tight">{upcomingHolidays.length}</h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Upcoming Holidays</p>
            </div>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="truncate">{upcomingHolidays.length > 0 ? `Next: ${upcomingHolidays[0].name}` : 'No holidays'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Reminders */}
        <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 bg-gradient-to-br from-card/60 to-card/40 p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/30 rounded-full mix-blend-overlay filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-secondary/30">
                <Bell className="w-6 md:w-7 h-6 md:h-7 text-secondary" />
              </div>
              {needsReminder.length > 0 && (
                <span className="text-xs font-bold text-white bg-destructive px-3 py-1 rounded-full animate-pulse uppercase tracking-wider shadow-lg">
                  Action!
                </span>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 tracking-tight">{needsReminder.length}</h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Reminders</p>
            </div>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-secondary" />
                {needsReminder.length > 0 ? 'Create posts now' : 'All caught up'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Engagement */}
        <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 bg-gradient-to-br from-card/60 to-card/40 p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/30 rounded-full mix-blend-overlay filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-accent/30">
                <TrendingUp className="w-6 md:w-7 h-6 md:h-7 text-accent" />
              </div>
              <span className="text-xs font-bold text-accent bg-accent/30 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider border border-accent/40">Trending</span>
            </div>
            <div className="mb-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 tracking-tight">{(totalEngagement / 1000).toFixed(1)}k</h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Engagement</p>
            </div>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                <span className="truncate">{(totalReach / 1000).toFixed(0)}k reach</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Calendar Section with Glowing Markers */}
      <div className="rounded-3xl bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-xl shadow-xl border border-white/20 overflow-hidden transition-all hover:shadow-2xl hover:border-white/40">
        {/* Header with Theme Colors */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md px-6 md:px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl shadow-lg border border-white/20">
              <Calendar className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Holiday Calendar</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{format(currentMonth, 'MMMM yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(addDays(currentMonth, -31))}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/10 hover:border-white/20"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary/30 to-primary/20 text-primary rounded-xl hover:from-primary/50 hover:to-primary/40 transition-all duration-300 border border-primary/50 hover:border-primary/70 shadow-md"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(addDays(currentMonth, 31))}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/10 hover:border-white/20"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 md:p-8">
          {/* Weekday Headers with Theme Colors */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={day} className="text-center py-2 md:py-3">
                <p className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                  idx === 0 ? 'text-primary/80' : idx === 6 ? 'text-secondary/80' : 'text-muted-foreground'
                }`}>{day}</p>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {daysInMonth.map(day => {
              const hasHoliday = isHolidayDay(day);
              const hasReminder = needsReminderDay(day);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              
              return (
                <div
                  key={day.toISOString()}
                  className={`relative aspect-square rounded-2xl transition-all duration-300 border overflow-hidden group cursor-pointer ${
                    isCurrentMonth
                      ? 'bg-card/60 border-white/10 hover:border-primary/30 hover:bg-card/80'
                      : 'bg-muted/20 border-transparent opacity-50'
                  } ${hasHoliday ? 'ring-2 ring-primary/60 ring-offset-0 border-primary/40' : hasReminder ? 'ring-2 ring-secondary/50 ring-offset-0' : ''}`}
                >
                  {/* Enhanced Glow effect for holiday and reminder days */}
                  {hasHoliday && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/20 to-accent/20 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/30 rounded-xl blur-md opacity-40 animate-pulse"></div>
                    </>
                  )}
                  {hasReminder && !hasHoliday && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-accent/30 to-primary/10 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/30 to-accent/20 rounded-xl blur-md opacity-30 animate-pulse"></div>
                    </>
                  )}

                  {/* Day content */}
                  <div className="relative h-full flex flex-col items-center justify-start p-1 md:p-2 z-10">
                    <span className={`text-xs md:text-sm font-bold mb-1 transition-all ${
                      isCurrentDay
                        ? 'w-6 h-6 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-lg drop-shadow-md'
                        : hasHoliday
                        ? 'text-primary font-extrabold'
                        : hasReminder
                        ? 'text-secondary/80 font-semibold'
                        : 'text-foreground'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Event indicators with theme colors */}
                    {hasReminder && !hasHoliday && (
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse shadow-md shadow-secondary/50"></div>
                    )}
                    {hasHoliday && (
                      <div className="flex gap-0.5 justify-center flex-wrap px-1">
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg shadow-primary/60 animate-soft-glow"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Legend with Theme Colors */}
          <div className="mt-8 pt-8 border-t border-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8">
            <div className="flex items-center gap-3 group">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/60 group-hover:scale-125 transition-transform"></div>
              <span className="text-sm font-semibold text-foreground">Holiday Event</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse shadow-md shadow-secondary/50 group-hover:scale-125 transition-transform"></div>
              <span className="text-sm font-semibold text-foreground">Reminder Day (7 days before)</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:scale-125 transition-transform"></div>
              <span className="text-sm font-semibold text-foreground">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Required Alert */}
      {needsReminder.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-xl border border-destructive/30 bg-gradient-to-br from-destructive/15 to-destructive/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-destructive/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/30 shadow-lg border border-destructive/40">
                  <Zap className="w-7 h-7 text-destructive animate-pulse" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">⚡ Create Holiday Content</h3>
                <p className="text-muted-foreground mb-6 font-medium leading-relaxed">
                  {needsReminder.length} holiday{needsReminder.length > 1 ? 's are' : ' is'} coming up within a week. Don't miss this opportunity to engage your audience with timely marketing!
                </p>
                <div className="space-y-3">
                  {needsReminder.map(holiday => {
                    const daysUntil = differenceInDays(parseISO(holiday.date), today);
                    return (
                      <div key={holiday.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 backdrop-blur rounded-2xl p-4 md:p-5 border border-white/10 hover:border-destructive/40 transition-all duration-300 gap-3">
                        <div>
                          <p className="text-lg font-bold text-foreground tracking-tight">{holiday.name}</p>
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-destructive/70" />
                            {format(parseISO(holiday.date), 'MMMM dd')} • <span className="text-destructive font-bold">{daysUntil} day{daysUntil !== 1 ? 's' : ''}</span>
                          </p>
                        </div>
                        <Link
                          href={`/create/${holiday.id}`}
                          className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-destructive to-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                          Create Now
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Holidays Section */}
      <div className="rounded-3xl bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-xl shadow-xl border border-white/20 overflow-hidden transition-all hover:shadow-2xl hover:border-white/40">
        <div className="bg-white/5 backdrop-blur-md px-6 md:px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl shadow-inner border border-accent/30">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Upcoming Holidays</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Plan your campaigns</p>
            </div>
          </div>
          <Link href="/holidays" className="flex items-center gap-2 px-5 py-2.5 bg-accent/25 text-accent font-bold hover:bg-accent/35 rounded-xl transition-all duration-300 tracking-wide shadow-sm hover:shadow-md border border-accent/30 hover:border-accent/50 whitespace-nowrap">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-white/10">
          {upcomingHolidays.map((holiday, index) => {
            const daysUntil = differenceInDays(parseISO(holiday.date), today);
            const isWithinWeek = daysUntil <= 7;
            
            return (
              <div key={holiday.id} className="p-5 md:p-7 hover:bg-white/5 transition-all duration-300 group border-b-0 last:border-b-0">
                <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                  <div className="flex items-start gap-4 md:gap-5 flex-1 w-full">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-lg border transition-all duration-300 ${
                        isWithinWeek 
                          ? 'bg-gradient-to-br from-destructive/40 to-destructive/20 text-destructive border-destructive/30 scale-110' 
                          : 'bg-gradient-to-br from-primary/40 to-primary/20 text-primary border-primary/30 group-hover:scale-105'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-lg md:text-xl font-bold text-foreground tracking-tight">{holiday.name}</h4>
                        {isWithinWeek && (
                          <span className="px-3 py-1 bg-destructive/30 text-destructive text-xs font-bold rounded-full uppercase tracking-wider shadow-md animate-pulse border border-destructive/40 flex-shrink-0">
                            This Week!
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{format(parseISO(holiday.date), 'EEEE, MMMM dd, yyyy')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 w-full sm:w-auto">
                    <div className="text-right">
                      <p className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isWithinWeek ? 'text-destructive' : 'text-primary'}`}>{daysUntil}</p>
                      <p className="text-xs md:text-xs font-semibold text-muted-foreground uppercase tracking-wide">days away</p>
                    </div>
                    <Link
                      href={`/create/${holiday.id}`}
                      className="flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 bg-primary/30 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hidden sm:block border border-primary/40 hover:border-primary/60 whitespace-nowrap text-sm md:text-base"
                    >
                      Create
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingHolidays.length === 0 && (
            <div className="p-12 md:p-16 text-center">
              <div className="w-20 h-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/10">
                <Calendar className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">No Holidays Soon</h4>
              <p className="text-muted-foreground font-medium">There are no upcoming holidays in the next 60 days.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
