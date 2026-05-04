"use client";
import * as React from 'react'
import { useBusiness, type Profile } from '@/context/BusinessContext';
import { updateProfile } from '@/utils/data';
import { Building2, MapPin, Users, Save, Loader2, Palette, Globe, Phone, Mail, Clock, Sparkles, Megaphone, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotification } from '@/components/notifications';

export function BusinessProfile(): React.ReactElement {
  const { addNotification } = useNotification();
  const { profile, setProfile, refetch } = useBusiness();
  const [formData, setFormData] = useState<Profile>(profile || {
    name: '',
    type: 'Coffee Shop',
    description: '',
    location: '',
    targetAudience: '',
    niche: 'Retail',
    tone: 'Friendly',
    websiteUrl: '',
    phone: '',
    contactEmail: '',
    businessHours: {},
    brandColors: [],
    brandVoice: '',
    logoUrl: '',
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

  const nicheOptions = [
    'Retail',
    'Food & Beverage',
    'Services',
    'Technology',
    'Health & Wellness',
    'Education',
    'Entertainment',
    'Professional Services',
    'Non-Profit',
    'Other',
  ];

  const toneOptions = [
    'Friendly',
    'Professional',
    'Playful',
    'Luxury',
    'Casual',
    'Bold',
    'Warm',
    'Sophisticated',
  ];

  const [isSaving, setIsSaving] = useState(false);

  // Sync state when profile is loaded from database
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleBusinessHoursChange = (day: string, hours: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: hours,
      },
    }));
  };

  const handleBrandColorChange = (index: number, color: string) => {
    setFormData(prev => {
      const current = prev.brandColors || [];
      const updated = [...current];
      updated[index] = color;
      return { ...prev, brandColors: updated };
    });
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
        niche: formData.niche,
        tone: formData.tone,
        website_url: formData.websiteUrl,
        phone: formData.phone,
        contact_email: formData.contactEmail,
        business_hours: formData.businessHours,
        brand_colors: formData.brandColors,
        brand_voice: formData.brandVoice,
        logo_url: formData.logoUrl,
      });

      if (updated || process.env.NODE_ENV === 'development') {
        setProfile(formData);
        await refetch();
        addNotification('Business profile updated successfully!', 'success');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating business profile:', error);
      addNotification('Failed to save business profile.', 'error');
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Details */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Business Details</h3>
          </div>

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

          {/* Business Type & Niche Row */}
          <div className="grid md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Industry Niche
              </label>
              <select
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                {nicheOptions.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Helps AI understand your market segment</p>
            </div>
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
              placeholder="Tell us about your business, what you offer, and what makes you unique..."
              required
            />
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Contact & Location</h3>
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

          {/* Contact Info Row */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="https://yourbusiness.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="hello@yourbusiness.com"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Business Hours
            </label>
            <textarea
              value={Object.entries(formData.businessHours || {})
                .map(([day, hours]) => `${day}: ${hours}`)
                .join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                const hours: Record<string, string> = {};
                lines.forEach(line => {
                  const [day, ...hoursParts] = line.split(':');
                  if (day && hoursParts.length > 0) {
                    hours[day.trim()] = hoursParts.join(':').trim();
                  }
                });
                setFormData({ ...formData, businessHours: hours });
              }}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none font-mono text-sm"
              rows={3}
              placeholder="Mon-Fri: 9AM - 6PM&#10;Sat: 10AM - 4PM&#10;Sun: Closed"
            />
            <p className="text-xs text-muted-foreground mt-1">One line per day range, format: &quot;Day: Hours&quot;</p>
          </div>
        </div>

        {/* Section 3: Brand & AI Settings */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Brand & AI Settings</h3>
          </div>

          {/* Tone & Logo Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Megaphone className="w-4 h-4 inline mr-2" />
                Content Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                {toneOptions.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">How AI should write your captions</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="https://yourcdn.com/logo.png"
              />
            </div>
          </div>

          {/* Brand Colors */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Palette className="w-4 h-4 inline mr-2" />
              Brand Colors
            </label>
            <div className="flex gap-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(formData.brandColors?.[index] || '#3b82f6').replace('#', '') ? (formData.brandColors?.[index] || '#3b82f6') : '#3b82f6'}
                    onChange={(e) => handleBrandColorChange(index, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-input"
                  />
                  <input
                    type="text"
                    value={formData.brandColors?.[index] || ''}
                    onChange={(e) => handleBrandColorChange(index, e.target.value)}
                    className="w-24 px-2 py-2 border border-input rounded text-sm bg-background text-foreground"
                    placeholder="#3b82f6"
                    maxLength={7}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Up to 3 brand colors for visual identity</p>
          </div>

          {/* Brand Voice */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Brand Voice / Personality
            </label>
            <textarea
              value={formData.brandVoice || ''}
              onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
              rows={3}
              placeholder="Describe your brand personality. Example: We're a quirky coffee shop that loves puns, believes in sustainable sourcing, and treats every customer like family..."
            />
            <p className="text-xs text-muted-foreground mt-1">This helps AI generate captions that match your brand personality</p>
          </div>

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
        <h3 className="font-bold text-foreground mb-3">How Your Profile Improves AI Content</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✨ <span className="font-semibold text-foreground">Industry Niche:</span> Helps AI understand your market for more relevant captions</p>
          <p>🎨 <span className="font-semibold text-foreground">Content Tone:</span> Controls how formal, playful, or professional your captions sound</p>
          <p>📱 <span className="font-semibold text-foreground">Active Platforms:</span> AI optimizes caption length and style for each platform</p>
          <p>🗣️ <span className="font-semibold text-foreground">Brand Voice:</span> Adds your unique personality to every generated caption</p>
        </div>
      </div>
    </div>
  );
}
