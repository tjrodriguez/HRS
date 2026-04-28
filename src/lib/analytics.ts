/**
 * Analytics helper functions for the Campaign Intelligence Hub
 */

import { CampaignAnalytics, Campaign, Holiday } from "@/utils/data";
import { differenceInDays, parseISO } from "date-fns";

export interface HolidayPerformance {
  holidayId: string;
  holidayName: string;
  holidayDate: string;
  totalCampaigns: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalReach: number;
  avgEngagementRate: number;
  score: number; // Weighted performance score
}

export interface PlatformPerformance {
  platform: string;
  totalEngagement: number;
  totalReach: number;
  avgEngagementRate: number;
  campaignCount: number;
}

export interface ContentInsight {
  type: string;
  value: string;
  avgEngagementRate: number;
  occurrenceCount: number;
  recommendation: string;
}

export interface UpcomingOpportunity {
  holiday: Holiday;
  daysUntil: number;
  hasCampaign: boolean;
  predictedScore: number;
  urgency: "critical" | "high" | "medium" | "low";
  recommendation: string;
}

/**
 * Compute holiday performance rankings
 */
export function computeHolidayPerformance(
  campaignAnalytics: CampaignAnalytics[]
): HolidayPerformance[] {
  const holidayMap = new Map<string, HolidayPerformance>();

  campaignAnalytics.forEach((ca) => {
    const holidayId = ca.campaign.holiday_id;
    const holidayName = ca.campaign.holiday?.name || "Unknown Holiday";
    const holidayDate = ca.campaign.holiday?.date || "";

    const existing = holidayMap.get(holidayId);
    if (existing) {
      existing.totalCampaigns += 1;
      existing.totalLikes += ca.totals.likes;
      existing.totalComments += ca.totals.comments;
      existing.totalShares += ca.totals.shares;
      existing.totalReach += ca.totals.reach;
      existing.avgEngagementRate =
        (existing.avgEngagementRate * (existing.totalCampaigns - 1) +
          ca.totals.engagementRate) /
        existing.totalCampaigns;
    } else {
      holidayMap.set(holidayId, {
        holidayId,
        holidayName,
        holidayDate,
        totalCampaigns: 1,
        totalLikes: ca.totals.likes,
        totalComments: ca.totals.comments,
        totalShares: ca.totals.shares,
        totalReach: ca.totals.reach,
        avgEngagementRate: ca.totals.engagementRate,
        score: 0,
      });
    }
  });

  const results = Array.from(holidayMap.values());

  // Calculate weighted score (engagement rate * 50% + reach * 30% + shares * 20%)
  results.forEach((h) => {
    const reachScore = Math.min(h.totalReach / 10000, 10) * 10; // Cap at 10k reach
    const engagementScore = h.avgEngagementRate * 10;
    const shareScore = Math.min(h.totalShares / 100, 10) * 10; // Cap at 100 shares
    h.score = Number(
      (engagementScore * 0.5 + reachScore * 0.3 + shareScore * 0.2).toFixed(1)
    );
  });

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Compute platform performance breakdown
 */
export function computePlatformPerformance(
  campaignAnalytics: CampaignAnalytics[]
): PlatformPerformance[] {
  const platformMap = new Map<string, PlatformPerformance>();

  campaignAnalytics.forEach((ca) => {
    ca.campaign.platforms.forEach((platform) => {
      const existing = platformMap.get(platform);
      const engagement = ca.totals.likes + ca.totals.comments + ca.totals.shares;

      if (existing) {
        existing.totalEngagement += engagement;
        existing.totalReach += ca.totals.reach;
        existing.campaignCount += 1;
        existing.avgEngagementRate =
          (existing.avgEngagementRate * (existing.campaignCount - 1) +
            ca.totals.engagementRate) /
          existing.campaignCount;
      } else {
        platformMap.set(platform, {
          platform,
          totalEngagement: engagement,
          totalReach: ca.totals.reach,
          avgEngagementRate: ca.totals.engagementRate,
          campaignCount: 1,
        });
      }
    });
  });

  return Array.from(platformMap.values()).sort(
    (a, b) => b.avgEngagementRate - a.avgEngagementRate
  );
}

/**
 * Extract content insights from campaign analytics
 * Analyzes caption characteristics that correlate with performance
 */
export function extractContentInsights(
  campaignAnalytics: CampaignAnalytics[]
): ContentInsight[] {
  const insights: ContentInsight[] = [];

  // Analyze caption length impact
  const shortCaps = campaignAnalytics.filter(
    (ca) => ca.campaign.content.length < 100
  );
  const medCaps = campaignAnalytics.filter(
    (ca) =>
      ca.campaign.content.length >= 100 && ca.campaign.content.length < 200
  );
  const longCaps = campaignAnalytics.filter(
    (ca) => ca.campaign.content.length >= 200
  );

  if (shortCaps.length > 0) {
    const avgRate =
      shortCaps.reduce((sum, ca) => sum + ca.totals.engagementRate, 0) /
      shortCaps.length;
    insights.push({
      type: "Caption Length",
      value: "Short (<100 chars)",
      avgEngagementRate: Number(avgRate.toFixed(2)),
      occurrenceCount: shortCaps.length,
      recommendation:
        avgRate > 5
          ? "Short captions perform well for you — keep them punchy!"
          : "Try longer captions with more storytelling",
    });
  }

  if (medCaps.length > 0) {
    const avgRate =
      medCaps.reduce((sum, ca) => sum + ca.totals.engagementRate, 0) /
      medCaps.length;
    insights.push({
      type: "Caption Length",
      value: "Medium (100-200 chars)",
      avgEngagementRate: Number(avgRate.toFixed(2)),
      occurrenceCount: medCaps.length,
      recommendation:
        avgRate > 5
          ? "Medium-length captions are your sweet spot"
          : "Experiment with different lengths",
    });
  }

  if (longCaps.length > 0) {
    const avgRate =
      longCaps.reduce((sum, ca) => sum + ca.totals.engagementRate, 0) /
      longCaps.length;
    insights.push({
      type: "Caption Length",
      value: "Long (200+ chars)",
      avgEngagementRate: Number(avgRate.toFixed(2)),
      occurrenceCount: longCaps.length,
      recommendation:
        avgRate > 5
          ? "Long-form storytelling resonates with your audience"
          : "Consider shorter, more direct captions",
    });
  }

  // Analyze hashtag usage
  const withHashtags = campaignAnalytics.filter((ca) =>
    ca.campaign.content.includes("#")
  );
  const withoutHashtags = campaignAnalytics.filter(
    (ca) => !ca.campaign.content.includes("#")
  );

  if (withHashtags.length > 0 && withoutHashtags.length > 0) {
    const withRate =
      withHashtags.reduce((sum, ca) => sum + ca.totals.engagementRate, 0) /
      withHashtags.length;
    const withoutRate =
      withoutHashtags.reduce((sum, ca) => sum + ca.totals.engagementRate, 0) /
      withoutHashtags.length;

    insights.push({
      type: "Hashtags",
      value: withRate > withoutRate ? "With hashtags" : "Without hashtags",
      avgEngagementRate: Number(
        (withRate > withoutRate ? withRate : withoutRate).toFixed(2)
      ),
      occurrenceCount:
        withRate > withoutRate ? withHashtags.length : withoutHashtags.length,
      recommendation:
        withRate > withoutRate
          ? "Hashtags boost your engagement — use 3-5 per post"
          : "Your audience prefers clean captions without hashtags",
    });
  }

  // Sort by engagement rate
  return insights.sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);
}

/**
 * Generate upcoming holiday opportunities with urgency scoring
 */
export function generateOpportunities(
  holidays: Holiday[],
  campaignAnalytics: CampaignAnalytics[],
  campaigns: Campaign[]
): UpcomingOpportunity[] {
  const today = new Date();

  return holidays
    .filter((h) => {
      const daysUntil = differenceInDays(parseISO(h.date), today);
      return daysUntil >= 0 && daysUntil <= 90;
    })
    .map((holiday) => {
      const daysUntil = differenceInDays(parseISO(holiday.date), today);
      const hasCampaign = campaigns.some(
        (c) => c.holiday_id === holiday.id
      );

      // Predict score based on historical performance of similar holidays
      const similarHolidays = campaignAnalytics.filter(
        (ca) =>
          ca.campaign.holiday?.type === holiday.type ||
          (ca.campaign.holiday?.category || "").toLowerCase() ===
            (holiday.category || "").toLowerCase()
      );

      const predictedScore =
        similarHolidays.length > 0
          ? similarHolidays.reduce(
              (sum, ca) => sum + ca.totals.engagementRate,
              0
            ) / similarHolidays.length
          : 5.0; // Default baseline

      let urgency: UpcomingOpportunity["urgency"];
      if (daysUntil <= 3) urgency = "critical";
      else if (daysUntil <= 7) urgency = "high";
      else if (daysUntil <= 30) urgency = "medium";
      else urgency = "low";

      let recommendation: string;
      if (hasCampaign) {
        recommendation = "Campaign ready! Review and finalize your content.";
      } else if (daysUntil <= 7) {
        recommendation = `⚡ Urgent: Create content for ${holiday.name} now!`;
      } else if (predictedScore > 7) {
        recommendation = `High-opportunity holiday! Create content to maximize engagement.`;
      } else {
        recommendation = `Plan ahead: ${holiday.name} is coming up.`;
      }

      return {
        holiday,
        daysUntil,
        hasCampaign,
        predictedScore: Number(predictedScore.toFixed(1)),
        urgency,
        recommendation,
      };
    })
    .sort((a, b) => {
      // Sort by urgency first, then by predicted score
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return b.predictedScore - a.predictedScore;
    });
}

/**
 * Find best performing campaigns
 */
export function findTopCampaigns(
  campaignAnalytics: CampaignAnalytics[],
  limit: number = 3
): CampaignAnalytics[] {
  return [...campaignAnalytics]
    .sort((a, b) => b.totals.engagementRate - a.totals.engagementRate)
    .slice(0, limit);
}

/**
 * Get campaign status distribution
 */
export function getCampaignStatusDistribution(
  campaigns: Campaign[]
): Record<string, number> {
  return campaigns.reduce(
    (acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
