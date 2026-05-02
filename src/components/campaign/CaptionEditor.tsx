'use client';

import { Check, Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Campaign } from '@/lib/types/campaign';

interface CaptionEditorProps {
  content: Campaign['content'];
  isEditing: boolean;
  isLoading: boolean;
  streamingText?: string | null;
  generationNotice?: string | null;
  onEditToggle: () => void;
  onRegenerate: () => void;
  onCaptionChange: (caption: string) => void;
}

export function CaptionEditor({
  content,
  isEditing,
  isLoading,
  streamingText,
  generationNotice,
  onEditToggle,
  onRegenerate,
  onCaptionChange,
}: CaptionEditorProps) {
  const { instagram } = content;

  return (
    <Card className="border-white/20 bg-card/60 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Generated Caption
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditToggle}
              className="text-primary hover:bg-primary/10"
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 mr-1" /> Done
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" /> Edit
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
              className="text-primary hover:bg-primary/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {generationNotice && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            {generationNotice}
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">
              {streamingText ? 'Streaming caption...' : 'Generating content...'}
            </p>
            {streamingText && (
              <div className="w-full bg-background/60 border border-white/10 rounded-lg p-4 min-h-20">
                <p className="text-foreground whitespace-pre-wrap">{streamingText}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {isEditing ? (
              <textarea
                value={instagram}
                onChange={(e) => onCaptionChange(e.target.value)}
                className="w-full bg-background/60 border border-primary/50 rounded-lg p-4 min-h-40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Edit your caption here..."
              />
            ) : (
              <div className="bg-background/60 border border-white/10 rounded-lg p-4 min-h-32">
                <p className="text-foreground whitespace-pre-wrap">{instagram}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
