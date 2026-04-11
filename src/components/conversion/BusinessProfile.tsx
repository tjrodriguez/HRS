"use client";
import { useBusiness } from '../context/BusinessContext';
import { Building2, MapPin, Users, Globe, Save, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function BusinessProfile() {
  const { profile, setProfile } = useBusiness();
  const [formData, setFormData] = useState(profile || {
    name: '',
    type: 'Coffee Shop',
    description: '',
    location: '',
    targetAudience: '',
    socialPlatforms: ['Instagram'],
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

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.includes(platform)
        ? prev.socialPlatforms.filter(p => p !== platform)
        : [...prev.socialPlatforms, platform]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    toast.success('Business profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Profile</h2>
        <p className="text-gray-600">Customize your business details to get personalized AI suggestions</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-2" />
            Business Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Brew & Bean Coffee Shop"
            required
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Tell us about your business..."
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., San Francisco, CA"
            required
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Target Audience
          </label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Coffee enthusiasts, remote workers, students"
            required
          />
        </div>

        {/* Social Platforms */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{platform}</span>
                  {formData.socialPlatforms.includes(platform) && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Select all platforms where you're active</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">Why is this important?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✨ <span className="font-semibold">Personalized AI Suggestions:</span> Get captions and hashtags tailored to your business type</p>
          <p>🎯 <span className="font-semibold">Relevant Holidays:</span> Discover holidays that matter most to your audience</p>
          <p>📊 <span className="font-semibold">Better Analytics:</span> Track performance across your active platforms</p>
          <p>💡 <span className="font-semibold">Smart Recommendations:</span> Receive tips specific to your industry</p>
        </div>
      </div>
    </div>
  );
}
