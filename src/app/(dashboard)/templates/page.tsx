"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { useNotification } from "@/components/notifications";
import { Template } from "@/utils/data";
import { TemplateLibrary } from "@/components/templates/template-library";

export default function TemplatesPage() {
  const { addNotification } = useNotification();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      addNotification("Failed to load templates", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Content Library</h1>
        </div>
        <p className="text-blue-100">
          Save, organize, and reuse your best captions and marketing content.
        </p>
      </div>

      <TemplateLibrary
        templates={templates}
        onRefresh={loadTemplates}
      />
    </div>
  );
}

