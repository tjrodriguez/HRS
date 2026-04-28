"use client";

import { useBusiness } from "@/context/BusinessContext";
import { Radar, Clock } from "lucide-react";
import Link from "next/link";

export function OpportunityRadar() {
  const { holidays } = useBusiness();
  return (
    <div className="space-y-4">
      {holidays.slice(0, 6).map((holiday) => (
        <div key={holiday.id} className="bg-card/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-foreground">{holiday.name}</h4>
              <p className="text-sm text-muted-foreground">{holiday.date}</p>
            </div>
            <Link href={"/create/" + holiday.id} className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm">
              Create Post
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}