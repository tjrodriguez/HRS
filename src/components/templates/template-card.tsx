"use client";

import * as React from "react";
import { useState } from "react";
import { Heart, Copy, Trash2, Sparkles, Tag, Hash } from "lucide-react";
import { toast } from "sonner";
import { Template } from "@/utils/data";
import { toggleFavoriteTemplate, incrementTemplateUsage, deleteTemplate } from "@/lib/templates";

interface TemplateCardProps {
  template: Template;
  onUpdate: () => void;
  onUse?: (content: string) => void;
}

export function TemplateCard({ template, onUpdate, onUse }: TemplateCardProps): React.ReactElement {
  const [isFavorite, setIsFavorite] = useState(template.is_favorite);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    const success = await toggleFavoriteTemplate(template.id, newValue);
    if (success) {
      toast.success(newValue ? "Added to favorites" : "Removed from favorites");
      onUpdate();
    } else {
      setIsFavorite(!newValue);
      toast.error("Failed to update favorite");
    }
  };

  const handleCopy = async () => {
    const fullText = [template.content, template.hashtags.join(" ")]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    await incrementTemplateUsage(template.id, template.usage_count);
    setTimeout(() => setCopied(false), 2000);
    onUpdate();
  };

  const handleUse = () => {
    if (onUse) {
      onUse(template.content);
      incrementTemplateUsage(template.id, template.usage_count);
      toast.success("Template applied!");
      onUpdate();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    setIsDeleting(true);
    const success = await deleteTemplate(template.id);
    if (success) {
      toast.success("Template deleted");
      onUpdate();
    } else {
      toast.error("Failed to delete template");
    }
    setIsDeleting(false);
  };

  const categoryColors: Record<string, string> = {
    holiday: "bg-purple-100 text-purple-700",
    promotional: "bg-blue-100 text-blue-700",
    engagement: "bg-green-100 text-green-700",
    announcement: "bg-orange-100 text-orange-700",
    seasonal: "bg-pink-100 text-pink-700",
    general: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate pr-2">{template.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                categoryColors[template.category] || categoryColors.general
              }`}
            >
              {template.category}
            </span>
            {template.holiday_name && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="w-3 h-3" />
                {template.holiday_name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
          {template.content}
        </p>
      </div>

      {/* Hashtags */}
      {template.hashtags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Hash className="w-3 h-3 text-gray-400" />
          {template.hashtags.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {template.hashtags.length > 5 && (
            <span className="text-xs text-gray-400">+{template.hashtags.length - 5}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-3">
          {template.tone && <span>Tone: {template.tone}</span>}
          {template.platforms.length > 0 && (
            <span>{template.platforms.join(", ")}</span>
          )}
        </div>
        <span>Used {template.usage_count} time{template.usage_count !== 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {onUse && (
          <button
            onClick={handleUse}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Use Template
          </button>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
          title="Copy to clipboard"
        >
          <Copy className={`w-4 h-4 ${copied ? "text-green-600" : ""}`} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete template"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

