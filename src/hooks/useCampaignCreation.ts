'use client';

import { useState, useCallback } from 'react';
import { useNotification } from '@/components/notifications';
import { createCampaign, updateCampaign } from '@/lib/campaigns';
import type { Campaign } from '@/lib/types/campaign';

interface UseCampaignCreationProps {
  holidayId: string;
  onSuccess?: (campaign: Campaign) => void;
}

interface UseCampaignCreationReturn {
  isLoading: boolean;
  isPosting: boolean;
  create: (content: Campaign['content'], platforms: Campaign['platforms']) => Promise<Campaign | null>;
  update: (campaignId: string, updates: Partial<Campaign>) => Promise<boolean>;
  schedule: (campaignId: string, date: Date) => Promise<boolean>;
  postNow: (content: Campaign['content'], platforms: Campaign['platforms']) => Promise<boolean>;
}

export function useCampaignCreation({
  holidayId,
  onSuccess,
}: UseCampaignCreationProps): UseCampaignCreationReturn {
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const create = useCallback(async (
    content: Campaign['content'],
    platforms: Campaign['platforms']
  ): Promise<Campaign | null> => {
    setIsLoading(true);
    try {
      const campaign = await createCampaign(holidayId, content, platforms, null);
      addNotification('Campaign created successfully', 'success');
      onSuccess?.(campaign);
      return campaign;
    } catch (error) {
      console.error('Create campaign error:', error);
      addNotification('Failed to create campaign', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [holidayId, onSuccess, addNotification]);

  const update = useCallback(async (
    campaignId: string,
    updates: Partial<Campaign>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await updateCampaign(campaignId, updates);
      addNotification('Campaign updated', 'success');
      return true;
    } catch (error) {
      console.error('Update campaign error:', error);
      addNotification('Failed to update campaign', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const schedule = useCallback(async (
    campaignId: string,
    date: Date
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await updateCampaign(campaignId, {
        scheduled_date: date.toISOString(),
        status: 'scheduled',
      });
      addNotification(`Campaign scheduled for ${date.toLocaleDateString()}`, 'success');
      return true;
    } catch (error) {
      console.error('Schedule campaign error:', error);
      addNotification('Failed to schedule campaign', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const postNow = useCallback(async (
    content: Campaign['content'],
    platforms: Campaign['platforms']
  ): Promise<boolean> => {
    setIsPosting(true);
    try {
      // Create campaign first
      const campaign = await createCampaign(holidayId, content, platforms, new Date().toISOString());
      
      // Mark as posted
      await updateCampaign(campaign.id, { status: 'posted' });
      
      addNotification('Posted to social media!', 'success');
      onSuccess?.(campaign);
      return true;
    } catch (error) {
      console.error('Post now error:', error);
      addNotification('Failed to post to social media', 'error');
      return false;
    } finally {
      setIsPosting(false);
    }
  }, [holidayId, onSuccess, addNotification]);

  return {
    isLoading,
    isPosting,
    create,
    update,
    schedule,
    postNow,
  };
}
