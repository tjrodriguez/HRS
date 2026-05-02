'use client';

import { Badge } from '@/components/ui/badge';

interface HashtagListProps {
  tags: string[];
}

export function HashtagList({ tags }: HashtagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-white font-normal hover:text-blue-700 border-[#e2e8f0]"
        >
          {t}
        </Badge>
      ))}
    </div>
  );
}
