 'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  History, 
  Filter, 
  Search, 
  Trash2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Type,
  Hash,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { 
  fetchActivityLogs, 
  fetchActivityStats,
  deleteActivityLog,
  clearAllActivityLogs,
  ActivityLog,
  ActivityStats,
  getActivityTypeDisplay,
  getActivityIcon,
  getPlatformDisplay 
} from '@/lib/activity';

const ACTIVITY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'caption_generated', label: 'Caption Generated' },
  { value: 'caption_regenerated', label: 'Caption Regenerated' },
  { value: 'post_simulated', label: 'Post Simulated' },
  { value: 'campaign_scheduled', label: 'Campaign Scheduled' },
  { value: 'template_saved', label: 'Template Saved' },
  { value: 'account_connected', label: 'Account Connected' },
  { value: 'account_disconnected', label: 'Account Disconnected' },
];

const PLATFORMS = [
  { value: '', label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'both', label: 'Both' },
];

export default function HistoryPage(): React.ReactElement {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Filter states
  const [activityType, setActivityType] = useState('');
  const [platform, setPlatform] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await fetchActivityLogs({
        activity_type: activityType || undefined,
        platform: platform || undefined,
        search: search || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit,
        offset,
      });
      setLogs(result.logs);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      toast.error('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const result = await fetchActivityStats(30);
      setStats(result);
    } catch (error) {
      console.error('Error loading activity stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [offset, activityType, platform, search, dateFrom, dateTo]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    loadLogs();
  };

  const handleClearFilters = () => {
    setActivityType('');
    setPlatform('');
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setOffset(0);
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    
    try {
      await deleteActivityLog(logId);
      toast.success('Log entry deleted');
      loadLogs();
      loadStats();
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Failed to delete log entry');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL activity history? This cannot be undone.')) return;
    
    try {
      await clearAllActivityLogs();
      toast.success('All activity history cleared');
      loadLogs();
      loadStats();
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Failed to clear activity history');
    }
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="min-h-screen py-6 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl p-6 shadow-md border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Activity History</h1>
            <p className="text-muted-foreground">
              Track all your caption generations, simulated posts, and campaign activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-3xl">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.summary.total_logs || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Captions Generated</CardDescription>
            <CardTitle className="text-3xl text-primary">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.summary.captions_generated || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">AI-powered content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Posts Simulated</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.summary.posts_simulated || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Social media simulations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Campaigns Scheduled</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.summary.campaigns_scheduled || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Upcoming posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search captions, holidays..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  {ACTIVITY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  {PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                />
              </div>
            </div>

            <Button variant="outline" onClick={handleClearFilters} className="w-full">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Activity List */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity Log
            </CardTitle>
            <Badge variant="secondary">
              {total} total entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start generating captions and simulating posts to see your activity history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {getActivityIcon(log.activity_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">
                        {getActivityTypeDisplay(log.activity_type)}
                      </h3>
                      {log.platform && (
                        <Badge variant="outline" className="text-xs">
                          {getPlatformDisplay(log.platform)}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(log.created_at), 'MMM dd, yyyy • h:mm a')}
                      </span>
                    </div>
                    
                    {log.holiday_name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {log.holiday_name}
                      </p>
                    )}
                    
                    {log.content_preview && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        <Type className="w-3 h-3 inline mr-1" />
                        {log.content_preview}
                      </p>
                    )}
                    
                    {log.hashtags && log.hashtags.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <Hash className="w-3 h-3 inline mr-1" />
                        {log.hashtags.slice(0, 3).join(' ')}
                        {log.hashtags.length > 3 && ` +${log.hashtags.length - 3} more`}
                      </p>
                    )}
                    
                    {log.status === 'error' && log.error_message && (
                      <p className="text-sm text-red-500 mt-1">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        {log.error_message}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLog(log.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
