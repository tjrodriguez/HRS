/**
 * Template helper functions and types
 */

export interface TemplateInput {
  name: string;
  content: string;
  hashtags?: string[];
  category?: string;
  holiday_name?: string;
  business_type?: string;
  tone?: string;
  platforms?: string[];
}

/**
 * Create a new template via API
 */
export async function createTemplate(input: TemplateInput): Promise<{ id: string } | null> {
  try {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to create template');
    }

    const data = await response.json();
    return data.template;
  } catch (error) {
    console.error('Error creating template:', error);
    return null;
  }
}

/**
 * Toggle favorite status on a template
 */
export async function toggleFavoriteTemplate(id: string, isFavorite: boolean): Promise<boolean> {
  try {
    const response = await fetch('/api/templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_favorite: isFavorite }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

/**
 * Increment usage count on a template
 */
export async function incrementTemplateUsage(id: string, currentCount: number): Promise<boolean> {
  try {
    const response = await fetch('/api/templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, usage_count: currentCount + 1 }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/templates?id=${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
}

/**
 * Auto-generate a template name from content
 */
export function generateTemplateName(content: string, holidayName?: string): string {
  const clean = content.replace(/[#\n]/g, ' ').trim();
  const firstSentence = clean.split(/[.!?]/)[0] || clean;
  const truncated = firstSentence.slice(0, 50).trim();
  const suffix = holidayName ? ` - ${holidayName}` : '';
  return truncated + suffix || 'Untitled Template';
}

/**
 * Extract hashtags from content text
 */
export function extractHashtags(content: string): string[] {
  const matches = content.match(/#[\w]+/g);
  return matches || [];
}

/**
 * Template categories with display names
 */
export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'general', label: 'General' },
  { value: 'holiday', label: 'Holiday Specific' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'seasonal', label: 'Seasonal' },
] as const;

