"use client";

import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Lightbulb,
  ArrowLeft,
  RotateCcw,
  Home,
  MessageSquare,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Feedback = () => {
  const params = useParams();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.interviewId) {
      GetFeedback();
    }
  }, [params?.interviewId]);

  const GetFeedback = async () => {
    try {
      setLoading(true);
      // Fetch answers
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      // Fetch interview details
      const interviewResult = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      setFeedbackList(result || []);
      if (interviewResult && interviewResult.length > 0) {
        setInterviewData(interviewResult[0]);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const overallRating = useMemo(() => {
    if (feedbackList && feedbackList.length > 0) {
      const numericRatings = feedbackList
        .map((item) => {
          const parsed = parseFloat(String(item.rating || "0").replace(/[^0-9.]/g, ""));
          return isNaN(parsed) ? 0 : parsed;
        })
        .filter((r) => r > 0);

      if (numericRatings.length === 0) return 0;
      const sum = numericRatings.reduce((a, b) => a + b, 0);
      return (sum / numericRatings.length).toFixed(1);
    }
    return 0;
  }, [feedbackList]);

  // Helper to safely clean and render feedback text that might contain markdown, JSON or bullets
  const renderFeedbackText = (rawFeedback) => {
    if (!rawFeedback) return "No feedback recorded for this question.";

    let text = rawFeedback;
    if (typeof rawFeedback === "object") {
      try {
        text = JSON.stringify(rawFeedback, null, 2);
      } catch (e) {
        text = String(rawFeedback);
      }
    }

    // Clean common JSON wrappers if present
    text = text.replace(/^[{\s]*"feedback":\s*"/i, "").replace(/"[}\s]*$/i, "");

    // Split paragraphs or bullet points
    const lines = text.split("\n").filter((l) => l.trim().length > 0);

    return (
      <div className="space-y-2 max-w-full overflow-hidden">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\./.test(trimmed);
          const cleanText = isBullet ? trimmed.replace(/^[-*•]\s*|^\d+\.\s*/, "") : trimmed;

          return (
            <div key={idx} className="flex items-start gap-2 max-w-full min-w-0">
              {isBullet && (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              )}
              <p className="text-xs md:text-sm text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                {cleanText}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const getScoreBadgeColor = (ratingStr) => {
    const val = parseFloat(String(ratingStr || "0").replace(/[^0-9.]/g, ""));
    if (val >= 8) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (val >= 6) return "bg-blue-50 text-blue-700 border-blue-200";
    if (val >= 4) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getPerformanceLabel = (score) => {
    const val = parseFloat(score);
    if (val >= 8.5) return { label: "Outstanding Performance", color: "text-emerald-600", desc: "Demonstrates strong technical mastery and clear articulation." };
    if (val >= 7.0) return { label: "Good Technical Competency", color: "text-blue-600", desc: "Solid conceptual understanding with minor areas for refinement." };
    if (val >= 5.0) return { label: "Satisfactory / Developing", color: "text-amber-600", desc: "Basic knowledge present, recommended to review core concepts." };
    return { label: "Needs Practice", color: "text-rose-600", desc: "Review foundational theory and practice structured answering." };
  };

  const performance = getPerformanceLabel(overallRating);

  return (
    <div className="py-8 max-w-5xl mx-auto w-full min-w-0 px-2 sm:px-4 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {feedbackList?.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No Feedback Records Found</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            It looks like this interview hasn't been completed yet or no answers were submitted for evaluation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/dashboard/interview/${params.interviewId}/technicalround/start`}>
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
                Start Technical Round
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => router.replace("/dashboard")}
              className="rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Overall Performance Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-blue-50/30 p-6 sm:p-8 shadow-sm">
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Interview Completed
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Evaluation Report & Feedback
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Target Role: <strong className="text-foreground">{interviewData?.jobPosition || "Technical Round"}</strong> • Experience: <strong className="text-foreground">{interviewData?.jobExperience || "0"} Years</strong>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground pt-1">
                  {performance.desc}
                </p>
              </div>

              {/* Scorecard Widget */}
              <div className="flex sm:flex-col items-center justify-center rounded-2xl border border-border/80 bg-background/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm min-w-[160px] text-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Overall Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-black tracking-tight ${performance.color}`}>
                    {overallRating}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">/10</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <TrendingUp className="h-3 w-3" /> {feedbackList.length} Questions Evaluated
                </span>
              </div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">Detailed Question Breakdown</h2>
              <p className="text-xs text-muted-foreground">
                Expand each question to inspect your response, model benchmarks, and personalized AI tips.
              </p>
            </div>
          </div>

          {/* Collapsible Question Cards with Guaranteed No Overflow */}
          <div className="space-y-4 w-full max-w-full">
            {feedbackList.map((item, index) => {
              const ratingScore = item.rating || "N/A";
              const badgeStyle = getScoreBadgeColor(ratingScore);

              return (
                <Collapsible
                  key={index}
                  className="group rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:border-blue-400/50 w-full max-w-full overflow-hidden"
                >
                  <CollapsibleTrigger className="p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 w-full max-w-full cursor-pointer hover:bg-secondary/40 transition-colors">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                        Q{index + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-2 break-words [overflow-wrap:anywhere] min-w-0">
                        {item.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${badgeStyle}`}>
                        <Award className="h-3 w-3" />
                        {ratingScore}/10
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="border-t border-border/80 bg-secondary/15 p-4 sm:p-6 w-full max-w-full overflow-hidden">
                    <div className="space-y-4 w-full max-w-full min-w-0">
                      {/* Candidate Answer Box */}
                      <div className="rounded-xl border border-border bg-card p-4 shadow-2xs w-full max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider mb-2">
                          <User className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>Your Spoken Answer</span>
                        </div>
                        <div className="w-full max-w-full overflow-hidden min-w-0">
                          <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                            {item.userAns ? `"${item.userAns}"` : "No spoken answer recorded."}
                          </p>
                        </div>
                      </div>

                      {/* Correct / Benchmark Answer Box */}
                      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-2xs w-full max-w-full overflow-hidden">
                        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider mb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Recommended Model Answer & Key Concepts</span>
                        </div>
                        <div className="w-full max-w-full overflow-hidden min-w-0">
                          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                            {item.correctAns || "Standard technical benchmark answer."}
                          </p>
                        </div>
                      </div>

                      {/* AI Evaluation & Improvement Box */}
                      <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-2xs w-full max-w-full overflow-hidden">
                        <div className="flex items-center justify-between gap-2 text-blue-800 font-semibold text-xs uppercase tracking-wider mb-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600 shrink-0" />
                            <span>AI Evaluation & Areas for Improvement</span>
                          </div>
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                            Score: {ratingScore}/10
                          </span>
                        </div>
                        <div className="w-full max-w-full overflow-hidden min-w-0 pt-1">
                          {renderFeedbackText(item.feedback)}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="rounded-xl gap-2 text-xs hover:bg-secondary"
              >
                <Home className="h-3.5 w-3.5" />
                Return to Dashboard
              </Button>
            </Link>

            <Link href={`/dashboard/interview/${params.interviewId}/technicalround`}>
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs shadow-sm">
                <RotateCcw className="h-3.5 w-3.5" />
                Retake Technical Round
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Feedback;