"use client";

import * as React from 'react';
import { useBusiness } from "@/context/BusinessContext";
import { extractContentInsights, computePlatformPerformance } from "@/lib/analytics";
import { Lightbulb, BarChart3, Hash, Type } from "lucide-react";

export function ContentPatternAnalyzer(): React.ReactElement {
  const { campaignAnalytics } = useBusiness();
  const insights = extractContentInsights(campaignAnalytics);
  const platformData = computePlatformPerformance(campaignAnalytics);

  if (insights.length === 0 && platformData.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 dark:border-white/5 text-center">
        <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">No Content Insights Yet</h3>
        <p className="text-sm text-muted-foreground">
          Publish more campaigns to discover what content patterns work best.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {platformData.length > 0 && (
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Platform Performance</h3>
              <p className="text-sm text-muted-foreground">Which platforms drive results</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformData.map((p) => (
              <div key={p.platform} className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-foreground">{p.platform}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-primary/20 text-primary rounded-md uppercase">{p.campaignCount} campaigns</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-semibold text-foreground">{p.totalEngagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reach</span>
                    <span className="font-semibold text-foreground">{p.totalReach.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Eng. Rate</span>
                      <span className="text-lg font-bold text-primary">{p.avgEngagementRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Content Insights</h3>
              <p className="text-sm text-muted-foreground">What works for your audience</p>
            </div>
          </div>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {insight.type === "Hashtags" ? <Hash className="w-5 h-5 text-primary" /> : <Type className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{insight.type}</span>
                      <span className="text-sm font-semibold text-foreground">{insight.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.recommendation}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        Based on <strong className="text-foreground">{insight.occurrenceCount}</strong> campaigns
                      </span>
                      <span className="text-xs font-bold text-primary">{insight.avgEngagementRate}% avg. engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}