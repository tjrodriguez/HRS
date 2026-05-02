"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Filter, Star, BookOpen, X, ArrowUpDown, Plus, Sparkles } from "lucide-react";
import { Template } from "@/utils/data";
import { TEMPLATE_CATEGORIES } from "@/lib/templates";
import { TemplateCard } from "./template-card";

interface TemplateLibraryProps {
  templates: Template[];
  onRefresh: () => void;
  onUseTemplate?: (content: string) => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Date (Newest First)" },
  { value: "oldest", label: "Date (Oldest First)" },
  { value: "usage", label: "Usage Count (High to Low)" },
  { value: "name", label: "Name (A-Z)" },
];

export function TemplateLibrary({ templates, onRefresh, onUseTemplate }: TemplateLibraryProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const filteredTemplates = useMemo(() => {
    let result = templates.filter((template) => {
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

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "usage":
        result.sort((a, b) => b.usage_count - a.usage_count);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [templates, searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  const favoriteCount = templates.filter((t) => t.is_favorite).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowFavoritesOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || showFavoritesOnly || sortBy !== "newest";

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <p className="text-2xl font-bold text-foreground">{templates.length}</p>
          <p className="text-sm text-muted-foreground">Total Templates</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <p className="text-2xl font-bold text-red-500">{favoriteCount}</p>
          <p className="text-sm text-muted-foreground">Favorites</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <p className="text-2xl font-bold text-primary">
            {templates.reduce((sum, t) => sum + t.usage_count, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Total Uses</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <p className="text-2xl font-bold text-accent">
            {new Set(templates.map((t) => t.category)).size}
          </p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates by name, content, or holiday..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-background"
            >
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-background"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
                : "border-border text-muted-foreground hover:bg-accent/50"
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Favorites Only
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
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
          <p className="text-sm text-muted-foreground">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center shadow-sm border border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "Create content for any holiday and save it as a template to build your library."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/holidays"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Your First Post
              </Link>
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

