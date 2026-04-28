"use client";

import { useBusiness } from "@/context/BusinessContext";
import { computeHolidayPerformance } from "@/lib/analytics";
import { Trophy, TrendingUp, Calendar, Heart, MessageCircle, Share2, Eye } from "lucide-react";

export function HolidayPerformanceScorecard() {
  const { campaignAnalytics } = useBusiness();
  const performanceData = computeHolidayPerformance(campaignAnalytics);

  if (performanceData.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 dark:border-white/5 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">No Holiday Data Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create and publish campaigns to see which holidays drive the best results for your business.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {performanceData.length > 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-foreground">Top Performing Holiday</h3>
                <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-md text-xs font-bold tracking-wide uppercase">#1</span>
              </div>
              <p className="text-muted-foreground mb-4">
                <span className="font-semibold text-primary text-lg">{performanceData[0].holidayName}</span>
                {" scored "}
                <span className="font-bold text-primary">{performanceData[0].score}</span>/100
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Eng. Rate</p>
                  <p className="text-xl font-bold text-foreground">{performanceData[0].avgEngagementRate}%</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Reach</p>
                  <p className="text-xl font-bold text-foreground">{performanceData[0].totalReach.toLocaleString()}</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Campaigns</p>
                  <p className="text-xl font-bold text-foreground">{performanceData[0].totalCampaigns}</p>
                </div>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Shares</p>
                  <p className="text-xl font-bold text-foreground">{performanceData[0].totalShares.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Holiday Rankings</h3>
            <p className="text-sm text-muted-foreground">Ranked by overall performance score</p>
          </div>
        </div>

        <div className="space-y-3">
          {performanceData.map((holiday, index) => (
            <div
              key={holiday.holidayId}
              className="flex items-center gap-4 p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-white/5 hover:bg-background/80 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                index === 0 ? "bg-yellow-500/20 text-yellow-500" : index === 1 ? "bg-gray-400/20 text-gray-400" : index === 2 ? "bg-amber-600/20 text-amber-600" : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground text-sm truncate">{holiday.holidayName}</h4>
                  <span className="text-xs text-muted-foreground">{new Date(holiday.holidayDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {holiday.totalLikes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {holiday.totalComments}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {holiday.totalShares}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {holiday.totalReach.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-primary">{holiday.score}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}