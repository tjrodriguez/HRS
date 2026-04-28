"use client";

import { useBusiness } from "@/context/BusinessContext";
import { GitBranch, CheckCircle2, Clock } from "lucide-react";

export function CampaignTimeline() {
  const { campaigns } = useBusiness();
  if (campaigns.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 dark:border-white/5 text-center">
        <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">No Campaigns Yet</h3>
        <p className="text-sm text-muted-foreground">Start creating holiday campaigns to see your pipeline.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {campaigns.slice(0, 8).map((c) => (
        <div key={c.id} className="bg-card/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
              {c.status === "published" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-secondary" />}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">{c.holiday?.name || "Unknown"}</h4>
              <p className="text-xs text-muted-foreground">{c.platforms.join(", ")} – {c.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}