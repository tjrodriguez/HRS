/**
 * Parse caption array from API response
 */
export function parseCaptionArray(captionData: unknown): string[] {
  if (Array.isArray(captionData)) {
    return captionData.filter((item): item is string => typeof item === 'string');
  }
  if (typeof captionData === 'string') {
    // Try to parse if it's a JSON string representation of an array
    try {
      const parsed = JSON.parse(captionData);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      // If it's a plain string, split by newlines and filter
      return captionData
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
  }
  return [];
}

/**
 * Generate fallback caption when API fails
 */
export function generateFallbackCaption(
  holiday: { name: string; description?: string },
  profile: { name: string; type?: string; description?: string }
): string {
  const holidayName = holiday.name;
  const businessName = profile.name;
  const businessType = profile.type || 'Business';
  
  const templates = [
    `🎉 Celebrate ${holidayName} with ${businessName}! 🎉\n\nAs a local ${businessType.toLowerCase()}, we're excited to share this special day with our amazing community. ${holiday.description || ''}\n\nShow your support for small businesses this ${holidayName}! 💙\n\n#${holidayName.replace(/\s+/g, '')} #SmallBusiness #SupportLocal`,
    
    `Happy ${holidayName}! 🎊\n\nAt ${businessName}, we believe ${holiday.description || 'every day is worth celebrating'}. Join us in making this ${holidayName} memorable!\n\n#${holidayName.replace(/\s+/g, '')} #${businessName.replace(/\s+/g, '')} #LocalBusiness`,
    
    `🌟 ${holidayName} Special at ${businessName}! 🌟\n\nDon't miss out on our ${holidayName} celebration. As your trusted ${businessType.toLowerCase()}, we've got something special planned!\n\n#${holidayName.replace(/\s+/g, '')} #SpecialOffer #SmallBusiness`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}
