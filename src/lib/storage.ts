import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

/**
 * Upload a user-selected image file to Supabase Storage
 * Organized under user_id/holiday_id/filename to avoid collisions
 */
export async function uploadPostImage(
  file: File,
  holidayId: string
): Promise<string> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${user.id}/${holidayId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its public URL
 */
export async function deletePostImage(url: string): Promise<void> {
  const pathMatch = url.match(/\/post-images\/(.+)$/);
  if (!pathMatch) {
    console.warn('Could not extract path from URL:', url);
    return;
  }

  const path = pathMatch[1];
  const { error } = await supabase.storage.from('post-images').remove([path]);

  if (error) {
    console.error('Failed to delete image:', error);
  }
}

