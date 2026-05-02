'use client';

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface InstagramSimulatorProps {
  caption: string;
  hashtags: string[];
  imageUrl: string | null;
  businessName: string;
  businessAvatar?: string;
  location?: string;
  likes?: number;
  comments?: number;
  viewMode?: 'mobile' | 'desktop';
}

export function InstagramSimulator({
  caption,
  hashtags,
  imageUrl,
  businessName,
  businessAvatar,
  location,
  likes = 1247,
  comments = 89,
  viewMode = 'mobile',
}: InstagramSimulatorProps) {
  const displayHashtags = hashtags?.length > 0 ? hashtags : [];

  // Web/Desktop View
  if (viewMode === 'desktop') {
    return (
      <div className="w-full bg-black min-h-screen flex flex-col">
        {/* Web Header */}
        <header className="bg-black border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <svg className="w-28 h-8 text-white" viewBox="0 0 84 28" fill="currentColor">
                <path d="M12.04 2.5c-3.8 0-6.94 1.6-7.3 3.6-.08.5.26 1 .82 1.15l2.32.6c.5.13 1-.12 1.2-.56.2-.4.7-.66 1.26-.66h.08c1.7 0 3.08 1.24 3.08 2.76v.1c0 .54-.45.98-1 1.04-3.14.3-5.8 1.38-7.08 3.56-.6 1.04-.9 2.3-.9 3.7 0 .8.1 1.58.3 2.32.54 2 1.88 3.54 3.76 4.36 1.5.66 3.28 1 5.28 1 2.24 0 4.32-.48 6.06-1.4 2.2-1.16 3.44-3 3.44-5.18V10.4c0-4.32-3.46-7.9-7.96-7.9zm-1.5 13.92c-.74.22-1.6.34-2.54.34-.96 0-1.8-.12-2.5-.36-.86-.28-1.44-.82-1.68-1.56-.1-.34-.16-.7-.16-1.08 0-.6.12-1.14.36-1.62.56-1.08 1.88-1.78 3.62-1.9.6-.04 1.08.4 1.14 1 .04.54-.36 1.02-.9 1.08-.96.1-1.62.44-1.9.96-.08.16-.12.34-.12.54 0 .36.12.66.34.88.34.36.96.56 1.74.56.7 0 1.38-.14 1.98-.4.6-.26.9-.6.9-.98v-.1c0-.5-.4-.9-.9-.9h-.02c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9h.02c1.4 0 2.64.72 3.36 1.9.26.42.4.9.4 1.42 0 1.56-1.4 2.9-3.44 3.52zm15.46-6.1c-1.1-.52-2.4-.78-3.84-.78-.88 0-1.74.1-2.56.3-.5.12-1.04-.1-1.26-.56l-.88-1.88c-.22-.46-.1-1 .34-1.26.96-.56 2.08-.86 3.32-.86 2.14 0 4.04.64 5.6 1.88.46.36 1.12.28 1.48-.18l1.38-1.76c.36-.46.26-1.12-.22-1.46-2.16-1.56-4.9-2.4-7.94-2.4-2.42 0-4.58.54-6.4 1.6-2.34 1.36-3.64 3.48-3.64 5.96 0 1.9.7 3.6 2.06 4.92 1.6 1.56 3.96 2.42 6.66 2.42 1.56 0 3.02-.28 4.32-.82 1.04-.44 1.9-1.04 2.56-1.78.64-.72 1-1.54 1-2.38 0-.92-.36-1.78-1.04-2.48-.76-.78-1.86-1.36-3.24-1.62zm-1.04 4.54c-.32.18-.72.26-1.18.26-.96 0-1.78-.34-2.38-.96-.58-.6-.9-1.42-.9-2.3 0-.42.08-.82.22-1.16.22-.54.76-.88 1.38-.88h.1c.64 0 1.22.26 1.62.72.48.56.74 1.34.74 2.18 0 .66-.18 1.28-.5 1.78-.12.2-.3.36-.5.48-.16.08-.34.12-.52.12-.5 0-.98-.18-1.38-.52l-.14-.12c-.18-.16-.2-.44-.04-.62.16-.18.44-.2.62-.04l.12.1c.22.18.48.28.76.28.1 0 .2-.02.28-.06.08-.04.14-.1.18-.18.18-.3.28-.66.28-1.04 0-.58-.18-1.12-.5-1.5-.22-.26-.52-.4-.86-.4h-.04c-.26 0-.5.14-.64.38-.08.16-.12.36-.12.58 0 .4.14.78.38 1.08.34.42.84.66 1.4.66.32 0 .6-.08.84-.22.36-.22.58-.6.58-1.04 0-.48-.18-.92-.5-1.24-.28-.28-.66-.44-1.08-.44-.18 0-.34.04-.5.1-.2.08-.42.02-.52-.16-.1-.18-.04-.42.14-.52.26-.12.56-.18.88-.18.66 0 1.28.24 1.76.68.5.46.78 1.1.78 1.82 0 .68-.26 1.3-.72 1.74-.44.44-1.04.72-1.72.78-.14.02-.28.04-.42.04-.26 0-.52-.04-.76-.12zm13.14-9.86c-2.76 0-5.22.84-7.04 2.42-.44.36-.5 1.02-.14 1.46l1.38 1.76c.36.46 1.02.54 1.48.18 1.56-1.24 3.46-1.88 5.6-1.88 1.24 0 2.36.3 3.32.86.44.26.56.8.34 1.26l-.88 1.88c-.22.46-.76.68-1.26.56-.82-.2-1.68-.3-2.56-.3-1.44 0-2.74.26-3.84.78-1.38.26-2.48.84-3.24 1.62-.68.7-1.04 1.56-1.04 2.48 0 .84.36 1.66 1 2.38.66.74 1.52 1.34 2.56 1.78 1.3.54 2.76.82 4.32.82 2.7 0 5.06-.86 6.66-2.42 1.36-1.32 2.06-3.02 2.06-4.92 0-2.48-1.3-4.6-3.64-5.96-1.82-1.06-3.98-1.6-6.4-1.6z"/>
              </svg>
            </div>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-xs mx-8">
              <div className="bg-gray-900 rounded-lg px-4 py-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-500 text-sm">Search</span>
              </div>
            </div>

            {/* Nav Icons */}
            <div className="flex items-center gap-5">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.099l11.9 9.9-2.9 2.9-9-7.5-9 7.5-2.9-2.9 11.9-9.9zm0 4.5l7.5 6.3v8.1h-5v-6h-5v6h-5v-8.1l7.5-6.3z"/>
              </svg>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-gray-800" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-black">
          <div className="max-w-6xl mx-auto flex gap-8 py-8 px-4">
            {/* Left Column - Post Feed */}
            <div className="flex-1 max-w-xl">
              {/* Stories Bar */}
              <div className="bg-black border border-gray-800 rounded-lg p-4 mb-6">
                <div className="flex gap-4 overflow-x-auto">
                  {['Your Story', 'Friend 1', 'Friend 2', 'Friend 3', 'Friend 4', 'Friend 5'].map((name, i) => (
                    <div key={name} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={`w-14 h-14 rounded-full ${i === 0 ? 'bg-gray-600' : 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600'} p-[2px]`}>
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                          <span className="text-white text-xs">{name[0]}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post Card */}
              <article className="bg-black border border-gray-800 rounded-lg overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                        {businessAvatar ? (
                          <img src={businessAvatar} alt={businessName} className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-white text-xs font-bold">{businessName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold hover:underline cursor-pointer">{businessName}</p>
                      {location && <p className="text-gray-400 text-xs">{location}</p>}
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-white cursor-pointer" />
                </div>

                {/* Post Image */}
                <div className="relative bg-gray-900 aspect-square flex items-center justify-center border-y border-gray-800">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-lg mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Your Image</p>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6 text-white hover:text-red-500 transition-colors cursor-pointer" />
                    <MessageCircle className="w-6 h-6 text-white hover:text-blue-400 transition-colors cursor-pointer" />
                    <Send className="w-6 h-6 text-white hover:text-green-400 transition-colors cursor-pointer -rotate-12" />
                  </div>
                  <Bookmark className="w-6 h-6 text-white hover:text-yellow-400 transition-colors cursor-pointer" />
                </div>

                {/* Likes */}
                <div className="px-4 pb-2">
                  <p className="text-white text-sm font-semibold">{likes.toLocaleString()} likes</p>
                </div>

                {/* Caption */}
                <div className="px-4 pb-3">
                  <p className="text-white text-sm">
                    <span className="font-semibold mr-1">{businessName}</span>
                    <span className="text-gray-300">{caption}</span>
                  </p>
                  {displayHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {displayHashtags.map((tag) => (
                        <span key={tag} className="text-blue-400 text-sm hover:underline cursor-pointer">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div className="px-4 py-2 border-t border-gray-800">
                  <p className="text-gray-400 text-sm mb-2">View all {comments} comments</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                      readOnly
                    />
                    <button className="text-blue-400 text-sm font-semibold opacity-50">Post</button>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Sidebar */}
            <aside className="hidden lg:block w-80">
              {/* User Profile */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-gray-800" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{businessName}</p>
                  <p className="text-gray-400 text-sm">Business Account</p>
                </div>
                <button className="text-blue-400 text-xs font-semibold">Switch</button>
              </div>

              {/* Suggestions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm font-semibold">Suggestions for you</p>
                  <button className="text-white text-xs font-semibold">See All</button>
                </div>
                {['suggested_user1', 'suggested_user2', 'suggested_user3'].map((user) => (
                  <div key={user} className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700" />
                      <div>
                        <p className="text-white text-sm font-semibold">{user}</p>
                        <p className="text-gray-400 text-xs">New to Instagram</p>
                      </div>
                    </div>
                    <button className="text-blue-400 text-xs font-semibold">Follow</button>
                  </div>
                ))}
              </div>

              {/* Footer Links */}
              <div className="text-xs text-gray-500">
                <p className="mb-4">About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language • Meta Verified</p>
                <p>© 2026 Instagram from Meta</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  // Mobile View (default)
  return (
    <div className="w-full max-w-md mx-auto bg-black min-h-screen flex flex-col">
      {/* Instagram Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <ChevronLeft className="w-6 h-6 text-white" />
        <span className="text-white font-semibold">{businessName}</span>
        <MoreHorizontal className="w-6 h-6 text-white" />
      </div>

      {/* Stories Bar (Decorative) */}
      <div className="flex gap-4 px-4 py-3 border-b border-gray-800 overflow-x-auto">
        {['Your Story', 'Friend 1', 'Friend 2', 'Friend 3', 'Friend 4'].map((name, i) => (
          <div key={name} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-16 h-16 rounded-full ${i === 0 ? 'bg-gray-600' : 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600'} p-[2px]`}>
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-xs font-medium">{name[0]}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{name}</span>
          </div>
        ))}
      </div>

      {/* Post Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
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
          {location && <p className="text-gray-400 text-xs">{location}</p>}
        </div>
        <MoreHorizontal className="w-5 h-5 text-white" />
      </div>

      {/* Post Image */}
      <div className="relative bg-gray-900 aspect-square flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-lg mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Your Image</p>
          </div>
        )}
        
        {/* Carousel Indicators (if multiple images) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-6 h-1 bg-white rounded-full" />
        </div>
        
        {/* Carousel Navigation */}
        <ChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white/50" />
        <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white/50" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Heart className="w-7 h-7 text-white hover:text-red-500 transition-colors cursor-pointer" />
          <MessageCircle className="w-7 h-7 text-white hover:text-blue-400 transition-colors cursor-pointer" />
          <Send className="w-7 h-7 text-white hover:text-green-400 transition-colors cursor-pointer -rotate-12" />
        </div>
        <Bookmark className="w-7 h-7 text-white hover:text-yellow-400 transition-colors cursor-pointer" />
      </div>

      {/* Likes Count */}
      <div className="px-4">
        <p className="text-white text-sm font-semibold">{likes.toLocaleString()} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 py-2">
        <p className="text-white text-sm">
          <span className="font-semibold mr-1">{businessName}</span>
          <span className="text-gray-300">{caption}</span>
        </p>
        
        {/* Hashtags */}
        {displayHashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {displayHashtags.map((tag) => (
              <span key={tag} className="text-blue-400 text-sm hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments Preview */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-sm">View all {comments} comments</p>
        <div className="mt-2 space-y-1">
          <p className="text-white text-sm">
            <span className="font-semibold mr-1">user_123</span>
            <span className="text-gray-300">Great post! 🎉</span>
          </p>
          <p className="text-white text-sm">
            <span className="font-semibold mr-1">marketing_pro</span>
            <span className="text-gray-300">Love this content! 👏</span>
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <div className="px-4 py-2">
        <p className="text-gray-500 text-xs uppercase">Just now</p>
      </div>

      {/* Add Comment Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-800 mt-auto">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-gray-800" />
        </div>
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
          readOnly
        />
        <button className="text-blue-400 text-sm font-semibold opacity-50">Post</button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-gray-800">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.099l11.9 9.9-2.9 2.9-9-7.5-9 7.5-2.9-2.9 11.9-9.9zm0 4.5l7.5 6.3v8.1h-5v-6h-5v6h-5v-8.1l7.5-6.3z"/>
        </svg>
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[1px]">
          <div className="w-full h-full rounded-full bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
