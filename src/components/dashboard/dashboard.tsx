"use client";
import * as React from 'react'
import Link from 'next/link';
import { useBusiness, Holiday, Campaign } from '@/context/BusinessContext';
import { Calendar, Bell, Sparkles, Clock, ArrowRight, Zap, Target, ChevronLeft, ChevronRight, History, Plus, BookOpen, X } from 'lucide-react';
import { format, parseISO, differenceInDays, addDays, startOfMonth, endOfMonth, startOfWeek, addMonths, eachDayOfInterval, isSameDay, isToday, getMonth, isSameMonth } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { fetchActivityLogs, ActivityLog, getActivityTypeDisplay, getActivityIcon } from '@/lib/activity';
import { useRouter } from 'next/navigation';

// Day Popover Component
interface DayPopoverProps {
  day: Date;
  holidays: Holiday[];
  campaigns: Campaign[];
  hasReminder: boolean;
  onClose: () => void;
}

function DayPopover({ day, holidays: dayHolidays, campaigns: dayCampaigns, hasReminder, onClose }: DayPopoverProps): React.ReactElement {
  const router = useRouter();
  const isCurrentDay = isToday(day);
  
  // Find holiday ID for create link (prefer first holiday)
  const holidayId = dayHolidays[0]?.id;
  
  return (
    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card rounded-lg shadow-xl border border-border p-3 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div>
          <p className="text-sm font-semibold text-foreground">{format(day, 'EEEE')}</p>
          <p className={`text-xs ${isCurrentDay ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            {format(day, 'MMMM d, yyyy')}
            {isCurrentDay && ' • Today'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Scheduled Campaigns */}
        {dayCampaigns.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1.5">Scheduled ({dayCampaigns.length})</p>
            <div className="space-y-1.5">
              {dayCampaigns.slice(0, 2).map((campaign) => (
                <div key={campaign.id} className="flex items-center gap-2 p-1.5 bg-accent/10 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground truncate flex-1">
                    {campaign.holiday?.name || 'Post'}
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground uppercase">
                    {Array.isArray(campaign.platforms) ? campaign.platforms.slice(0, 2).join(', ') : (typeof campaign.platforms === 'string' ? campaign.platforms : 'N/A')}
                  </span>
                </div>
              ))}
              {dayCampaigns.length > 2 && (
                <p className="text-[10px] font-normal text-muted-foreground pl-1">+{dayCampaigns.length - 2} more</p>
              )}
            </div>
          </div>
        )}

        {/* Holidays */}
        {dayHolidays.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5">Holiday{dayHolidays.length > 1 ? 's' : ''}</p>
            <div className="space-y-1">
              {dayHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground">{holiday.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminder Status */}
        {hasReminder && (
          <div className="flex items-center gap-2 p-1.5 bg-secondary/10 rounded">
            <Bell className="w-3 h-3 text-secondary" />
            <span className="text-xs font-medium text-secondary">Reminder day (7 days before)</span>
          </div>
        )}

        {/* Empty State */}
        {dayCampaigns.length === 0 && dayHolidays.length === 0 && !hasReminder && (
          <p className="text-xs font-medium text-muted-foreground text-center py-2">No events scheduled</p>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t border-border flex gap-2">
          {holidayId ? (
            <Link
              href={`/create/${holidayId}`}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Create
            </Link>
          ) : (
            <Link
              href="/templates"
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Create
            </Link>
          )}
          <button
            onClick={() => router.push('/holidays')}
            className="px-2 py-1.5 bg-muted text-foreground text-xs font-medium rounded hover:bg-muted/80 transition-colors"
          >
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact Recent Activity component for dashboard
function CompactRecentActivity(): React.ReactElement {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const result = await fetchActivityLogs({ limit: 2, offset: 0 });
        setLogs(result.logs);
      } catch (error) {
        console.error('Error loading activity:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivity();
  }, []);

  if (loading) {
    return <div className="text-xs font-medium text-muted-foreground">Loading...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-xs font-medium text-muted-foreground">No recent activity</div>;
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <Link
          key={log.id}
          href="/history"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm">{getActivityIcon(log.activity_type)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {getActivityTypeDisplay(log.activity_type)}
            </p>
            {log.holiday_name && (
              <p className="text-[10px] font-normal text-muted-foreground truncate">{log.holiday_name}</p>
            )}
          </div>
          <span className="text-[10px] font-normal text-muted-foreground whitespace-nowrap">
            {format(parseISO(log.created_at), 'MMM d')}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function Dashboard(): React.ReactElement {
  const { profile, holidays, campaigns, isLoading } = useBusiness();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Debug: Log campaigns
  useEffect(() => {
    console.log('Dashboard campaigns:', campaigns.length, campaigns);
    console.log('Loading state:', isLoading);
  }, [campaigns, isLoading]);

  // Get today's date
  const today = new Date();
  
  // Filter upcoming holidays (within next 60 days, top 3 only)
  const upcomingHolidays = holidays
    .filter(holiday => {
      const holidayDate = parseISO(holiday.date);
      const daysUntil = differenceInDays(holidayDate, today);
      return daysUntil >= 0 && daysUntil <= 60;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

  // Get holidays needing reminders (7 days before)
  const needsReminder = holidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    const reminderDate = addDays(holidayDate, -7);
    const daysUntilReminder = differenceInDays(reminderDate, today);
    return daysUntilReminder <= 0 && daysUntilReminder >= -1 && !holiday.reminderSent;
  });

  // Standard month calendar view
  const monthStart = startOfMonth(currentWeek);
  const monthEnd = endOfMonth(currentWeek);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 0 });
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Simple month label
  const monthLabel = format(currentWeek, 'MMMM yyyy');

  // Map holidays to dates for quick lookup
  const holidaysByDate = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    holidays.forEach((holiday) => {
      const dateStr = format(parseISO(holiday.date), 'yyyy-MM-dd')
      if (!map.has(dateStr)) map.set(dateStr, [])
      map.get(dateStr)!.push(holiday)
    })
    return map
  }, [holidays]);

  const getHolidaysForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidaysByDate.get(dateStr) || [];
  };

  const needsReminderDay = (date: Date) => {
    const dayHolidays = getHolidaysForDay(date);
    return dayHolidays.some(h => {
      const reminderDate = addDays(parseISO(h.date), -7);
      return isSameDay(reminderDate, date);
    });
  };

  // Map scheduled campaigns to dates for quick lookup
  const campaignsByDate = useMemo(() => {
    const map = new Map<string, Campaign[]>();
    campaigns.forEach((campaign) => {
      if (campaign.scheduled_date) {
        // Parse date-only string (yyyy-MM-dd) without timezone issues
        // by manually extracting year, month, day
        const [year, month, day] = campaign.scheduled_date.split('-').map(Number);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (!map.has(dateStr)) map.set(dateStr, [])
        map.get(dateStr)!.push(campaign)
      }
    })
    // Debug: Log the campaignsByDate map
    console.log('campaignsByDate:', Array.from(map.entries()));
    return map
  }, [campaigns]);

  const getCampaignsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return campaignsByDate.get(dateStr) || [];
  };

  // Get urgent holidays (within 3 days)
  const urgentHolidays = holidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    const daysUntil = differenceInDays(holidayDate, today);
    return daysUntil >= 0 && daysUntil <= 3;
  }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  return (
    <div className="space-y-3">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <h1 className="text-sm font-semibold text-foreground">
          Hi {profile?.name || 'there'}! — {format(today, 'EEEE, MMMM d')}
        </h1>
        <div className="flex items-center gap-2">
          {needsReminder.length > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
              <Bell className="w-3 h-3" />
              {needsReminder.length}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            <Calendar className="w-3 h-3" />
            {upcomingHolidays.length}
          </span>
        </div>
      </div>

      {/* Urgent Holiday Banner */}
      {urgentHolidays.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-amber-900">
                {urgentHolidays.length === 1 
                  ? `${urgentHolidays[0].name} is coming up!`
                  : `${urgentHolidays.length} holidays coming up soon`}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                {urgentHolidays.slice(0, 2).map(h => {
                  const days = differenceInDays(parseISO(h.date), today);
                  return `${h.name} (${days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`})`;
                }).join(', ')}
                {urgentHolidays.length > 2 && ` +${urgentHolidays.length - 2} more`}
              </p>
            </div>
            <Link
              href={`/holidays`}
              className="flex-shrink-0 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors"
            >
              Create Post →
            </Link>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        
        {/* Left Column (60%) */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Calendar (4 weeks) */}
          <div className="bg-card rounded-lg border border-border p-3">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{monthLabel}</h2>
                {isLoading && (
                  <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentWeek(addMonths(currentWeek, -1))}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setCurrentWeek(new Date())}
                  className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentWeek(addMonths(currentWeek, 1))}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>


            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                <div key={day} className="text-center py-1">
                  <span className={`text-xs font-medium ${
                    idx === 0 || idx === 6 ? 'text-muted-foreground' : 'text-foreground'
                  }`}>{day}</span>
                </div>
              ))}
            </div>

            {/* Days Grid (full month view) */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day) => {
                const dayHolidays = getHolidaysForDay(day);
                const dayCampaigns = getCampaignsForDay(day);
                const hasReminder = needsReminderDay(day);
                const hasHoliday = dayHolidays.length > 0;
                const hasScheduled = dayCampaigns.length > 0;
                const isCurrentDay = isToday(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const isCurrentMonth = isSameMonth(day, currentWeek);
                
                // Check if any holiday on this day needs reminder
                const holidayNeedsReminder = dayHolidays.some(h => {
                  const holidayDate = parseISO(h.date);
                  const reminderDate = addDays(holidayDate, -7);
                  const daysUntilReminder = differenceInDays(reminderDate, today);
                  return daysUntilReminder <= 0 && daysUntilReminder >= -1 && !h.reminderSent;
                });
                
                // Styling: fade days outside current month
                let dayClass = 'hover:bg-muted/50';
                let textClass = isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50';
                
                if (isCurrentDay) {
                  dayClass = 'bg-primary text-white rounded-full';
                  textClass = 'text-white';
                } else if (!isCurrentMonth) {
                  dayClass = 'opacity-40';
                } else if (holidayNeedsReminder) {
                  // Holiday with active reminder gets subtle ring
                  dayClass += ' ring-2 ring-destructive/50 rounded-full';
                }
                
                if (isSelected) {
                  dayClass += ' ring-2 ring-primary ring-offset-1 rounded-full';
                }
                
                return (
                  <div
                    key={day.toISOString()}
                    className="relative"
                  >
                    {/* Reminder badge for holidays needing attention */}
                    {holidayNeedsReminder && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full border border-card" />
                    )}
                    <button
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`w-full aspect-square flex flex-col items-center justify-center p-1 transition-colors ${dayClass}`}
                    >
                      <span className={`text-sm font-medium ${textClass}`}>
                        {format(day, 'd')}
                      </span>
                      {/* Indicators - larger and more visible */}
                      <div className="flex items-center gap-1 mt-0.5">
                        {hasScheduled && (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent border border-white/20" title={`${dayCampaigns.length} scheduled post(s)`} />
                        )}
                        {hasHoliday && (
                          <div className={`w-2.5 h-2.5 rounded-full ${holidayNeedsReminder ? 'bg-destructive' : 'bg-primary'}`} title={holidayNeedsReminder ? 'Holiday with reminder' : 'Holiday'} />
                        )}
                      </div>
                    </button>
                    
                    {isSelected && (
                      <DayPopover
                        day={day}
                        holidays={dayHolidays}
                        campaigns={dayCampaigns}
                        hasReminder={hasReminder}
                        onClose={() => setSelectedDay(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Holidays (Top 3) */}
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Upcoming</h3>
              </div>
              <Link href="/holidays" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {upcomingHolidays.map((holiday, index) => {
                const daysUntil = differenceInDays(parseISO(holiday.date), today);
                const isWithinWeek = daysUntil <= 7;
                
                return (
                  <div key={holiday.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                        isWithinWeek ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{holiday.name}</p>
                        <p className="text-[10px] font-normal text-muted-foreground">{format(parseISO(holiday.date), 'MMM d')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isWithinWeek ? 'text-destructive' : 'text-primary'}`}>{daysUntil}d</span>
                      <Link
                        href={`/create/${holiday.id}`}
                        className="p-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                        title="Create post"
                      >
                        <Plus className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
              {upcomingHolidays.length === 0 && (
                <p className="text-xs font-medium text-muted-foreground text-center py-2">No upcoming holidays</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-2 space-y-3">

          {/* Action Center */}
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-destructive" />
              <h3 className="text-sm font-semibold text-foreground">Action Center</h3>
            </div>
            
            {/* Urgent Reminders */}
            {needsReminder.length > 0 ? (
              <div className="space-y-2 mb-3">
                <p className="text-xs font-semibold text-muted-foreground">Urgent ({needsReminder.length})</p>
                {needsReminder.slice(0, 2).map(holiday => {
                  const daysUntil = differenceInDays(parseISO(holiday.date), today);
                  return (
                    <div key={holiday.id} className="flex items-center justify-between p-2 rounded-md bg-destructive/10 border border-destructive/20">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{holiday.name}</p>
                        <p className="text-[10px] font-normal text-destructive flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Link
                        href={`/create/${holiday.id}`}
                        className="flex items-center gap-1 px-2 py-1 bg-destructive text-white text-xs font-semibold rounded hover:bg-destructive/90 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        Create
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-medium text-muted-foreground mb-3">No urgent reminders</p>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/templates"
                className="flex items-center justify-center gap-1 p-2 bg-primary/10 text-primary text-xs font-medium rounded hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Create
              </Link>
              <Link
                href="/holidays"
                className="flex items-center justify-center gap-1 p-2 bg-muted text-foreground text-xs font-medium rounded hover:bg-muted/80 transition-colors"
              >
                <Calendar className="w-3 h-3" />
                Calendar
              </Link>
              <Link
                href="/history"
                className="flex items-center justify-center gap-1 p-2 bg-muted text-foreground text-xs font-medium rounded hover:bg-muted/80 transition-colors"
              >
                <History className="w-3 h-3" />
                History
              </Link>
              <Link
                href="/templates"
                className="flex items-center justify-center gap-1 p-2 bg-muted text-foreground text-xs font-medium rounded hover:bg-muted/80 transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                Library
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Recent</h3>
              </div>
              <Link href="/history" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <CompactRecentActivity />
          </div>

        </div>
      </div>
    </div>
  );
}
