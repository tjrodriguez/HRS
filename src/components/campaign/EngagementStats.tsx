'use client';

import { Users, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EngagementPrediction } from '@/lib/types/campaign';

interface EngagementStatsProps {
  prediction: EngagementPrediction | null;
  platform: 'instagram' | 'facebook';
}

export function EngagementStats({ prediction, platform }: EngagementStatsProps) {
  if (!prediction) {
    return (
      <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Engagement Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Generate content to see engagement predictions
          </p>
        </CardContent>
      </Card>
    );
  }

  const { reach, likes, comments, engagementRate } = prediction;

  return (
    <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          Engagement Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Users className="w-3 h-3" />
              <span>Reach</span>
            </div>
            <p className="text-lg font-semibold">
              {reach.min.toLocaleString()} - {reach.max.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Heart className="w-3 h-3" />
              <span>Likes</span>
            </div>
            <p className="text-lg font-semibold">
              {likes.min.toLocaleString()} - {likes.max.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <MessageCircle className="w-3 h-3" />
              <span>Comments</span>
            </div>
            <p className="text-lg font-semibold">
              {comments.min.toLocaleString()} - {comments.max.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Engagement Rate</span>
            </div>
            <p className="text-lg font-semibold">{engagementRate}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground capitalize">
            Based on {platform} performance averages
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
