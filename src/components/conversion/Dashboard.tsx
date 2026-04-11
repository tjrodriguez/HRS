"use client";
import Link from 'next/link';
import { useBusiness } from '../context/BusinessContext';
import { Calendar, Bell, TrendingUp, Sparkles, Clock, ArrowRight } from 'lucide-react';

import { format, parseISO, differenceInDays, isBefore, addDays } from 'date-fns';

export function Dashboard() {
  const { profile, holidays, engagementData } = useBusiness();

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}! 👋</h2>
            <p className="text-blue-100 text-lg">
              Let's make the most of upcoming holidays and boost your marketing
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-sm text-blue-100">Today</p>
            <p className="font-semibold">{format(today, 'MMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Next 60 days</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{upcomingHolidays.length}</h3>
          <p className="text-gray-600">Upcoming Holidays</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            {needsReminder.length > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold">
                Action Needed
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{needsReminder.length}</h3>
          <p className="text-gray-600">Pending Reminders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Last 3 posts</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalEngagement.toLocaleString()}</h3>
          <p className="text-gray-600">Total Engagement</p>
        </div>
      </div>

      {/* Action Required Alert */}
      {needsReminder.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-2">Action Required: Upcoming Holidays</h3>
              <p className="text-orange-700 mb-3">
                {needsReminder.length} holiday{needsReminder.length > 1 ? 's are' : ' is'} coming up within a week. 
                Create your marketing posts now!
              </p>
              <div className="space-y-2">
                {needsReminder.map(holiday => (
                  <div key={holiday.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="font-semibold text-gray-900">{holiday.name}</p>
                      <p className="text-sm text-gray-600">{format(parseISO(holiday.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <Link
                      href={`/create/${holiday.id}`}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Create Post
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Holidays */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Holidays</h3>
            <Link href="/calendar" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {upcomingHolidays.map(holiday => {
            const daysUntil = differenceInDays(parseISO(holiday.date), today);
            const isWithinWeek = daysUntil <= 7;
            
            return (
              <div key={holiday.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isWithinWeek ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Calendar className={`w-6 h-6 ${
                        isWithinWeek ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{holiday.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          holiday.type === 'international' ? 'bg-blue-100 text-blue-700' :
                          holiday.type === 'local' ? 'bg-green-100 text-green-700' :
                          holiday.type === 'cultural' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {holiday.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{holiday.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(parseISO(holiday.date), 'MMM dd, yyyy')}
                        </span>
                        <span className={`font-semibold ${isWithinWeek ? 'text-orange-600' : 'text-blue-600'}`}>
                          {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days away`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/create/${holiday.id}`}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isWithinWeek 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Post
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Pro Tips for Holiday Marketing
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              ✨ <span className="font-semibold">Plan ahead:</span> Create posts at least 1 week before each holiday for better engagement
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              🎯 <span className="font-semibold">Use hashtags:</span> Include 5-10 relevant hashtags to increase reach
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              📸 <span className="font-semibold">Visual content:</span> Posts with images get 2.3x more engagement
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              ⏰ <span className="font-semibold">Best times:</span> Post between 9-11 AM or 7-9 PM for maximum visibility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
