"use client";
import { useBusiness, Holiday } from '@/context/BusinessContext';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, Copy, Image as ImageIcon, RefreshCw, Calendar, TrendingUp, Check, Loader } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const generateHashtags = (holiday: Holiday, businessType: string): string[] => {
  const holidayHashtags = [
    `#${holiday.name.replace(/\s+/g, '')}`,
    `#${holiday.name.replace(/\s+/g, '')}2026`,
    `#${(holiday.category || '').replace(/\s+/g, '')}`,
  ];

  const businessHashtags: Record<string, string[]> = {
    'Coffee Shop': ['#CoffeeShop', '#CoffeeLover', '#SpecialtyCoffee', '#LocalCoffee', '#CoffeeTime', '#CafeCulture'],
    'Restaurant': ['#Restaurant', '#FoodieLife', '#FarmToTable', '#LocalEats', '#DineLocal', '#FoodLover'],
    'Retail Store': ['#ShopLocal', '#SmallBusiness', '#RetailTherapy', '#LocalShop', '#SupportLocal'],
  };

  const typeHashtags = businessHashtags[businessType] || businessHashtags['Coffee Shop'];
  const generalHashtags = ['#SmallBusiness', '#SupportLocal', '#CommunityFirst'];

  return [...holidayHashtags, ...typeHashtags.slice(0, 4), ...generalHashtags.slice(0, 2)];
};

export function PostCreator() {
  const { holidayId } = useParams();
  const router = useRouter();
  const { holidays, profile } = useBusiness();
  
  const holiday = holidays.find((h: Holiday) => h.id === Number(holidayId));
  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
  const [copied, setCopied] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate captions using AI
  useEffect(() => {
    const generateAICaptions = async () => {
      if (!holiday || !profile) return;

      try {
        setIsGenerating(true);
        setError(null);

        const response = await fetch('/api/generate-caption', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            holidayName: holiday.name,
            businessName: profile.name,
            businessType: profile.type || 'Retail',
            businessNiche: profile.niche,
            tone: profile.tone,
            targetAudience: profile.targetAudience,
            platform: selectedPlatforms[0] || 'Instagram',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate captions');
        }

        const data = await response.json();
        setCaptions(data.captions || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate captions';
        setError(errorMessage);
        toast.error(errorMessage);
        // Fallback to basic templates
        setCaptions([
          `🎉 Celebrate ${holiday.name} with us! 🌟 Visit us today for special offers and exclusive deals.`,
          `Happy ${holiday.name}! Join us in the celebration. We have something special prepared for you. 💫`,
          `This ${holiday.name}, experience something amazing at ${profile.name}. Don't miss out! ✨`,
        ]);
      } finally {
        setIsGenerating(false);
      }
    };

    generateAICaptions();
  }, [holiday, profile, selectedPlatforms]);

  if (!holiday || !profile) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-md">
        <p className="text-gray-600">Holiday not found</p>
      </div>
    );
  }

  const hashtags = generateHashtags(holiday, profile.type || '');
  const currentCaption = captions[selectedCaptionIndex] || '';

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedCaptions = [...captions];
    updatedCaptions[selectedCaptionIndex] = e.target.value;
    setCaptions(updatedCaptions);
  };

  const handleRegenerateCaption = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          holidayName: holiday.name,
          businessName: profile.name,
          businessType: profile.type || 'Retail',
          businessNiche: profile.niche,
          tone: profile.tone,
          targetAudience: profile.targetAudience,
          platform: selectedPlatforms[0] || 'Instagram',
          previousCaptions: captions,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate');
      const data = await response.json();
      setCaptions(data.captions || []);
      setSelectedCaptionIndex(0);
      toast.success('New captions generated!');
    } catch (err) {
      toast.error('Failed to regenerate captions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    const fullPost = `${currentCaption}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullPost);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSchedulePost = () => {
    toast.success(`Post scheduled for ${holiday.name}!`);
    setTimeout(() => router.push('/'), 1500);
  };

  const platformIcons = {
    Instagram: ImageIcon,
    Facebook: ImageIcon,
    Twitter: ImageIcon,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{holiday.name}</h2>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
            {format(parseISO(holiday.date), 'MMM dd, yyyy')}
          </span>
        </div>
        <p className="text-blue-100">{holiday.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Post Creator */}
        <div className="space-y-6">
          {/* AI Caption Generator */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI-Generated Caption
                {captions.length > 1 && (
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Variation {selectedCaptionIndex + 1} of {captions.length}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {captions.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedCaptionIndex((i) => (i > 0 ? i - 1 : captions.length - 1))}
                      className="px-2 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => setSelectedCaptionIndex((i) => (i < captions.length - 1 ? i + 1 : 0))}
                      className="px-2 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold"
                    >
                      &rarr;
                    </button>
                  </>
                )}
                <button
                  onClick={handleRegenerateCaption}
                  className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 text-sm"
                  disabled={isGenerating}
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Generate New'}
                </button>
              </div>
            </div>
            
            <textarea
              value={currentCaption}
              onChange={handleCaptionChange}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Your caption will appear here..."
            />
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-semibold mb-2">Suggested Hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopyToClipboard}
              className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Caption + Hashtags'}
            </button>
          </div>

          {/* Platform Selection */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Select Platforms</h3>
            <div className="space-y-3">
              {profile.socialPlatforms.map((platform: string) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons];
                const isSelected = selectedPlatforms.includes(platform);
                
                return (
                  <button
                    key={platform}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPlatforms(prev => prev.filter(p => p !== platform));
                      } else {
                        setSelectedPlatforms(prev => [...prev, platform]);
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {Icon && <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />}
                    <span className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}>
                      {platform}
                    </span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSchedulePost}
              disabled={selectedPlatforms.length === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule for {format(parseISO(holiday.date), 'MMM dd')}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Post Preview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">Post Preview</h3>
              <p className="text-sm text-gray-600">How your post will look</p>
            </div>
            
            {/* Instagram-style preview */}
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{profile.name}</p>
                    <p className="text-xs text-gray-500">{profile.location}</p>
                  </div>
                </div>
                
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-semibold">Your Holiday Image</p>
                    <p className="text-sm text-gray-400 mt-1">Add a festive photo here</p>
                  </div>
                </div>
                
                {/* Caption */}
                <div className="p-4">
                  <p className="text-sm mb-3">
                    <span className="font-semibold">{profile.name}</span> {currentCaption}
                  </p>
                  <p className="text-sm text-blue-600">{hashtags.join(' ')}</p>
                  <p className="text-xs text-gray-400 mt-3">{format(parseISO(holiday.date), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Predictions */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Predicted Engagement
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Expected Reach</span>
                <span className="font-bold text-green-700">3,500 - 5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Estimated Likes</span>
                <span className="font-bold text-green-700">250 - 400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Expected Comments</span>
                <span className="font-bold text-green-700">30 - 50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Potential Shares</span>
                <span className="font-bold text-green-700">40 - 70</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">
                💡 <span className="font-semibold">Pro Tip:</span> Post between 9-11 AM for 35% higher engagement based on your audience data.
              </p>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Use high-quality, relevant images for {holiday.name}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Engage with comments within the first hour</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Tag relevant accounts and locations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Share stories to boost main post visibility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
