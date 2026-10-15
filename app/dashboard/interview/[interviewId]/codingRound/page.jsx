"use client";

import Loader from "@/app/dashboard/_component/Loader";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Code2,
  Briefcase,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Timer as TimerIcon,
  ShieldCheck
} from "lucide-react";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails();
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(CodingInterview)
        .where(eq(CodingInterview.mockId, params.interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching coding challenge details:", error);
      toast.error("Could not load challenge details.");
    } finally {
      setLoading(false);
    }
  };

  const getLanguageExt = (lang) => {
    const l = (lang || "").toLowerCase();
    if (l.includes("py")) return "py";
    if (l.includes("java") && !l.includes("script")) return "java";
    if (l.includes("script") || l.includes("js")) return "js";
    if (l.includes("ts")) return "ts";
    if (l.includes("c++") || l.includes("cpp")) return "cpp";
    return "txt";
  };

  const lang = interviewData?.language || "Code";
  const ext = getLanguageExt(lang);

  return (
    <div className="py-8 max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-200 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Live Coding Challenge Briefing
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready for your Coding Assessment?
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your problem specifications, assessment guidelines, and launch the Monaco environment.
              </p>
            </div>

            <Link href={`/dashboard/interview/${params.interviewId}/codingRound/start`}>
              <Button
                size="lg"
                className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-md shadow-indigo-500/20 px-6"
              >
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Left Column: Challenge Overview & Rules (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile Card */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Challenge Specifications</h2>
                    <p className="text-xs text-muted-foreground">Parameters curated for this session</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Target Role / Position
                    </span>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {interviewData?.jobPosition || "Software Engineer"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Language
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                          {lang}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Experience
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-foreground">
                          {interviewData?.jobExperience || "0"} {Number(interviewData?.jobExperience) === 1 ? 'Yr' : 'Yrs'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Duration
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TimerIcon className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-foreground">20 Mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines Box */}
              <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-card p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-indigo-950 text-sm">How Assessment Grading Works</h3>
                    <p className="text-xs leading-relaxed text-indigo-900/80">
                      Write clean, working code for the provided algorithmic problem. When you submit your code, our AI evaluator performs a deep test case analysis:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-indigo-900/90 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> 5 Hidden Test Cases under the hood
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5 text-indigo-600" /> Time & Space Complexity analysis
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-600" /> Code quality & cleanliness grade
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Optimal reference code with explanation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: IDE Preview & Launch (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              {/* Mock IDE Frame */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-500" />
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                      Monaco Editor Environment
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ready
                  </span>
                </div>

                {/* IDE Mockup */}
                <div className="mt-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 text-slate-300">solution.{ext}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{lang}</span>
                  </div>
                  <div className="p-4 font-mono text-xs text-slate-300 space-y-1 select-none">
                    <p className="text-slate-500">// Your code will be evaluated against 5 test cases</p>
                    <p><span className="text-purple-400">function</span> <span className="text-blue-400">solveProblem</span>(input) &#123;</p>
                    <p className="pl-4 text-slate-400">// Write your algorithmic logic here...</p>
                    <p className="pl-4"><span className="text-purple-400">return</span> result;</p>
                    <p>&#125;</p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Full syntax highlighting & auto-complete</span>
                  <span className="font-semibold text-indigo-600">VS Code Engine</span>
                </div>
              </div>

              {/* Action Callout */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Ready to code?</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Timer starts when you enter the workspace.
                  </p>
                </div>
                <Link href={`/dashboard/interview/${params.interviewId}/codingRound/start`}>
                  <Button className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 shadow-sm">
                    Enter Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
