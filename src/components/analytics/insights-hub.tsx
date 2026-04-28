"use client";

import { useState } from "react";
import { HolidayPerformanceScorecard } from "./holiday-performance-scorecard";
import { SmartRecommendations } from "./smart-recommendations";
import { TrendingUp, Sparkles } from "lucide-react";

type TabId = "performance" | "recommendations";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function InsightsHub() {
  const [activeTab, setActiveTab] = useState<TabId>("performance");

  const tabs: Tab[] = [
    {
      id: "performance",
      label: "Performance",
      icon: <TrendingUp className="w-4 h-4" />,
      component: <HolidayPerformanceScorecard />,
    },
    {
      id: "recommendations",
      label: "Smart Tips",
      icon: <Sparkles className="w-4 h-4" />,
      component: <SmartRecommendations />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-white/5">
        <h2 className="text-2xl font-bold text-foreground mb-2">Campaign Intelligence</h2>
        <p className="text-muted-foreground">Insights and recommendations to optimize your holiday marketing</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card border border-white/10 dark:border-white/5"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {tabs.find((t) => t.id === activeTab)?.component}
      </div>
    </div>
  );
}
