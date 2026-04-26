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

interface RequestCaptionInput extends GenerateCaptionInput {
  strictUniqueness?: boolean;
}

const normalizeCaption = (value: string) => value.trim().toLowerCase();

const parseCaptionArray = (content: string): string[] => {
  const normalized = (content || "").replace(/^```json\s*|^```\s*|\s*```$/gim, "").trim();
  const arrayMatch = normalized.match(/\[[\s\S]*\]/);
  const candidates = [normalized, arrayMatch?.[0] || ""];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate.replace(/,\s*([}\]])/g, "$1"));
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      // Keep trying candidates.
    }
  }

  return [];
};

export function useGroqCaptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingCaption, setStreamingCaption] = useState("");
  const generationInFlightRef = useRef(false);

  const requestCaption = useCallback(async ({ payload, previousCaptions = [], strictUniqueness = false }: RequestCaptionInput): Promise<string | null> => {
    const requestBody = {
      mode: "caption",
      stream: true,
      ...payload,
      previousCaptions,
      strictUniqueness,
      _timestamp: Date.now(),
    };

    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate caption: ${response.status} ${errorText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const jsonData = await response.json();
      const caption = Array.isArray(jsonData.captions) ? jsonData.captions[0] : null;
      return caption ? String(caption) : null;
    }

    if (!response.body) {
      return null;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let streamedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      streamedText += chunk;
      setStreamingCaption(streamedText);
    }

    const parsedCaptions = parseCaptionArray(streamedText);
    if (parsedCaptions.length > 0) {
      return parsedCaptions[0];
    }

    const fallbackCaption = streamedText.trim();
    return fallbackCaption || null;
  }, []);

  const generateCaption = useCallback(async ({ payload, previousCaptions = [] }: GenerateCaptionInput): Promise<string | null> => {
    if (generationInFlightRef.current) {
      return null;
    }

    generationInFlightRef.current = true;
    setIsGenerating(true);
    setStreamingCaption("");

    try {
      const normalizedPrevious = new Set(previousCaptions.map(normalizeCaption));
      let lastCaption: string | null = null;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const caption = await requestCaption({
          payload,
          previousCaptions: lastCaption
            ? [...previousCaptions, lastCaption]
            : previousCaptions,
          strictUniqueness: attempt > 0,
        });

        if (!caption) {
          continue;
        }

        lastCaption = caption;
        if (!normalizedPrevious.has(normalizeCaption(caption))) {
          return caption;
        }
      }

      return lastCaption;
    } finally {
      generationInFlightRef.current = false;
      setStreamingCaption("");
      setIsGenerating(false);
    }
  }, [requestCaption]);

  return {
    isGenerating,
    streamingCaption,
    generateCaption,
  };
}
