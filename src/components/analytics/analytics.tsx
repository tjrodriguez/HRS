"use client";
import { useBusiness } from '@/context/BusinessContext';
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
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5">
        <h2 className="text-2xl font-bold text-foreground mb-2">Performance Analytics</h2>
        <p className="text-muted-foreground">Track your holiday marketing campaign results</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-foreground mb-1">{totalLikes.toLocaleString()}</h3>
          <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-foreground mb-1">{totalComments.toLocaleString()}</h3>
          <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-foreground mb-1">{totalShares.toLocaleString()}</h3>
          <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-foreground mb-1">{totalReach.toLocaleString()}</h3>
          <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-foreground mb-1">{avgEngagementRate}%</h3>
          <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
        </div>
      </div>

      {/* Best Performing Post */}
      {bestPost && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-primary/20">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-foreground mb-2">Best Performing Campaign</h3>
              <p className="text-muted-foreground mb-6">
                Your <span className="font-semibold text-primary">{bestPost.holidayName}</span> post achieved outstanding results!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Reach</p>
                  <p className="text-2xl font-bold text-foreground">{bestPost.reach.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Likes</p>
                  <p className="text-2xl font-bold text-foreground">{bestPost.likes.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Comments</p>
                  <p className="text-2xl font-bold text-foreground">{bestPost.comments.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Shares</p>
                  <p className="text-2xl font-bold text-foreground">{bestPost.shares.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement by Holiday */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Engagement by Holiday</h3>
              <p className="text-sm text-muted-foreground">Likes, comments, and shares per campaign</p>
            </div>
          </div>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: 'var(--muted-foreground)'}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{fill: 'var(--muted-foreground)'}}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'var(--accent)', opacity: 0.1}}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="likes" name="Likes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" name="Comments" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shares" name="Shares" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach Trend */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Reach Trend</h3>
              <p className="text-sm text-muted-foreground">Total reach over time</p>
            </div>
          </div>
          <div className="h-80 w-full relative min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: 'var(--muted-foreground)'}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{fill: 'var(--muted-foreground)'}}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Reach"
                  dot={{ fill: 'hsl(var(--primary))', r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform Distribution and Campaign Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Platform Distribution</h3>
              <p className="text-sm text-muted-foreground">Engagement across networks</p>
            </div>
          </div>
          <div className="relative h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  stroke="none"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {platformData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Campaign Details</h3>
              <p className="text-sm text-muted-foreground">Individual post performance breakdown</p>
            </div>
          </div>
          <div className="space-y-4 max-h-[300px] pr-2 overflow-y-auto custom-scrollbar">
            {engagementData.map((record, idx) => {
              const totalEngagement = record.likes + record.comments + record.shares;
              const engagementRate = ((totalEngagement / record.reach) * 100).toFixed(2);
              
              return (
                <div key={idx} className="bg-background/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:bg-background/80 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">{record.holidayName}</h4>
                    </div>
                    <span className="px-2.5 py-1 bg-secondary/20 text-secondary rounded-md text-xs font-bold tracking-wide uppercase">
                      {record.platform}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="bg-card/80 backdrop-blur-md rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Likes</p>
                      <p className="font-bold text-foreground text-sm">{record.likes}</p>
                    </div>
                    <div className="bg-card/80 backdrop-blur-md rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Comments</p>
                      <p className="font-bold text-foreground text-sm">{record.comments}</p>
                    </div>
                    <div className="bg-card/80 backdrop-blur-md rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Shares</p>
                      <p className="font-bold text-foreground text-sm">{record.shares}</p>
                    </div>
                    <div className="bg-card/80 backdrop-blur-md rounded-lg p-2 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reach</p>
                      <p className="font-bold text-foreground text-sm">{record.reach}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Engagement Rate</span>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">{engagementRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
