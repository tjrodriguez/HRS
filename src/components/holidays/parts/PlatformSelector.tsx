'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlatformSelectorProps {
  platforms: string[];
  selected: string[];
  onToggle: (platform: string) => void;
}

export function PlatformSelector({ platforms, selected, onToggle }: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform);
        return (
          <Button
            key={platform}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => onToggle(platform)}
            className="w-full justify-between"
          >
            <span className="capitalize">{platform}</span>
            {isSelected && <Badge variant="secondary">Selected</Badge>}
          </Button>
        );
      })}
    </div>
  );
}
