"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserUsage } from "@/utils/tokenLimit";
import { Zap, Crown, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TokenUsageTracker() {
  const { user } = useUser();
  const router = useRouter();
  const [usage, setUsage] = useState({
    technical: 0,
    coding: 0,
    resume: 0,
    total: 0,
    technicalRemaining: 2,
    codingRemaining: 2,
    resumeRemaining: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user]);

  const loadUsage = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const data = await getUserUsage(userEmail);
      setUsage(data);
    } catch (e) {
      console.error("Failed to load token usage:", e);
    } finally {
      setLoading(false);
    }
  };

  const totalUsed = (usage.technical || 0) + (usage.coding || 0) + (usage.resume || 0);
  const totalFree = 6;
  const totalRemaining = Math.max(0, totalFree - totalUsed);

  return (
    <div className="my-5 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-card p-4 md:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">
                Free Plan Token Quota
              </h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                {totalRemaining} of {totalFree} Free Sessions Left
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each user gets 2 free sessions per feature (Technical Mock, Coding Assessment, and Resume ATS Analyzer).
            </p>
          </div>
        </div>

        {/* Breakdown Badges & Upgrade Button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-border/80 px-3 py-1.5 text-xs shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground font-medium">Technical:</span>
            <span className="font-bold text-foreground">{usage.technical}/2</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-border/80 px-3 py-1.5 text-xs shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground font-medium">Coding:</span>
            <span className="font-bold text-foreground">{usage.coding}/2</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-border/80 px-3 py-1.5 text-xs shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">Resume:</span>
            <span className="font-bold text-foreground">{usage.resume}/2</span>
          </div>

          <Button
            size="sm"
            onClick={() => router.push("/dashboard/upgrade")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs gap-1 font-semibold shadow-sm cursor-pointer ml-auto sm:ml-0"
          >
            <Crown className="h-3.5 w-3.5" /> Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
