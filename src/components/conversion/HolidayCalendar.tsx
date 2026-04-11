"use client";
import Link from 'next/link';
import { useBusiness } from '../context/BusinessContext';
import { Calendar, Filter, Search, Sparkles } from 'lucide-react';

import { format, parseISO, differenceInDays } from 'date-fns';
import { useState } from 'react';

export function HolidayCalendar() {
  const { holidays } = useBusiness();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const today = new Date();

  // Filter holidays
  const filteredHolidays = holidays
    .filter(holiday => {
      const matchesType = selectedType === 'all' || holiday.type === selectedType;
      const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (holiday.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  // Group by year and month
  const groupedHolidays = filteredHolidays.reduce((acc, holiday) => {
    const date = parseISO(holiday.date);
    const key = format(date, 'yyyy-MM');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(holiday);
    return acc;
  }, {} as Record<string, typeof holidays>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Holiday Calendar</h2>
        <p className="text-gray-600">Browse all holidays and plan your marketing campaigns</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="international">International</option>
              <option value="local">Local</option>
              <option value="cultural">Cultural</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredHolidays.length} holiday{filteredHolidays.length !== 1 ? 's' : ''}
      </div>

      {/* Calendar View */}
      <div className="space-y-6">
        {Object.entries(groupedHolidays).map(([monthKey, monthHolidays]) => {
          const monthDate = parseISO(monthKey + '-01');
          
          return (
            <div key={monthKey} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h3 className="text-xl font-bold text-white">
                  {format(monthDate, 'MMMM yyyy')}
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {monthHolidays.map(holiday => {
                  const daysUntil = differenceInDays(parseISO(holiday.date), today);
                  const isPast = daysUntil < 0;
                  const isWithinWeek = daysUntil >= 0 && daysUntil <= 7;
                  
                  return (
                    <div key={holiday.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                            isPast ? 'bg-gray-100' :
                            isWithinWeek ? 'bg-orange-100' : 
                            'bg-blue-100'
                          }`}>
                            <div className={`text-xs font-semibold ${
                              isPast ? 'text-gray-500' :
                              isWithinWeek ? 'text-orange-600' : 
                              'text-blue-600'
                            }`}>
                              {format(parseISO(holiday.date), 'MMM')}
                            </div>
                            <div className={`text-2xl font-bold ${
                              isPast ? 'text-gray-600' :
                              isWithinWeek ? 'text-orange-700' : 
                              'text-blue-700'
                            }`}>
                              {format(parseISO(holiday.date), 'dd')}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{holiday.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                holiday.type === 'international' ? 'bg-blue-100 text-blue-700' :
                                holiday.type === 'local' ? 'bg-green-100 text-green-700' :
                                holiday.type === 'cultural' ? 'bg-purple-100 text-purple-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {holiday.type}
                              </span>
                              {holiday.reminderSent && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                  ✓ Post Created
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-2">{holiday.description || ''}</p>
                            
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-500">Category: {holiday.category}</span>
                              {!isPast && (
                                <span className={`font-semibold ${
                                  isWithinWeek ? 'text-orange-600' : 'text-blue-600'
                                }`}>
                                  {daysUntil === 0 ? '• Today!' : 
                                   daysUntil === 1 ? '• Tomorrow' : 
                                   `• ${daysUntil} days away`}
                                </span>
                              )}
                              {isPast && (
                                <span className="text-gray-400">• Past</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!isPast && (
                          <Link
                            href={`/create/${holiday.id}`}
                            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                              isWithinWeek 
                                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            Create Post
                          </Link>
                        )}
                        
                        {isPast && holiday.reminderSent && (
                          <button className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
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
        <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No holidays found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
