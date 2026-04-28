"use client";
import Link from 'next/link';
import { useBusiness, Holiday } from '@/context/BusinessContext';
import { Calendar, Filter, Search, Sparkles } from 'lucide-react';

import { format, parseISO, differenceInDays } from 'date-fns';
import { useState } from 'react';

export function HolidayCalendar() {
  const { holidays } = useBusiness();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date();

  // Filter holidays
  const filteredHolidays = holidays
    .filter((holiday: Holiday) => {
      const matchesType = selectedType === 'all' || holiday.type === selectedType;
      const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (holiday.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Add status filter
      const daysUntil = differenceInDays(parseISO(holiday.date), today);
      const isPast = daysUntil < 0;
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'upcoming' && !isPast) ||
                           (selectedStatus === 'past' && isPast);
      
      return matchesType && matchesSearch && matchesStatus;
    })
    .sort((a: Holiday, b: Holiday) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  // Group by year and month
  const groupedHolidays = filteredHolidays.reduce((acc: Record<string, Holiday[]>, holiday: Holiday) => {
    const date = parseISO(holiday.date);
    const key = format(date, 'yyyy-MM');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(holiday);
    return acc;
  }, {} as Record<string, typeof holidays>);

  return (
    <div className="space-y-8">
      {/* Header - Flat solid color design */}
      <div className="bg-primary rounded-3xl shadow-xl p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Holiday Calendar</h2>
        <p className="text-lg font-medium text-white/90">Browse all holidays and plan your festive marketing campaigns</p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-card shadow-lg border border-border p-6 md:p-8 transition-all hover:shadow-xl">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground transition-all hover:bg-background/80"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-foreground transition-all hover:bg-background/80"
            >
              <option value="all">All Types</option>
              <option value="international">International</option>
              <option value="local">Local</option>
              <option value="cultural">Cultural</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none text-foreground transition-all hover:bg-background/80"
            >
              <option value="all">All Holidays</option>
              <option value="upcoming">Upcoming Only</option>
              <option value="past">Past Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm font-semibold text-muted-foreground">
        Showing {filteredHolidays.length} holiday{filteredHolidays.length !== 1 ? 's' : ''}
      </div>

      {/* Calendar View */}
      <div className="space-y-6">
        {Object.entries(groupedHolidays).map(([monthKey, monthHolidays]) => {
          const monthDate = parseISO(monthKey + '-01');
          
          return (
            <div key={monthKey} className="rounded-3xl bg-card shadow-lg border border-border overflow-hidden transition-all hover:shadow-xl">
              <div className="bg-muted p-6 border-b border-border">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {format(monthDate, 'MMMM yyyy')}
                </h3>
              </div>
              
              <div className="divide-y divide-white/10">
                {monthHolidays.map(holiday => {
                  const daysUntil = differenceInDays(parseISO(holiday.date), today);
                  const isPast = daysUntil < 0;
                  const isWithinWeek = daysUntil >= 0 && daysUntil <= 7;
                  
                  return (
                    <div key={holiday.id} className="p-6 md:p-8 hover:bg-white/5 transition-all duration-300 group">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center shadow-md border-2 transition-all ${
                            isPast ? 'bg-muted border-muted-foreground/20' :
                            isWithinWeek ? 'bg-destructive/10 border-destructive scale-110' : 
                            'bg-primary/10 border-primary group-hover:scale-105'
                          }`}>
                            <div className={`text-xs font-bold uppercase tracking-wider ${
                              isPast ? 'text-muted-foreground/60' :
                              isWithinWeek ? 'text-destructive' : 
                              'text-primary'
                            }`}>
                              {format(parseISO(holiday.date), 'MMM')}
                            </div>
                            <div className={`text-2xl md:text-3xl font-extrabold ${
                              isPast ? 'text-muted-foreground/60' :
                              isWithinWeek ? 'text-destructive' : 
                              'text-primary'
                            }`}>
                              {format(parseISO(holiday.date), 'dd')}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h4 className="font-bold text-foreground text-lg md:text-xl tracking-tight">{holiday.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur border ${
                                holiday.type === 'international' ? 'bg-primary/20 text-primary border-primary/40' :
                                holiday.type === 'local' ? 'bg-accent/20 text-accent border-accent/40' :
                                holiday.type === 'cultural' ? 'bg-secondary/20 text-secondary border-secondary/40' :
                                'bg-primary/20 text-primary border-primary/40'
                              }`}>
                                {holiday.type}
                              </span>
                              {holiday.reminderSent && (
                                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold border border-accent/40 backdrop-blur">
                                  ✓ Post Created
                                </span>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground mb-3 leading-relaxed">{holiday.description || ''}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium">
                              <span className="text-muted-foreground">📁 {holiday.category}</span>
                              {!isPast && (
                                <span className={`font-bold ${
                                  isWithinWeek ? 'text-destructive' : 'text-primary'
                                }`}>
                                  {daysUntil === 0 ? '🎉 Today!' : 
                                   daysUntil === 1 ? '⏰ Tomorrow' : 
                                   `📅 ${daysUntil} days away`}
                                </span>
                              )}
                              {isPast && (
                                <span className="text-muted-foreground/60">✓ Past</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!isPast && (
                          <Link
                            href={`/create/${holiday.id}`}
                            className={`flex-shrink-0 px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 border ${
                              isWithinWeek 
                                ? 'bg-destructive text-white border-destructive hover:bg-destructive-dark' 
                                : 'bg-primary text-white border-primary hover:bg-primary-dark'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            Create Post
                          </Link>
                        )}
                        
                        {isPast && holiday.reminderSent && (
                          <button className="flex-shrink-0 px-6 py-3 border-2 border-accent/50 text-accent rounded-xl hover:bg-accent/10 transition-all hover:scale-105">
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredHolidays.length === 0 && (
        <div className="rounded-3xl bg-card shadow-lg border border-border p-12 md:p-16 text-center">
          <div className="w-20 h-20 bg-muted/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/10">
            <Calendar className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-bold text-foreground mb-2 text-xl">No holidays found</h3>
          <p className="text-muted-foreground font-medium">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
