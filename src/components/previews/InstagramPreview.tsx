'use client';

import { Sparkles, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import Image from 'next/image';
import type { Campaign } from '@/lib/types/campaign';

interface InstagramPreviewProps {
  content: Campaign['content'];
  businessName?: string;
  businessAvatar?: string;
}

export function InstagramPreview({
  content,
  businessName = 'Your Business',
  businessAvatar,
}: InstagramPreviewProps) {
  const { instagram, hashtags, imageUrl } = content;
  
  // Parse caption and hashtags for display
  const displayCaption = instagram || 'Your caption will appear here...';
  const displayHashtags = hashtags?.length > 0 ? hashtags : ['#YourHashtags'];

  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl p-1">
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        {/* Instagram Header */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
              {businessAvatar ? (
                <Image
                  src={businessAvatar}
                  alt={businessName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <span className="text-white text-xs font-bold">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{businessName}</p>
            <p className="text-white/60 text-xs">Sponsored</p>
          </div>
          <span className="text-white/40 text-xs">•••</span>
        </div>

        {/* Instagram Image */}
        <div className="bg-white/5 aspect-square flex items-center justify-center border-t border-b border-white/10 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Post preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Failed to load image:', imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Your Holiday Image</p>
            </div>
          )}
        </div>

        {/* Instagram Caption & Hashtags */}
        <div className="p-3 space-y-2">
          {/* Action Icons */}
          <div className="flex items-center gap-4 text-white/80">
            <Heart className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
            <MessageCircle className="w-6 h-6 hover:text-blue-400 transition-colors cursor-pointer" />
            <Send className="w-6 h-6 hover:text-green-400 transition-colors cursor-pointer" />
            <Bookmark className="w-6 h-6 ml-auto hover:text-yellow-400 transition-colors cursor-pointer" />
          </div>

          {/* Caption */}
          <div className="text-white/90 text-sm whitespace-pre-wrap">
            <span className="font-semibold">{businessName}</span>{' '}
            <span className="text-white/80">{displayCaption}</span>
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1">
            {displayHashtags.slice(0, 6).map((tag) => (
              <span key={tag} className="text-blue-400 text-sm">
                {tag}
              </span>
            ))}
            {displayHashtags.length > 6 && (
              <span className="text-white/60 text-sm">
                +{displayHashtags.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
