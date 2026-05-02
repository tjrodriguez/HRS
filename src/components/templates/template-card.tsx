"use client";

import * as React from "react";
import { useState } from "react";
import { Heart, Copy, Trash2, Sparkles, Tag, Hash, X, ImageIcon, Maximize2 } from "lucide-react";
import { useNotification } from "@/components/notifications";
import { Template } from "@/utils/data";
import { toggleFavoriteTemplate, incrementTemplateUsage, deleteTemplate } from "@/lib/templates";

interface TemplateCardProps {
  template: Template;
  onUpdate: () => void;
  onUse?: (content: string) => void;
}

export function TemplateCard({ template, onUpdate, onUse }: TemplateCardProps): React.ReactElement {
  const { addNotification } = useNotification();
  const [isFavorite, setIsFavorite] = useState(template.is_favorite);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleToggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    const success = await toggleFavoriteTemplate(template.id, newValue);
    if (success) {
      addNotification(newValue ? "Added to favorites" : "Removed from favorites", "success");
      onUpdate();
    } else {
      setIsFavorite(!newValue);
      addNotification("Failed to update favorite", "error");
    }
  };

  const handleCopy = async () => {
    const fullText = [template.content, template.hashtags.join(" ")]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    addNotification("Copied to clipboard!", "success");
    await incrementTemplateUsage(template.id, template.usage_count);
    setTimeout(() => setCopied(false), 2000);
    onUpdate();
  };

  const handleUse = () => {
    if (onUse) {
      onUse(template.content);
      incrementTemplateUsage(template.id, template.usage_count);
      addNotification("Template applied!", "success");
      onUpdate();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    setIsDeleting(true);
    const success = await deleteTemplate(template.id);
    if (success) {
      addNotification("Template deleted", "success");
      onUpdate();
    } else {
      addNotification("Failed to delete template", "error");
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
    <div className="bg-card rounded-xl shadow-md border border-border p-5 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate pr-2">{template.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                categoryColors[template.category] || categoryColors.general
              }`}
            >
              {template.category}
            </span>
            {template.holiday_name && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
              : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Image Thumbnail */}
      {template.image_url && (
        <div className="mb-3">
          <div 
            className="relative group/image cursor-pointer rounded-lg overflow-hidden border border-border"
            onClick={() => setShowImagePreview(true)}
          >
            <img 
              src={template.image_url} 
              alt="Template" 
              className="w-full h-32 object-cover transition-transform group-hover/image:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover/image:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <p className="text-sm text-foreground/80 line-clamp-3 whitespace-pre-wrap">
          {template.content}
        </p>
      </div>

      {/* Hashtags */}
      {template.hashtags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Hash className="w-3 h-3 text-muted-foreground" />
          {template.hashtags.slice(0, 5).map((tag, idx) => (
            <span key={idx} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {template.hashtags.length > 5 && (
            <span className="text-xs text-muted-foreground">+{template.hashtags.length - 5}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-3">
          {template.tone && <span>Tone: {template.tone}</span>}
          {template.platforms.length > 0 && (
            <span>{template.platforms.join(", ")}</span>
          )}
        </div>
        <span>Used {template.usage_count} time{template.usage_count !== 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        {onUse && (
          <button
            onClick={handleUse}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Use Template
          </button>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-semibold"
          title="Copy to clipboard"
        >
          <Copy className={`w-4 h-4 ${copied ? "text-green-600" : ""}`} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete template"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Full Image Preview Modal */}
      {showImagePreview && template.image_url && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-card rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{template.name}</h3>
              </div>
              <button
                onClick={() => setShowImagePreview(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <img 
                src={template.image_url} 
                alt="Template Preview" 
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              
              {/* Caption Preview */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                  {template.content}
                </p>
                {template.hashtags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {template.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

