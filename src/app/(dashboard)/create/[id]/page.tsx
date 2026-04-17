"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBusiness, Holiday, Profile } from '@/context/BusinessContext';
import { Sparkles, Copy, AlertCircle, Loader2, Mail, Share2, CalendarDays, Check, TrendingUp, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { parseISO, format } from 'date-fns';
import { createCampaign, scheduleCampaign, updateCampaign } from '@/lib/campaigns';

// Social media SVG components
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h3z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2s9 5 20 5a9.5 9.5 0 0 0-9-5.5c4.75 2.25 7-7 7-7"/></svg>
);

export default function CreatePage() {
  const params = useParams();
  const router = useRouter();
  const holidayId = params.id as string;
  const { holidays, profile } = useBusiness();

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const [saving, setSaving] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState({
    instagram: true,
    facebook: false,
    twitter: false,
  });
  const [content, setContent] = useState({
    instagram: '',
    email: '',
    hashtags: [] as string[],
  });
  const [captions, setCaptions] = useState<string[]>([]);
  const [activeInstagramIndex, setActiveInstagramIndex] = useState(0);
  const [engagement, setEngagement] = useState({
    reach: { min: 3500, max: 5000 },
    likes: { min: 250, max: 400 },
    comments: { min: 30, max: 50 },
    shares: { min: 40, max: 70 },
  });
  const [platformTips, setPlatformTips] = useState({
    instagram: 'Use all suggested hashtags and post during peak hours (9-11 AM or 7-9 PM).',
    facebook: 'Include a clear call-to-action and encourage comments. Facebook prioritizes authentic engagement.',
    twitter: 'Keep it short and punchy. Use relevant hashtags and engage with replies quickly.',
  });
  const [copied, setCopied] = useState(false);

  const holiday = holidays.find(h => String(h.id) === holidayId);

  // Helper functions for fallback content generation
  const generateFallbackCaption = (holiday: Holiday, profile: Profile) => {
    return `🎉 Happy ${holiday.name}! 🎊

Join us at ${profile.name} as we celebrate this special occasion with amazing experiences tailored for ${profile.targetAudience}.

Whether you're celebrating with friends, family, or your loved ones, we've got something special prepared just for you this ${holiday.name}! 

📍 Find us in ${profile.location || 'our area'}
🔗 Link in bio for more details`;
  };

  const generateFallbackContent = (holiday: Holiday, profile: Profile) => {
    const defaultHashtags = [
      `#${holiday.name.replace(/\s+/g, '')}`,
      '#SmallBusiness',
      '#LocalBusiness',
      '#MarketingTips',
      '#HolidayDeals',
      '#SpecialOffer',
    ];

    setContent({
      instagram: generateFallbackCaption(holiday, profile),
      email: `Subject: 🎉 Celebrate ${holiday.name} with ${profile.name}!

Dear Valued ${profile.targetAudience},

This ${holiday.name}, we're excited to invite you to celebrate with us at ${profile.name}!

We've curated special ${holiday.name} experiences and exclusive offers just for our community. Whether you're celebrating with friends, family, or treating yourself, we have something special waiting for you.

Visit us and discover why your neighbors love us. We look forward to making your ${holiday.name} memorable!

Warm regards,
${profile.name} Team
📍 ${profile.location || 'Our Location'}`,
      hashtags: defaultHashtags,
    });
    setGenerated(true);
    toast.info('Using template content. Connect your Groq API for AI-powered content.');
  };

  useEffect(() => {
    if (holiday && !generated && !loading) {
      generateContent();
    }
  }, [holiday, generated, loading]);

  const generateContent = async () => {
    if (!holiday || !profile) return;

    setLoading(true);
    try {
      const requestBody = {
        holiday: holiday.name,
        holidayDescription: holiday.description || '',
        businessType: profile.type || 'Business',
        businessName: profile.name || 'My Business',
        businessDescription: profile.description || '',
        targetAudience: profile.targetAudience || 'Customers',
        location: profile.location || 'Local Area',
      };

      console.log('Sending to /api/generate-content:', requestBody);

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('API response status:', response.status);
      
      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        console.error('API error response:', data);
        // Use fallback content on error
        return generateFallbackContent(holiday, profile);
      }
      
      const defaultHashtags = [
        `#${holiday.name.replace(/\s+/g, '')}`,
        '#SmallBusiness',
        '#LocalBusiness',
        '#MarketingTips',
        '#HolidayDeals',
        '#SpecialOffer',
      ];

      const newCaptions = Array.isArray(data.instagram) 
        ? data.instagram 
        : [data.instagram || generateFallbackCaption(holiday, profile)];

      setCaptions(newCaptions);
      setActiveInstagramIndex(0);

      setContent({
        instagram: newCaptions[0],
        email: data.email || `Subject: 🎉 ${holiday.name} Special Offers at ${profile.name}!`,
        hashtags: defaultHashtags,
      });
      
      // Set AI-generated engagement metrics and tips
      if (data.engagement) {
        setEngagement(data.engagement);
      }
      if (data.platformTips) {
        setPlatformTips(data.platformTips);
      }
      
      setGenerated(true);
      
      // Auto-save campaign draft
      try {
        // First check if campaign already exists for this holiday
        let cId: string | undefined;
        try {
          const campaigns = await fetch('/api/campaigns').then(r => r.json()).then(d => d.campaigns);
          const existing = campaigns.find((c: any) => c.holiday_id === holidayId);
          if (existing) {
            cId = existing.id;
            // Update the existing campaign with new content
            await updateCampaign(existing.id, {
              content: {
                instagram: data.instagram || generateFallbackCaption(holiday, profile),
                email: data.email || `Subject: 🎉 ${holiday.name} Special Offers at ${profile.name}!`,
                hashtags: defaultHashtags,
              },
            });
          }
        } catch (e) {
          console.debug('Could not fetch existing campaigns');
        }

        // If no existing campaign, create a new one
        if (!cId) {
          const campaign = await createCampaign(
            holidayId,
            {
              instagram: data.instagram || generateFallbackCaption(holiday, profile),
              email: data.email || `Subject: 🎉 ${holiday.name} Special Offers at ${profile.name}!`,
              hashtags: defaultHashtags,
            },
            platforms,
            null
          );
          cId = campaign.id;
        }

        setCampaignId(cId);
      } catch (error) {
        console.error('Error auto-saving campaign draft:', error);
        // Continue anyway - draft save is not critical
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
      // Use fallback content on network error
      generateFallbackContent(holiday, profile);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (key: keyof typeof platforms) => {
    setPlatforms({ instagram: false, facebook: false, twitter: false, [key]: true });
  };

  const handleCopy = () => {
    const fullText = `${content.instagram}\n\n${content.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  // Platform-specific content handlers
  const getPlatformContent = () => {
    if (platforms.twitter) {
      // Twitter: Limit to 280 characters
      const twitterContent = content.instagram.substring(0, 280);
      return twitterContent.length === 280 ? twitterContent.substring(0, 277) + '...' : twitterContent;
    }
    if (platforms.facebook) {
      // Facebook: Full content
      return content.instagram;
    }
    // Instagram: Default
    return content.instagram;
  };

  const getActivePlatform = () => {
    if (platforms.instagram) return 'instagram';
    if (platforms.facebook) return 'facebook';
    if (platforms.twitter) return 'twitter';
    return 'instagram';
  };

  const handleEditDone = async () => {
    setEditingCaption(false);
    
    // Auto-save edited content
    if (campaignId) {
      try {
        await updateCampaign(campaignId, {
          content,
        });
        toast.success('Caption saved!');
      } catch (error) {
        console.error('Error saving caption:', error);
        toast.error('Failed to save caption');
      }
    }
  };

  const handleSchedule = async () => {
    if (!holiday || !profile) return;

    setSaving(true);
    try {
      // First, check if campaign already exists
      let cId = campaignId;
      
      if (!cId) {
        // Try to fetch existing campaigns to find one for this holiday
        try {
          const campaigns = await fetch('/api/campaigns').then(r => r.json()).then(data => data.campaigns);
          const existing = campaigns.find((c: any) => c.holiday_id === holidayId);
          if (existing) {
            cId = existing.id;
            setCampaignId(existing.id);
          }
        } catch (e) {
          // If fetching fails, continue and try to create
        }
      }
      
      if (!cId) {
        // Create campaign if it doesn't exist
        const campaign = await createCampaign(
          holidayId,
          content,
          platforms,
          format(parseISO(holiday.date), 'yyyy-MM-dd')
        );
        cId = campaign.id;
        setCampaignId(cId);
        toast.success('Campaign created!');
      } else {
        // Update existing campaign with latest content
        await updateCampaign(cId, {
          content,
          platforms,
        });
        toast.success('Campaign updated!');
      }

      // Schedule the campaign
      await scheduleCampaign(
        cId,
        format(parseISO(holiday.date), 'yyyy-MM-dd'),
        platforms
      );

      toast.success('Campaign scheduled successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast.error('Failed to schedule campaign');
    } finally {
      setSaving(false);
    }
  };

  if (!holiday) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-lg font-semibold text-foreground">Holiday not found</p>
            <Button onClick={() => router.push('/holidays')} variant="outline">
              Back to Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays className="w-6 h-6" />
              <h1 className="text-3xl md:text-4xl font-extrabold">{holiday.name}</h1>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                {format(parseISO(holiday.date), 'MMM dd, yyyy')}
              </Badge>
            </div>
            <p className="text-white/90 text-lg">{holiday.description}</p>
          </div>
          <Sparkles className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Caption & Platforms */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI-Generated Caption Card */}
          <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Generated Caption
                </CardTitle>
                <div className="flex gap-2 items-center">
                  {captions.length > 1 && !editingCaption && (
                    <div className="flex items-center bg-primary/10 rounded-md overflow-hidden mr-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const newIndex = activeInstagramIndex > 0 ? activeInstagramIndex - 1 : captions.length - 1;
                          setActiveInstagramIndex(newIndex);
                          setContent(prev => ({ ...prev, instagram: captions[newIndex] }));
                        }}
                        className="px-2 py-0 h-8 rounded-none text-primary hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        &larr;
                      </Button>
                      <span className="text-xs font-semibold text-primary px-1">{activeInstagramIndex + 1}/{captions.length}</span>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const newIndex = activeInstagramIndex < captions.length - 1 ? activeInstagramIndex + 1 : 0;
                          setActiveInstagramIndex(newIndex);
                          setContent(prev => ({ ...prev, instagram: captions[newIndex] }));
                        }}
                        className="px-2 py-0 h-8 rounded-none text-primary hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        &rarr;
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (editingCaption) {
                        handleEditDone();
                      } else {
                        setEditingCaption(true);
                      }
                    }}
                    className="text-primary hover:bg-primary/10"
                  >
                    {editingCaption ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {editingCaption ? 'Done' : 'Edit'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => generateContent()}
                    disabled={loading}
                    className="text-primary hover:bg-primary/10"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-8 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium">Generating content...</p>
                </div>
              ) : (
                <>
                  {editingCaption ? (
                    <textarea
                      value={content.instagram}
                      onChange={(e) => setContent({ ...content, instagram: e.target.value })}
                      className="w-full bg-background/60 border border-primary/50 rounded-lg p-4 min-h-40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Edit your caption here..."
                    />
                  ) : (
                    <div className="bg-background/60 border border-white/10 rounded-lg p-4 min-h-32">
                      <p className="text-foreground whitespace-pre-wrap">{content.instagram}</p>
                    </div>
                  )}

                  {/* Hashtags */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Suggested Hashtags</p>
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCopy}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Caption + Hashtags"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Select Platforms Card */}
          <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Select Platforms</CardTitle>
              <CardDescription>Choose where you want to post this content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
                { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
                { key: 'twitter', label: 'Twitter', icon: TwitterIcon },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handlePlatformChange(key as keyof typeof platforms)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    platforms[key as keyof typeof platforms]
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${platforms[key as keyof typeof platforms] ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium">{label}</span>
                  </div>
                  {platforms[key as keyof typeof platforms] && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSchedule}
              disabled={saving}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Schedule for {format(parseISO(holiday.date), 'MMM dd')}
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => router.push('/holidays')}
            >
              Back to Calendar
            </Button>
          </div>
        </div>

        {/* Right Column - Preview & Engagement */}
        <div className="space-y-6">
          {/* Post Preview */}
          <Card className="border-white/20 bg-card/60 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Post Preview</CardTitle>
                <CardDescription>How your post will look</CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFullscreenPreview(true)}
                className="text-primary hover:bg-primary/10"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 min-h-96 flex flex-col">
                {getActivePlatform() === 'instagram' && (
                  <>
                    {/* Instagram Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{profile?.name || 'Business'}</p>
                        <p className="text-white/60 text-xs">{profile?.location || 'Location'}</p>
                      </div>
                      <p className="text-white/40 text-xs">...</p>
                    </div>

                    {/* Instagram Image */}
                    <div className="my-4 bg-white/10 rounded-lg aspect-square flex items-center justify-center border border-white/20">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-2" />
                        <p className="text-white/40 text-xs">Your Holiday Image</p>
                      </div>
                    </div>

                    {/* Instagram Caption & Hashtags */}
                    <div className="space-y-3">
                      <p className="text-white text-sm leading-relaxed line-clamp-4">
                        {content.instagram}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-primary text-xs">
                            {tag}
                          </span>
                        ))}
                        {content.hashtags.length > 3 && (
                          <span className="text-white/40 text-xs">+{content.hashtags.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Instagram Engagement Icons */}
                    <div className="mt-4 flex gap-4 text-white/60 text-sm pt-3 border-t border-white/10">
                      <span>♥️ Like</span>
                      <span>💬 Comment</span>
                      <span>↗️ Share</span>
                    </div>
                  </>
                )}

                {getActivePlatform() === 'facebook' && (
                  <>
                    {/* Facebook Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{profile?.name || 'Business'}</p>
                        <p className="text-white/60 text-xs">2 hours ago</p>
                      </div>
                    </div>

                    {/* Facebook Caption (comes before image) */}
                    <div className="py-3">
                      <p className="text-white text-sm leading-relaxed line-clamp-3">
                        {content.instagram}
                      </p>
                    </div>

                    {/* Facebook Image */}
                    <div className="my-3 bg-white/10 rounded-lg aspect-video flex items-center justify-center border border-white/20">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-2" />
                        <p className="text-white/40 text-xs">Your Holiday Image</p>
                      </div>
                    </div>

                    {/* Facebook Hashtags */}
                    <div className="py-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-blue-400 text-xs">
                            {tag}
                          </span>
                        ))}
                        {content.hashtags.length > 2 && (
                          <span className="text-white/40 text-xs">+{content.hashtags.length - 2} more</span>
                        )}
                      </div>
                    </div>

                    {/* Facebook Engagement Buttons */}
                    <div className="mt-3 flex gap-4 text-white/60 text-xs pt-3 border-t border-white/10">
                      <span className="flex-1 text-center cursor-pointer hover:text-blue-400">👍 Like</span>
                      <span className="flex-1 text-center cursor-pointer hover:text-blue-400">💬 Comment</span>
                      <span className="flex-1 text-center cursor-pointer hover:text-blue-400">↗️ Share</span>
                    </div>
                  </>
                )}

                {getActivePlatform() === 'twitter' && (
                  <>
                    {/* Twitter Header */}
                    <div className="flex gap-3 pb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold text-sm">{profile?.name || 'Business'}</p>
                          <p className="text-white/60 text-xs">@{profile?.name?.toLowerCase().replace(/\s+/g, '') || 'business'}</p>
                        </div>
                        <p className="text-white/60 text-xs">now</p>
                      </div>
                    </div>

                    {/* Twitter Content (280 char limit) */}
                    <div className="py-3 border-b border-white/10">
                      <p className="text-white text-sm leading-relaxed">
                        {getPlatformContent()}
                      </p>
                      {content.instagram.length > 280 && (
                        <p className="text-xs text-orange-400 mt-2">⚠️ Text exceeds 280 chars</p>
                      )}
                    </div>

                    {/* Twitter Hashtags (compact) */}
                    <div className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((tag) => (
                          <span key={tag} className="text-blue-400 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Twitter Engagement */}
                    <div className="mt-3 flex gap-6 text-white/60 text-xs pt-3 border-t border-white/10 justify-around">
                      <span className="cursor-pointer hover:text-blue-400">💬</span>
                      <span className="cursor-pointer hover:text-green-400">♻️</span>
                      <span className="cursor-pointer hover:text-red-400">♥️</span>
                      <span className="cursor-pointer hover:text-blue-400">📤</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Predicted Engagement */}
          <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Predicted Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/60 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Expected Reach</p>
                  <p className="text-lg font-bold text-foreground">{engagement.reach.min.toLocaleString()} - {engagement.reach.max.toLocaleString()}</p>
                </div>
                <div className="bg-background/60 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Estimated Likes</p>
                  <p className="text-lg font-bold text-foreground">{engagement.likes.min} - {engagement.likes.max}</p>
                </div>
                <div className="bg-background/60 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Expected Comments</p>
                  <p className="text-lg font-bold text-foreground">{engagement.comments.min} - {engagement.comments.max}</p>
                </div>
                <div className="bg-background/60 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Potential Shares</p>
                  <p className="text-lg font-bold text-foreground">{engagement.shares.min} - {engagement.shares.max}</p>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-xs font-semibold text-accent mb-2">💡 Pro Tip</p>
                <p className="text-xs text-accent/80 leading-relaxed">
                  {platformTips[getActivePlatform() as keyof typeof platformTips]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Post Preview - Full View</h2>
              <button
                onClick={() => setFullscreenPreview(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Social Media Post */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl max-w-md mx-auto">
                {getActivePlatform() === 'instagram' && (
                  <>
                    {/* Instagram Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{profile?.name || 'Business'}</p>
                        <p className="text-white/60 text-sm">{profile?.location || 'Location'}</p>
                      </div>
                      <span className="text-white/40 text-xs">•••</span>
                    </div>

                    {/* Instagram Image */}
                    <div className="bg-white/5 aspect-square flex items-center justify-center border-t border-b border-white/10">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-2" />
                        <p className="text-white/40 text-sm">Your Holiday Image</p>
                      </div>
                    </div>

                    {/* Instagram Caption & Hashtags */}
                    <div className="p-4 border-t border-white/10">
                      <p className="text-white text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                        {content.instagram}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((tag) => (
                          <span key={tag} className="text-primary text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instagram Like/Comment/Share */}
                    <div className="p-4 border-t border-white/10 flex gap-6 text-white/60 text-sm">
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        ❤️ Like
                      </button>
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        💬 Comment
                      </button>
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        ↗️ Share
                      </button>
                    </div>
                  </>
                )}

                {getActivePlatform() === 'facebook' && (
                  <>
                    {/* Facebook Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-blue-900/50">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{profile?.name || 'Business'}</p>
                        <p className="text-white/60 text-xs">3 hours ago</p>
                      </div>
                    </div>

                    {/* Facebook Text */}
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-3">
                        {content.instagram}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((tag) => (
                          <span key={tag} className="text-blue-400 text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Facebook Image */}
                    <div className="bg-white/5 aspect-video flex items-center justify-center border-y border-white/10">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-2" />
                        <p className="text-white/40 text-sm">Your Holiday Image</p>
                      </div>
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
                        ↗️ Share
                      </button>
                    </div>
                  </>
                )}

                {getActivePlatform() === 'twitter' && (
                  <>
                    {/* Twitter Header */}
                    <div className="flex gap-3 p-4 border-b border-white/10">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {profile?.name?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold">{profile?.name || 'Business'}</p>
                          <p className="text-white/60 text-sm">@{profile?.name?.toLowerCase().replace(/\s+/g, '') || 'business'}</p>
                          <p className="text-white/40 text-sm">·</p>
                          <p className="text-white/60 text-sm">2h</p>
                        </div>
                      </div>
                      <span className="text-white/40 text-sm">•••</span>
                    </div>

                    {/* Twitter Content */}
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white text-sm leading-relaxed mb-3">
                        {getPlatformContent()}
                      </p>
                      {content.instagram.length > 280 && (
                        <p className="text-xs text-orange-400 mb-2">⚠️ Original text exceeds 280 character limit</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((tag) => (
                          <span key={tag} className="text-blue-400 text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Twitter Engagement */}
                    <div className="p-4 flex gap-8 text-white/40 text-sm justify-around">
                      <button className="hover:text-blue-400 transition-colors">💬</button>
                      <button className="hover:text-green-400 transition-colors">♻️</button>
                      <button className="hover:text-red-400 transition-colors">♥️</button>
                      <button className="hover:text-blue-400 transition-colors">📤</button>
                    </div>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {/* Engagement Metrics */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Predicted Engagement</h3>
                  <div className="space-y-3">
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-muted-foreground font-semibold mb-2">Expected Reach</p>
                      <p className="text-2xl font-bold text-foreground">{engagement.reach.min.toLocaleString()} - {engagement.reach.max.toLocaleString()}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-muted-foreground font-semibold mb-2">Estimated Likes</p>
                      <p className="text-2xl font-bold text-foreground">{engagement.likes.min} - {engagement.likes.max}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-muted-foreground font-semibold mb-2">Expected Comments</p>
                      <p className="text-2xl font-bold text-foreground">{engagement.comments.min} - {engagement.comments.max}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                      <p className="text-xs text-muted-foreground font-semibold mb-2">Potential Shares</p>
                      <p className="text-2xl font-bold text-foreground">{engagement.shares.min} - {engagement.shares.max}</p>
                    </div>
                  </div>
                </div>

                {/* Content & Pro Tips */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Details</h3>
                  
                  <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">Holiday</p>
                    <p className="text-foreground font-medium">{holiday?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(parseISO(holiday?.date!), 'EEEE, MMMM dd, yyyy')}</p>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border border-white/10">
                    <p className="text-sm font-semibold text-foreground mb-2">📱 Posting for: {getActivePlatform().charAt(0).toUpperCase() + getActivePlatform().slice(1)}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {platformTips[getActivePlatform() as keyof typeof platformTips]}
                    </p>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-sm font-semibold text-accent mb-2">💡 AI-Generated Recommendations</p>
                    <p className="text-sm text-accent/80 leading-relaxed">
                      These engagement predictions and tips are AI-generated based on your holiday, business type, and target audience. Adjust your posting strategy based on your historical performance data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => setFullscreenPreview(false)}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

