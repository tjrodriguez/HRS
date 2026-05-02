import type { EngagementPrediction, PlatformTips } from '@/lib/types/campaign';

/**
 * Calculate engagement prediction based on content metrics
 */
export function calculateEngagement(
  captionLength: number,
  hashtagCount: number,
  hasImage: boolean,
  platform: 'instagram' | 'facebook' = 'instagram'
): EngagementPrediction {
  // Base reach calculation
  const baseReach = platform === 'instagram' ? 1500 : 2000;
  const reachMin = Math.floor(baseReach * 0.7);
  const reachMax = Math.floor(baseReach * 1.3);
  
  // Engagement rate factors
  const lengthFactor = captionLength > 50 && captionLength < 300 ? 1.2 : 0.9;
  const hashtagFactor = hashtagCount >= 3 && hashtagCount <= 10 ? 1.15 : 0.95;
  const imageFactor = hasImage ? 1.3 : 1.0;
  
  const engagementRate = (4.5 * lengthFactor * hashtagFactor * imageFactor).toFixed(1);
  
  // Calculate predicted likes and comments
  const avgReach = (reachMin + reachMax) / 2;
  const predictedLikes = Math.floor(avgReach * (parseFloat(engagementRate) / 100));
  const predictedComments = Math.floor(predictedLikes * 0.15);
  
  return {
    reach: { min: reachMin, max: reachMax },
    likes: { min: Math.floor(predictedLikes * 0.8), max: Math.floor(predictedLikes * 1.2) },
    comments: { min: Math.floor(predictedComments * 0.7), max: Math.floor(predictedComments * 1.3) },
    engagementRate: `${engagementRate}%`,
    platform,
  };
}

/**
 * Generate platform-specific tips based on content
 */
export function generatePlatformTips(
  captionLength: number,
  hashtagCount: number,
  hasImage: boolean
): PlatformTips {
  const tips: PlatformTips = {
    instagram: [],
    facebook: [],
    general: [],
  };
  
  // Instagram tips
  if (captionLength < 50) {
    tips.instagram.push('Consider adding more context to your caption for better engagement');
  } else if (captionLength > 300) {
    tips.instagram.push('Your caption is quite long - consider breaking it into smaller paragraphs');
  }
  
  if (hashtagCount < 3) {
    tips.instagram.push('Add 3-5 relevant hashtags to increase discoverability');
  } else if (hashtagCount > 15) {
    tips.instagram.push('Too many hashtags can look spammy - aim for 5-10 targeted ones');
  }
  
  if (!hasImage) {
    tips.instagram.push('Posts with images typically get 38% more engagement');
  }
  
  // Facebook tips
  if (captionLength > 500) {
    tips.facebook.push('Facebook posts perform better with concise captions (under 500 chars)');
  }
  
  tips.facebook.push('Consider sharing this as a Facebook Story for additional reach');
  
  // General tips
  tips.general.push('Post during peak hours (11am-1pm, 7pm-9pm) for maximum engagement');
  
  return tips;
}
