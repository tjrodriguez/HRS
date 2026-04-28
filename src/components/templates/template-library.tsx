"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, BookOpen, X } from "lucide-react";
import { Template } from "@/utils/data";
import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateCard } from "./template-card";

interface TemplateLibraryProps {
  templates: Template[];
  onRefresh: () => void;
  onUseTemplate?: (content: string) => void;
}

export function TemplateLibrary({ templates, onRefresh, onUseTemplate }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.holiday_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      const matchesFavorite = !showFavoritesOnly || template.is_favorite;

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [templates, searchQuery, selectedCategory, showFavoritesOnly]);

  const favoriteCount = templates.filter((t) => t.is_favorite).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || showFavoritesOnly;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
          <p className="text-sm text-gray-500">Total Templates</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-red-500">{favoriteCount}</p>
          <p className="text-sm text-gray-500">Favorites</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">
            {templates.reduce((sum, t) => sum + t.usage_count, 0)}
          </p>
          <p className="text-sm text-gray-500">Total Uses</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">
            {new Set(templates.map((t) => t.category)).size}
          </p>
          <p className="text-sm text-gray-500">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, content, or holiday..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            >
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
              showFavoritesOnly
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Favorites Only
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Clear all
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "Save your first template from the post creator to get started."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUpdate={onRefresh}
                onUse={onUseTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

