'use client';

import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface FacebookSimulatorProps {
  caption: string;
  hashtags: string[];
  imageUrl: string | null;
  businessName: string;
  businessAvatar?: string;
  location?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  viewMode?: 'mobile' | 'desktop';
}

export function FacebookSimulator({
  caption,
  hashtags,
  imageUrl,
  businessName,
  businessAvatar,
  location,
  likes = 892,
  comments = 45,
  shares = 23,
  viewMode = 'mobile',
}: FacebookSimulatorProps) {
  const displayHashtags = hashtags?.length > 0 ? hashtags.slice(0, 5) : [];
  const totalReactions = likes;

  // Web/Desktop View
  if (viewMode === 'desktop') {
    return (
      <div className="w-full bg-[#18191a] min-h-screen flex flex-col">
        {/* Web Header */}
        <header className="bg-[#242526] shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            {/* Left: Logo and Search */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="bg-[#3a3b3c] rounded-full px-3 py-2 flex items-center gap-2 w-52">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-400 text-sm">Search Facebook</span>
              </div>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center gap-2">
              <button className="px-8 py-2 border-b-4 border-[#1877f2] text-[#1877f2]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </button>
              <button className="px-8 py-2 text-gray-400 hover:bg-[#3a3b3c] rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 27v-8.25H6.75V12H12V6.75l5.25-5.25 5.25 5.25V12h5.25v6.75H17.25V27H12z"/>
                </svg>
              </button>
              <button className="px-8 py-2 text-gray-400 hover:bg-[#3a3b3c] rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </button>
              <button className="px-8 py-2 text-gray-400 hover:bg-[#3a3b3c] rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
              <button className="px-8 py-2 text-gray-400 hover:bg-[#3a3b3c] rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </button>
            </div>

            {/* Right: Profile Actions */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-[#3a3b3c] rounded-full flex items-center justify-center hover:bg-[#4a4b4c]">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-[#3a3b3c] rounded-full flex items-center justify-center hover:bg-[#4a4b4c]">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 17.17L18.83 16H5V5h14v12.17zM20 2H5c-1.1 0-2 .9-2 2v13.17l2-2V5h13.17L22 6.83V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
              <button className="w-10 h-10 bg-[#3a3b3c] rounded-full flex items-center justify-center hover:bg-[#4a4b4c]">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </button>
              <div className="w-10 h-10 bg-[#1877f2] rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-[#18191a]">
          <div className="max-w-6xl mx-auto flex gap-4 py-4 px-4">
            {/* Left Sidebar */}
            <aside className="hidden lg:block w-80">
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-2 hover:bg-[#3a3b3c] rounded-lg">
                  <div className="w-9 h-9 bg-[#1877f2] rounded-full" />
                  <span className="text-white font-medium">{businessName}</span>
                </button>
                {['Friends', 'Groups', 'Marketplace', 'Watch', 'Memories', 'Saved', 'Pages'].map((item) => (
                  <button key={item} className="w-full flex items-center gap-3 p-2 hover:bg-[#3a3b3c] rounded-lg">
                    <div className="w-9 h-9 bg-[#3a3b3c] rounded-lg" />
                    <span className="text-white font-medium">{item}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Center Feed */}
            <div className="flex-1 max-w-xl">
              {/* Create Post */}
              <div className="bg-[#242526] rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#1877f2] rounded-full" />
                  <div className="flex-1 bg-[#3a3b3c] rounded-full px-4 py-2">
                    <span className="text-gray-400 text-sm">What&apos;s on your mind?</span>
                  </div>
                </div>
                <div className="border-t border-[#3a3b3c] pt-3 flex items-center justify-between">
                  <button className="flex items-center gap-2 px-4 py-1 hover:bg-[#3a3b3c] rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full" />
                    <span className="text-gray-400 text-sm">Live video</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1 hover:bg-[#3a3b3c] rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full" />
                    <span className="text-gray-400 text-sm">Photo/video</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1 hover:bg-[#3a3b3c] rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full" />
                    <span className="text-gray-400 text-sm">Feeling/activity</span>
                  </button>
                </div>
              </div>

              {/* Stories */}
              <div className="flex gap-2 mb-4">
                {['Create Story', 'Friend 1', 'Friend 2', 'Friend 3', 'Friend 4'].map((story, i) => (
                  <div key={story} className={`w-28 h-48 rounded-lg flex-shrink-0 ${i === 0 ? 'bg-[#3a3b3c]' : 'bg-[#4a4b5c]'} relative`}>
                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">{story}</div>
                  </div>
                ))}
              </div>

              {/* Post Card */}
              <article className="bg-[#242526] rounded-lg">
                {/* Post Header */}
                <div className="flex items-start gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center">
                    {businessAvatar ? (
                      <img src={businessAvatar} alt={businessName} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-white font-bold">{businessName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold hover:underline cursor-pointer">{businessName}</p>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-[#1877f2] text-sm hover:underline cursor-pointer">Follow</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <span>Just now</span>
                      <span>•</span>
                      <Globe className="w-3 h-3" />
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                {/* Caption */}
                <div className="px-4 pb-3">
                  <p className="text-white text-sm leading-relaxed">{caption}</p>
                  {displayHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {displayHashtags.map((tag) => (
                        <span key={tag} className="text-[#1877f2] text-sm hover:underline cursor-pointer">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Image */}
                <div className="bg-[#3a3b3c] min-h-[200px] max-h-[500px] flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Post" className="max-w-full max-h-[500px] w-auto h-auto object-contain" />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-600 rounded-lg mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Your Image</p>
                    </div>
                  )}
                </div>

                {/* Reactions & Stats */}
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-[#1877f2] flex items-center justify-center border border-[#242526]">
                        <ThumbsUp className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border border-[#242526]">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-300 text-sm ml-1">{totalReactions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <span className="hover:underline cursor-pointer">{comments} comments</span>
                    <span className="hover:underline cursor-pointer">{shares} shares</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mx-4 border-t border-[#3a3b3c] py-1">
                  <div className="flex items-center justify-between">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                      <ThumbsUp className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Like</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="px-4 py-3 space-y-3">
                  <p className="text-gray-400 text-sm">Most relevant</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">J</span>
                    </div>
                    <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 flex-1">
                      <p className="text-white text-sm font-semibold">John Doe</p>
                      <p className="text-gray-300 text-sm">Love this! Great content 🎉</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">S</span>
                    </div>
                    <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 flex-1">
                      <p className="text-white text-sm font-semibold">Sarah Smith</p>
                      <p className="text-gray-300 text-sm">This is amazing! 👏</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-80">
              <div className="bg-[#242526] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-semibold">Sponsored</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-[#3a3b3c] rounded-lg" />
                    <div>
                      <p className="text-white text-sm font-medium">Sample Ad</p>
                      <p className="text-gray-400 text-xs">sponsored.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#242526] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-semibold">Contacts</h3>
                </div>
                {['Friend 1', 'Friend 2', 'Friend 3'].map((friend) => (
                  <div key={friend} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#3a3b3c]" />
                    <span className="text-white text-sm">{friend}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  // Mobile View (default)
  return (
    <div className="w-full max-w-lg mx-auto bg-[#18191a] min-h-screen flex flex-col">
      {/* Facebook Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
        <ChevronLeft className="w-6 h-6 text-white" />
        <span className="text-white font-semibold flex-1">Facebook</span>
        <div className="flex gap-4">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 17.17L18.83 16H5V5h14v12.17zM20 2H5c-1.1 0-2 .9-2 2v13.17l2-2V5h13.17L22 6.83V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
      </div>

      {/* Post Header */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center">
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
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-semibold hover:underline cursor-pointer">
              {businessName}
            </p>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-[#1877f2] text-xs hover:underline cursor-pointer">Follow</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <span>Just now</span>
            <span>•</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-white text-sm leading-relaxed">{caption}</p>
        
        {/* Hashtags */}
        {displayHashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {displayHashtags.map((tag) => (
              <span key={tag} className="text-[#1877f2] text-sm hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className="bg-[#3a3b3c] min-h-[200px] max-h-[400px] flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post"
            className="max-w-full max-h-[400px] w-auto h-auto object-contain"
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-600 rounded-lg mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Your Image</p>
          </div>
        )}
      </div>

      {/* Reactions & Stats */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-[#1877f2] flex items-center justify-center border border-[#18191a]">
              <ThumbsUp className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border border-[#18191a]">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <span className="text-gray-300 text-sm ml-1">{totalReactions.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <span className="hover:underline cursor-pointer">{comments} comments</span>
          <span className="hover:underline cursor-pointer">{shares} shares</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-700" />

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
          <ThumbsUp className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm font-medium">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm font-medium">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
          <Share2 className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-700" />

      {/* Comments Section Preview */}
      <div className="px-4 py-3 space-y-3 flex-1">
        <p className="text-gray-400 text-sm">Most relevant</p>
        
        {/* Comment 1 */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">J</span>
          </div>
          <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 flex-1">
            <p className="text-white text-sm font-semibold">John Doe</p>
            <p className="text-gray-300 text-sm">Love this! Great content 🎉</p>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">S</span>
          </div>
          <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 flex-1">
            <p className="text-white text-sm font-semibold">Sarah Smith</p>
            <p className="text-gray-300 text-sm">This is amazing! 👏</p>
          </div>
        </div>

        {/* Write a comment */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-[#1877f2]" />
          <div className="flex-1 bg-[#3a3b3c] rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-500"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-gray-700 bg-[#18191a] mt-auto">
        <svg className="w-6 h-6 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        <div className="w-10 h-10 rounded-full bg-[#3a3b3c] flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
        <div className="w-6 h-6 rounded-full bg-gray-600" />
      </div>
    </div>
  );
}
