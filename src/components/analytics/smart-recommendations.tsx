"use client";

import { useBusiness } from "@/context/BusinessContext";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SmartRecommendations() {
  const { campaigns } = useBusiness();
  const drafts = campaigns.filter((c) => c.status === "draft").length;
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 shadow-xl border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">Smart Recommendations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {drafts > 0 ? "You have " + drafts + " draft campaign(s) ready to schedule." : "No drafts pending. Explore upcoming holidays!"}
            </p>
            <Link href="/holidays" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm">
              {drafts > 0 ? "View Drafts" : "Find Holidays"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}