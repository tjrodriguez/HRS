"use client";

import { useCallback, useRef, useState } from "react";

export interface CaptionGenerationPayload {
  holidayName?: string;
  eventDate?: string;
  businessName?: string;
  businessType?: string;
  businessNiche?: string;
  tone?: string;
  targetAudience?: string;
  platform?: string;
}

interface GenerateCaptionInput {
  payload: CaptionGenerationPayload;
  previousCaptions?: string[];
}

const normalizeCaption = (value: string) => value.trim().toLowerCase();

export function useGroqCaptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const generationInFlightRef = useRef(false);

  const generateCaption = useCallback(async ({
    payload,
    previousCaptions = [],
  }: GenerateCaptionInput): Promise<string | null> => {
    if (generationInFlightRef.current) {
      return null;
    }

    generationInFlightRef.current = true;
    setIsGenerating(true);

    try {
      const isRegeneration = previousCaptions.length > 0;

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "caption",
          ...payload,
          previousCaptions,
          strictUniqueness: isRegeneration,
          _timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate caption: ${response.status} ${errorText}`);
      }

      const jsonData = await response.json();

      if (!jsonData.success) {
        throw new Error(jsonData.error || "Generation failed");
      }

      // API returns { captions: [string] }, not { content: string }
      const captions = jsonData.captions;
      if (Array.isArray(captions) && captions.length > 0) {
        return captions[0] || null;
      }

      return jsonData.content || null;
    } catch (error) {
      console.error("Caption generation error:", error);
      throw error;
    } finally {
      generationInFlightRef.current = false;
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    generateCaption,
  };
}

export { normalizeCaption };
