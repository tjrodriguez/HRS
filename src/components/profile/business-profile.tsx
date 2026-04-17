"use client";
import { useBusiness, type Profile } from '@/context/BusinessContext';
import { updateProfile } from '@/utils/data';
import { Building2, MapPin, Users, Globe, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function BusinessProfile() {
  const { profile, setProfile } = useBusiness();
  const [formData, setFormData] = useState<Profile>(profile || {
    name: '',
    type: 'Coffee Shop',
    description: '',
    location: '',
    targetAudience: '',
    socialPlatforms: ['Instagram'],
    niche: 'Retail',
    tone: 'Friendly',
  });

  const businessTypes = [
    'Coffee Shop',
    'Restaurant',
    'Retail Store',
    'Bakery',
    'Boutique',
    'Salon & Spa',
    'Fitness Studio',
    'Bookstore',
    'Florist',
    'Other',
  ];

  const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'];

  const [isSaving, setIsSaving] = useState(false);

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev: Profile) => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.includes(platform)
        ? prev.socialPlatforms.filter((p: string) => p !== platform)
        : [...prev.socialPlatforms, platform]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const updated = await updateProfile({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        target_audience: formData.targetAudience,
        social_platforms: formData.socialPlatforms,
        niche: formData.niche,
        tone: formData.tone,
      });

      if (updated || process.env.NODE_ENV === 'development') {
        setProfile(formData);
        toast.success('Business profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('Failed to save business profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl p-6 shadow-md border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">Business Profile</h2>
        <p className="text-muted-foreground">Customize your business details to get personalized AI suggestions</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-md border border-border space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            <Building2 className="w-4 h-4 inline mr-2" />
            Business Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            placeholder="e.g., Brew & Bean Coffee Shop"
            required
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Business Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            required
          >
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Business Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
            rows={4}
            placeholder="Tell us about your business..."
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            placeholder="e.g., San Francisco, CA"
            required
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Target Audience
          </label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            placeholder="e.g., Coffee enthusiasts, remote workers, students"
            required
          />
        </div>

        {/* Social Platforms */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            <Globe className="w-4 h-4 inline mr-2" />
            Social Media Platforms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platforms.map(platform => (
              <button
                key={platform}
                type="button"
                onClick={() => handlePlatformToggle(platform)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.socialPlatforms.includes(platform)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-input text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{platform}</span>
                  {formData.socialPlatforms.includes(platform) && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Select all platforms where you're active</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:from-primary/90 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
        <h3 className="font-bold text-foreground mb-3">Why is this important?</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✨ <span className="font-semibold text-foreground">Personalized AI Suggestions:</span> Get captions and hashtags tailored to your business type</p>
          <p>🎯 <span className="font-semibold text-foreground">Relevant Holidays:</span> Discover holidays that matter most to your audience</p>
          <p>📊 <span className="font-semibold text-foreground">Better Analytics:</span> Track performance across your active platforms</p>
          <p>💡 <span className="font-semibold text-foreground">Smart Recommendations:</span> Receive tips specific to your industry</p>
        </div>
      </div>
    </div>
  );
}
