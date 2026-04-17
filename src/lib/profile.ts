/**
 * Database operations for user profiles
 */

export interface Profile {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  target_audience: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch user profile
 */
export async function fetchProfile(): Promise<Profile> {
  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const { profile } = await response.json();
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<Profile> {
  try {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const { profile } = await response.json();
    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
