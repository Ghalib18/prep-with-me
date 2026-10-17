"use client";
import React, { useState } from "react";
import {
  BotMessageSquare,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  BellRing,
  Code2,
  FileCheck2,
  Compass,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HireReadyChatbotCard() {
  const [open, setOpen] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleCardClick = () => {
    setOpen(true);
  };

  const handleNotifyMe = () => {
    setNotified(true);
    toast.success("You're on the early access list! We'll notify you as soon as HireReady Chatbot launches. 🚀", {
      description: "Get ready for 24/7 conversational AI interview coaching.",
    });
    setTimeout(() => {
      setOpen(false);
    }, 1200);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-violet-400/60 bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/15 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25 group-hover:scale-110 transition-transform">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100/90 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-200/60">
            <Sparkles className="h-3 w-3 text-violet-600 animate-pulse" /> Coming Soon
          </span>
        </div>

        <div className="my-5">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-violet-600 transition-colors">
              HireReady Chatbot
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            24/7 Conversational AI mentor for instant interview doubts, DSA hints & resume tailoring advice
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-violet-100/70 pt-4 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-violet-700 font-medium">
            <Zap className="h-4 w-4 text-violet-600" />
            <span>AI Career Coach</span>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-violet-600 group-hover:translate-x-1 transition-transform">
            Explore <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Coming Soon Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-6 overflow-hidden rounded-2xl border-violet-100 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 blur-2xl pointer-events-none" />

          <DialogHeader className="text-center sm:text-center items-center">
            <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
              <BotMessageSquare className="h-8 w-8 animate-bounce" />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-fuchsia-500"></span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Feature Preview • In Active Development
            </div>

            <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
              HireReady AI Chatbot
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
              We are building your personal 24/7 AI career copilot powered by Gemini 2.5 Flash to help you crack any tech interview.
            </DialogDescription>
          </DialogHeader>

          {/* Feature Highlights */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl border border-violet-100/80 bg-violet-50/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Interactive Mock Chat & HR Practice</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Engage in text-based mock interview rounds with real-time feedback on confidence, STAR responses, and tone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-indigo-100/80 bg-indigo-50/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Algorithmic Hints & Code Reviews</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Stuck on a LeetCode problem? Get step-by-step pseudo-code hints without spoiling the entire solution.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-fuchsia-100/80 bg-fuchsia-50/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fuchsia-600 text-white">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">On-the-Fly Resume Bullet Rephrasing</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ask the chatbot to transform your project descriptions into high-impact, ATS-optimized action statements.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/60">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl text-xs"
            >
              Close
            </Button>
            <Button
              onClick={handleNotifyMe}
              disabled={notified}
              className="flex-1 rounded-xl text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-md shadow-violet-500/20"
            >
              {notified ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-300" /> Waitlist Joined!
                </>
              ) : (
                <>
                  <BellRing className="mr-1.5 h-3.5 w-3.5" /> Notify When Live
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
