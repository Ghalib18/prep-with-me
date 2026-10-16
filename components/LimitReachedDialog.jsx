"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function LimitReachedDialog({
  open,
  onOpenChange,
  featureName = "AI Mock Feature",
  currentCount = 2,
  maxLimit = 2,
}) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/dashboard/upgrade");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[490px] p-6 border-blue-200/80 bg-gradient-to-b from-card via-card to-blue-50/30 shadow-xl">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
            <Crown className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/90 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-200">
              <Sparkles className="h-3 w-3" /> Free Quota Used ({currentCount}/{maxLimit})
            </span>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Free Sessions Limit Reached
            </DialogTitle>
          </div>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            You have used all <strong className="text-foreground">{currentCount} of {maxLimit} free sessions</strong> for{" "}
            <span className="font-semibold text-blue-600">{featureName}</span>.
            Each account includes 6 free sessions (2 Technical, 2 Coding, 2 Resume). Upgrade to unlock unlimited AI practice.
          </DialogDescription>
        </DialogHeader>

        {/* Benefits Box */}
        <div className="my-3 rounded-2xl border border-blue-200/60 bg-secondary/50 p-4 space-y-2.5 text-xs">
          <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider">
            Pro Plan Includes:
          </span>
          <div className="space-y-2 text-xs text-foreground/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Unlimited Technical Interviews with Voice & Webcam AI</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Unlimited Monaco Coding Rounds with 5 Automated Test Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Unlimited Resume ATS Scans, Keyword Matching & PDF Exports</span>
            </div>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="flex items-center justify-between rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Plans Start At</span>
            <span className="font-extrabold text-blue-700 text-sm">$8.25 / month</span>
          </div>
          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 font-bold">
            Save 30% on Annual
          </span>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs cursor-pointer"
          >
            Maybe Later
          </Button>
          <Button
            size="sm"
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-1.5 text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <span>Upgrade to Unlimited</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
