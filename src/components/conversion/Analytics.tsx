"use client";
import { useBusiness } from '../context/BusinessContext';
import { TrendingUp, Heart, MessageCircle, Share2, Eye, Trophy, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Analytics() {
  const { engagementData } = useBusiness();

  // Calculate total metrics
  const totalLikes = engagementData.reduce((sum, record) => sum + record.likes, 0);
  const totalComments = engagementData.reduce((sum, record) => sum + record.comments, 0);
  const totalShares = engagementData.reduce((sum, record) => sum + record.shares, 0);
  const totalReach = engagementData.reduce((sum, record) => sum + record.reach, 0);
  const avgEngagementRate = engagementData.length > 0 
    ? ((totalLikes + totalComments + totalShares) / totalReach * 100).toFixed(2)
    : '0';

  // Prepare chart data
  const chartData = engagementData.map((record, index) => ({
    id: `${record.holidayId}-${index}`,
    name: record.holidayName.split(' ').slice(0, 2).join(' '),
    likes: record.likes,
    comments: record.comments,
    shares: record.shares,
    reach: record.reach,
  }));

  // Platform distribution
  const platformData = engagementData.reduce((acc, record, index) => {
    const existing = acc.find(item => item.name === record.platform);
    if (existing) {
      existing.value += record.likes + record.comments + record.shares;
    } else {
      acc.push({ 
        id: `platform-${record.platform}-${index}`,
        name: record.platform, 
        value: record.likes + record.comments + record.shares 
      });
    }
    return acc;
  }, [] as { id: string; name: string; value: number }[]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  // Find best performing post
  const bestPost = engagementData.reduce((best, current) => {
    const currentTotal = current.likes + current.comments + current.shares;
    const bestTotal = best.likes + best.comments + best.shares;
    return currentTotal > bestTotal ? current : best;
  }, engagementData[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
        <p className="text-gray-600">Track your holiday marketing campaign results</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalLikes.toLocaleString()}</h3>
          <p className="text-gray-600">Total Likes</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalComments.toLocaleString()}</h3>
          <p className="text-gray-600">Total Comments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalShares.toLocaleString()}</h3>
          <p className="text-gray-600">Total Shares</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalReach.toLocaleString()}</h3>
          <p className="text-gray-600">Total Reach</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{avgEngagementRate}%</h3>
          <p className="text-gray-600">Avg Engagement</p>
        </div>
      </div>

      {/* Best Performing Post */}
      {bestPost && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Best Performing Campaign</h3>
              <p className="text-gray-700 mb-3">
                Your <span className="font-semibold">{bestPost.holidayName}</span> post achieved outstanding results!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="text-xl font-bold text-gray-900">{bestPost.reach.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-xl font-bold text-gray-900">{bestPost.likes.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-xl font-bold text-gray-900">{bestPost.comments.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Shares</p>
                  <p className="text-xl font-bold text-gray-900">{bestPost.shares.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement by Holiday */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Engagement by Holiday</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="likes" fill="#3b82f6" name="Likes" />
              <Bar dataKey="comments" fill="#8b5cf6" name="Comments" />
              <Bar dataKey="shares" fill="#10b981" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reach Trend */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Reach Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Reach"
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Distribution and Campaign Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Details */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Campaign Details</h3>
          <div className="space-y-4">
            {engagementData.map((record, idx) => {
              const totalEngagement = record.likes + record.comments + record.shares;
              const engagementRate = ((totalEngagement / record.reach) * 100).toFixed(2);
              
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-900">{record.holidayName}</h4>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {record.platform}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Likes</p>
                      <p className="font-semibold text-gray-900">{record.likes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Comments</p>
                      <p className="font-semibold text-gray-900">{record.comments}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shares</p>
                      <p className="font-semibold text-gray-900">{record.shares}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reach</p>
                      <p className="font-semibold text-gray-900">{record.reach}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Engagement Rate</span>
                      <span className="text-sm font-semibold text-green-600">{engagementRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              📈 <span className="font-semibold">Growth Trend:</span> Your holiday posts reach 45% more people than regular posts
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              ⏰ <span className="font-semibold">Best Time:</span> Posts published at 9-11 AM get 2x more engagement
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💬 <span className="font-semibold">Engagement:</span> Holiday posts receive 3x more comments on average
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700">
              🎯 <span className="font-semibold">Recommendation:</span> Focus on visual content for better performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}