'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { ArrowLeft, Check, Loader2, Monitor, Smartphone, Hash, Building2, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotification } from '@/components/notifications';
import { InstagramSimulator, FacebookSimulator } from '@/components/simulator';
import { logPostSimulated } from '@/lib/activity';

interface SimulationData {
  platform: 'instagram' | 'facebook';
  caption: string;
  hashtags: string[];
  imageUrl: string | null;
  businessName: string;
  location: string;
  holidayId: string;
  holidayName: string;
  campaignId: string;
}

function SimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [isPosting, setIsPosting] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);

  // Load simulation data from sessionStorage (more reliable than URL params)
  useEffect(() => {
    const stored = sessionStorage.getItem('simulation-data');
    const platformParam = searchParams.get('platform') as 'instagram' | 'facebook';

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate data is fresh (within 5 minutes)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setSimulationData(parsed);
          console.log('[Simulator] Loaded from sessionStorage:', { imageUrl: parsed.imageUrl });
        } else {
          // Stale data, clear it
          sessionStorage.removeItem('simulation-data');
        }
      } catch (e) {
        console.error('Failed to parse simulation data:', e);
      }
    }
  }, [searchParams]);

  // Use stored data or defaults
  const platform = simulationData?.platform || (searchParams.get('platform') as 'instagram' | 'facebook') || 'instagram';
  const caption = simulationData?.caption || '';
  const hashtags = simulationData?.hashtags || [];
  const imageUrl = simulationData?.imageUrl || null;
  const businessName = simulationData?.businessName || 'Your Business';
  const location = simulationData?.location || '';
  const holidayId = simulationData?.holidayId || '';
  const holidayName = simulationData?.holidayName || '';
  const campaignId = simulationData?.campaignId || '';

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = async () => {
    if (!campaignId) {
      addNotification('No campaign to post', 'error');
      return;
    }

    setIsPosting(true);

    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate simulated post ID
      const postId = `${platform}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Log the simulation
      await logPostSimulated(
        [platform],
        caption,
        hashtags,
        holidayId,
        holidayName,
        campaignId,
        { success: true, platform, postId },
        { [platform]: postId }
      );

      addNotification(`Simulated post to ${platform === 'instagram' ? 'Instagram' : 'Facebook'}!`, 'success');

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error during simulation:', error);
      addNotification('Failed to complete simulation', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Professional Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Preview Your Post
                </h1>
                <p className="text-sm text-slate-500">
                  {platform === 'instagram' ? 'Instagram' : 'Facebook'} • {viewMode === 'mobile' ? 'Mobile App' : 'Web Browser'}
                </p>
              </div>
            </div>

            {/* Center: Platform Badge (Mobile Only) */}
            <div className="sm:hidden">
              <Badge
                variant="secondary"
                className={`capitalize ${
                  platform === 'instagram'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0'
                    : 'bg-[#1877f2] text-white border-0'
                }`}
              >
                {platform}
              </Badge>
            </div>

            {/* Right: View Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">Web</span>
                </button>
              </div>

              <Badge
                variant="secondary"
                className={`hidden sm:flex capitalize ${
                  platform === 'instagram'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0'
                    : 'bg-[#1877f2] text-white border-0'
                }`}
              >
                {platform}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr,360px] gap-6">
          {/* Simulator Preview */}
          <div className="flex justify-center lg:justify-start">
            <div className={`
              overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ease-out bg-black
              ${viewMode === 'mobile' ? 'w-[375px] max-w-full' : 'w-full max-w-6xl'}
            `}>
              {platform === 'instagram' ? (
                <InstagramSimulator
                  caption={caption}
                  hashtags={hashtags}
                  imageUrl={imageUrl}
                  businessName={businessName}
                  location={location}
                  viewMode={viewMode}
                />
              ) : (
                <FacebookSimulator
                  caption={caption}
                  hashtags={hashtags}
                  imageUrl={imageUrl}
                  businessName={businessName}
                  location={location}
                  viewMode={viewMode}
                />
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-4">
            {/* Post Actions Card */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-500" />
                  Review & Confirm
                </CardTitle>
                <CardDescription className="text-sm">
                  Preview how your content will appear to your audience before simulating.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-slate-100 dark:bg-slate-800" />
              <CardContent className="pt-4 space-y-5">
                {/* Post Details */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Post Summary</p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        platform === 'instagram'
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
                          : 'bg-[#1877f2]'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {platform === 'instagram' ? 'IG' : 'FB'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {platform === 'instagram' ? 'Instagram' : 'Facebook'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {viewMode === 'mobile' ? 'Mobile App View' : 'Web Browser View'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{businessName}</p>
                    </div>

                    {holidayName && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{holidayName}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Hash className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {hashtags.length} {hashtags.length === 1 ? 'hashtag' : 'hashtags'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        imageUrl ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <svg className={`w-4 h-4 ${imageUrl ? 'text-green-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {imageUrl ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">Image uploaded</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">No image</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <Button
                    onClick={handleConfirm}
                    disabled={isPosting}
                    className={`w-full h-11 font-semibold transition-all ${
                      platform === 'instagram'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500'
                        : 'bg-[#1877f2] hover:bg-[#166fe5]'
                    }`}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Simulation
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isPosting}
                    className="w-full h-11 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Edit Post
                  </Button>
                </div>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  This is a visual simulation only. No content will be posted to {platform === 'instagram' ? 'Instagram' : 'Facebook'}.
                </p>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {platform === 'instagram' ? (
                    <>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">1</span>
                        <span className="text-slate-600 dark:text-slate-400">Use 20-30 relevant hashtags for maximum discoverability</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">2</span>
                        <span className="text-slate-600 dark:text-slate-400">Post during peak hours (9-11 AM or 7-9 PM) for better engagement</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">3</span>
                        <span className="text-slate-600 dark:text-slate-400">Respond to comments within the first hour to boost visibility</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1877f2] text-xs font-semibold flex items-center justify-center flex-shrink-0">1</span>
                        <span className="text-slate-600 dark:text-slate-400">Keep captions concise but include a clear call-to-action</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1877f2] text-xs font-semibold flex items-center justify-center flex-shrink-0">2</span>
                        <span className="text-slate-600 dark:text-slate-400">Engage with comments quickly to improve reach</span>
                      </li>
                      <li className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1877f2] text-xs font-semibold flex items-center justify-center flex-shrink-0">3</span>
                        <span className="text-slate-600 dark:text-slate-400">Cross-post to relevant Facebook Groups for expanded reach</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Loading Preview</p>
            <p className="text-sm text-slate-500">Preparing your platform simulation...</p>
          </div>
        </div>
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  );
}
