'use client';

import { Sparkles, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import type { Campaign } from '@/lib/types/campaign';

interface FacebookPreviewProps {
  content: Campaign['content'];
  businessName?: string;
  businessAvatar?: string;
  location?: string;
}

export function FacebookPreview({
  content,
  businessName = 'Your Business',
  businessAvatar,
  location = 'Your City',
}: FacebookPreviewProps) {
  const { instagram, hashtags, imageUrl } = content;
  
  const displayCaption = instagram || 'Your caption will appear here...';
  const displayHashtags = hashtags?.length > 0 ? hashtags.slice(0, 3) : ['#YourHashtags'];

  return (
    <div className="bg-slate-900 rounded-xl p-1">
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        {/* Facebook Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            {businessAvatar ? (
              <Image
                src={businessAvatar}
                alt={businessName}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-white font-bold">
                {businessName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{businessName}</p>
            <p className="text-white/60 text-sm">{location}</p>
          </div>
          <span className="text-white/40 text-xs">•••</span>
        </div>

        {/* Facebook Caption */}
        <div className="px-4 py-3 text-white/90 text-sm">
          {displayCaption}
          <div className="mt-2 flex flex-wrap gap-1">
            {displayHashtags.map((tag) => (
              <span key={tag} className="text-blue-400">
                {tag}
              </span>
            ))}
            {hashtags?.length > 3 && (
              <span className="text-white/60">
                +{hashtags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Facebook Image */}
        <div className="bg-white/5 max-h-[300px] min-h-[200px] flex items-center justify-center border-y border-white/10 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Post preview"
              className="max-w-full max-h-[300px] w-auto h-auto object-contain"
              onError={(e) => {
                console.error('Failed to load image:', imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="aspect-video w-full flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Your Holiday Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Facebook Engagement */}
        <div className="p-4 border-t border-white/10 flex gap-3 text-white/60 text-sm">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-white/10 transition-colors">
            👍 Like
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-white/10 transition-colors">
            💬 Comment
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-white/10 transition-colors">
            📤 Share
          </button>
        </div>
      </div>
    </div>
  );
}
