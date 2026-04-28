'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { History, ArrowRight, Loader2, Calendar, Type, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { 
  fetchActivityLogs, 
  ActivityLog,
  getActivityTypeDisplay,
  getActivityIcon,
  getPlatformDisplay 
} from '@/lib/activity';

export function RecentActivity() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const result = await fetchActivityLogs({
        limit: 5,
        offset: 0,
      });
      setLogs(result.logs);
    } catch (error) {
      console.error('Error loading recent activity:', error);
      // Don't show error toast - this is a dashboard widget
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent caption generations and simulated posts will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">
              Generate captions or simulate posts to see your activity
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest caption generations and simulated posts
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/history')}
            className="flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => router.push('/history')}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {getActivityIcon(log.activity_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm text-foreground">
                    {getActivityTypeDisplay(log.activity_type)}
                  </h4>
                  {log.platform && (
                    <Badge variant="outline" className="text-xs">
                      {getPlatformDisplay(log.platform)}
                    </Badge>
                  )}
                </div>
                
                {log.holiday_name && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {log.holiday_name}
                  </p>
                )}
                
                {log.content_preview && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 flex items-center gap-1">
                    <Type className="w-3 h-3" />
                    {log.content_preview}
                  </p>
                )}
                
                {log.hashtags && log.hashtags.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {log.hashtags.slice(0, 2).join(' ')}
                    {log.hashtags.length > 2 && ` +${log.hashtags.length - 2}`}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(log.created_at), 'MMM dd, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => router.push('/history')}
        >
          View Full History
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
