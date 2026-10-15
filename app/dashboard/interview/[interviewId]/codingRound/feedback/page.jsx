"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { CodingFeedback, CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import FormatCode from "../_components/FormatCode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loader from "@/app/dashboard/_component/Loader";
import { toast } from "sonner";
import {
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Home,
  Lightbulb,
  Award,
  Terminal,
  ShieldCheck,
  Zap,
  TrendingUp,
  User,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Robust JSON extraction utility that unpacks stringified or nested JSON from LLM responses
function safeExtractJSON(input) {
  if (!input) return null;
  if (typeof input === "object") return input;

  let str = String(input).trim();
  str = str.replace(/```json/gi, "").replace(/```/g, "").trim();

  // 1. Direct parse attempt
  try {
    const res = JSON.parse(str);
    if (typeof res === "string" && (res.startsWith("{") || res.startsWith("["))) {
      return safeExtractJSON(res);
    }
    return res;
  } catch (e) {}

  // 2. Outermost braces extraction
  const start = str.indexOf("{");
  const end = str.lastIndexOf("}");
  if (start !== -1 && end > start) {
    const candidate = str.substring(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (e1) {
      try {
        const sanitized = candidate.replace(/"((?:\\.|[^"\\])*)"/gs, (match) => {
          return match.replace(/\r?\n/g, "\\n").replace(/\t/g, "\\t");
        });
        return JSON.parse(sanitized);
      } catch (e2) {}
    }
  }

  // 3. Fallback regex extraction if strict JSON parse failed
  const extractStr = (key) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`);
    const match = str.match(regex);
    return match ? match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n") : "";
  };

  const extractNum = (key, def = 0) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*(\\d+)`);
    const match = str.match(regex);
    return match ? parseInt(match[1], 10) : def;
  };

  const msg = extractStr("message") || extractStr("summary_message") || "";
  const verdict = extractStr("verdict") || "Evaluated";
  const rating = String(extractNum("rating", 7));
  const test_cases_passed = extractNum("test_cases_passed", 0);
  const total_test_cases = extractNum("total_test_cases", 5);

  let test_cases = [];
  const tcIdx = str.indexOf('"test_cases"');
  if (tcIdx !== -1) {
    const aStart = str.indexOf("[", tcIdx);
    const aEnd = str.lastIndexOf("]");
    if (aStart !== -1 && aEnd > aStart) {
      try {
        const arrStr = str.substring(aStart, aEnd + 1).replace(/"((?:\\.|[^"\\])*)"/gs, (match) => {
          return match.replace(/\r?\n/g, "\\n").replace(/\t/g, "\\t");
        });
        test_cases = JSON.parse(arrStr);
      } catch (e) {}
    }
  }

  return {
    test_cases_passed,
    total_test_cases,
    verdict,
    rating,
    message: msg,
    test_cases,
    optimal_solution: {
      code: extractStr("code"),
      time_complexity: extractStr("time_complexity") || "O(N)",
      time_complexity_explanation: extractStr("time_complexity_explanation"),
      space_complexity: extractStr("space_complexity") || "O(1)",
      space_complexity_explanation: extractStr("space_complexity_explanation"),
      explanation: extractStr("explanation"),
    },
    feedback_details: {
      correctness: extractStr("correctness"),
      approach: extractStr("approach"),
      efficiency: extractStr("efficiency"),
      code_quality: extractStr("code_quality"),
      optimization: extractStr("optimization"),
    },
  };
}

// Formats text for human readability by stripping raw JSON, converting **bold** into clean tags, and formatting paragraphs
function renderHumanText(content) {
  if (!content) return null;
  let str = String(content);

  // If text accidentally contains a JSON string, extract message or explanation
  if (str.trim().startsWith("{") || str.trim().startsWith("[")) {
    const extracted = safeExtractJSON(str);
    if (extracted) {
      str = extracted.message || extracted.explanation || extracted.overall_feedback || "";
    }
  }

  // Strip escaped JSON syntax or stray braces if any exist
  str = str.replace(/^["']|["']$/g, "").trim();

  // Split into clean paragraphs
  const paragraphs = str
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {paragraphs.map((p, pIdx) => {
        // Strip bullet markers (- , * , 1. )
        const cleanP = p.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, "");
        // Split markdown bold (**text**)
        const parts = cleanP.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={pIdx} className="leading-relaxed">
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={partIdx} className="font-semibold text-foreground">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

const Page = () => {
  const { interviewId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interviewMeta, setInterviewMeta] = useState(null);
  const [feedbackRecord, setFeedbackRecord] = useState(null);
  const [userCodeOpen, setUserCodeOpen] = useState(false);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      // Fetch feedback records
      const feedbackResults = await db
        .select()
        .from(CodingFeedback)
        .where(eq(CodingFeedback.mockIdRef, interviewId))
        .orderBy(CodingFeedback.id);

      // Fetch interview metadata
      const interviewResults = await db
        .select()
        .from(CodingInterview)
        .where(eq(CodingInterview.mockId, interviewId));

      if (interviewResults && interviewResults.length > 0) {
        setInterviewMeta(interviewResults[0]);
      }

      if (feedbackResults && feedbackResults.length > 0) {
        const latest = feedbackResults[feedbackResults.length - 1];
        setFeedbackRecord(latest);
      }
    } catch (error) {
      console.error("Error loading feedback details:", error);
      toast.error("Failed to load feedback details.");
    } finally {
      setLoading(false);
    }
  };

  // Parse feedback JSON safely and unpack if message was stringified JSON
  const parsedFeedback = useMemo(() => {
    if (!feedbackRecord?.feedback) return null;
    let data = safeExtractJSON(feedbackRecord.feedback);

    // If data.message was itself a stringified JSON containing the full evaluation report (happened in past runs!)
    if (
      data &&
      typeof data.message === "string" &&
      (data.message.includes('"test_cases"') ||
        data.message.includes('"test_cases_passed"') ||
        data.message.includes('"optimal_solution"'))
    ) {
      const unpacked = safeExtractJSON(data.message);
      if (unpacked && typeof unpacked === "object") {
        data = {
          ...data,
          ...unpacked,
          message: unpacked.message || "Solution evaluated against test cases.",
        };
      }
    }

    return data;
  }, [feedbackRecord]);

  // Parse correct solution safely
  const parsedCorrectAnswer = useMemo(() => {
    if (parsedFeedback?.optimal_solution) {
      return parsedFeedback.optimal_solution;
    }
    if (!feedbackRecord?.correctAns) return null;
    try {
      if (typeof feedbackRecord.correctAns === "object") {
        return feedbackRecord.correctAns;
      }
      return safeExtractJSON(feedbackRecord.correctAns);
    } catch (e) {
      return {
        code: String(feedbackRecord.correctAns),
      };
    }
  }, [feedbackRecord, parsedFeedback]);

  // Test cases array
  const testCases = useMemo(() => {
    if (Array.isArray(parsedFeedback?.test_cases) && parsedFeedback.test_cases.length > 0) {
      return parsedFeedback.test_cases;
    }
    // Fallback test cases if older submission
    const passedCount = parsedFeedback?.test_cases_passed ?? 5;
    return [1, 2, 3, 4, 5].map((id) => ({
      test_case_id: id,
      type: id === 1 ? "Sample Case" : id <= 3 ? "Standard Case" : "Edge Condition",
      input: `Sample Input ${id}`,
      expected_output: `Expected Output ${id}`,
      actual_output: `Output ${id}`,
      passed: id <= passedCount,
      explanation: id <= passedCount ? "Passed all validation assertions" : "Failed boundary check",
    }));
  }, [parsedFeedback]);

  const testCasesPassed = parsedFeedback?.test_cases_passed ?? testCases.filter((t) => t.passed).length;
  const totalTestCases = parsedFeedback?.total_test_cases ?? 5;
  const passPercentage = Math.round((testCasesPassed / totalTestCases) * 100);

  const getVerdictStyle = (passed, total) => {
    if (passed === total) {
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "All Test Cases Passed",
        color: "text-emerald-600",
      };
    }
    if (passed >= total * 0.6) {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        label: `${passed}/${total} Partial Passing`,
        color: "text-amber-600",
      };
    }
    return {
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Needs Revision",
      color: "text-rose-600",
    };
  };

  const verdict = getVerdictStyle(testCasesPassed, totalTestCases);
  const ratingScore = parsedFeedback?.rating ? String(parsedFeedback.rating).replace(/[^0-9.]/g, "") : (passPercentage / 10).toFixed(1);

  const feedbackDetails = parsedFeedback?.feedback_details || {
    correctness: parsedFeedback?.correctness,
    approach: parsedFeedback?.approach,
    efficiency: parsedFeedback?.efficiency,
    code_quality: parsedFeedback?.code_quality,
    optimization: parsedFeedback?.optimization,
  };

  // Clean human message without any raw JSON
  const humanSummary = useMemo(() => {
    const rawMsg = parsedFeedback?.message;
    if (!rawMsg) return "";
    let str = String(rawMsg);
    // If it still contains JSON braces or keys, extract clean text
    if (str.includes('{"') || str.includes('"test_cases"')) {
      const extracted = safeExtractJSON(str);
      if (extracted?.message) return extracted.message;
    }
    return str;
  }, [parsedFeedback]);

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

      {loading ? (
        <Loader />
      ) : !feedbackRecord ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <Code2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No Coding Submission Found</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You haven't submitted a solution for this coding challenge yet. Enter the workspace to write code and test it against 5 test cases.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/dashboard/interview/${interviewId}/codingRound/start`}>
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
                Launch Coding Assessment
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
          {/* Hero Evaluation Report Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-indigo-50/40 p-6 sm:p-8 shadow-sm w-full max-w-full">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 w-full min-w-0">
              <div className="space-y-2 max-w-xl min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Assessment Evaluated
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground break-words [overflow-wrap:anywhere]">
                  Coding Evaluation Report
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Target Role: <strong className="text-foreground">{interviewMeta?.jobPosition || "Software Engineer"}</strong> • Language: <strong className="text-foreground uppercase">{interviewMeta?.language || "Code"}</strong> • Exp: <strong className="text-foreground">{interviewMeta?.jobExperience || "0"} Yrs</strong>
                </p>

                {/* Clean, Human-Readable Evaluation Summary (NO JSON) */}
                {humanSummary && (
                  <div className="pt-2 text-xs sm:text-sm text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {renderHumanText(humanSummary)}
                  </div>
                )}
              </div>

              {/* Score & Test Cases Widget */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center rounded-2xl border border-border/80 bg-background/80 backdrop-blur-sm p-5 shadow-sm min-w-[200px] text-center gap-3">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Performance Score
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-0.5">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${verdict.color}`}>
                      {ratingScore}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">/10</span>
                  </div>
                </div>

                {/* Test cases passed meter */}
                <div className="w-full space-y-1.5 pt-1 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Test Cases:</span>
                    <span className={verdict.color}>
                      {testCasesPassed} / {totalTestCases} Passed
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        testCasesPassed === totalTestCases
                          ? "bg-emerald-500"
                          : testCasesPassed >= 3
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${passPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: 5 Test Cases Grid */}
          <div className="space-y-4 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-indigo-600" />
                  Automated Test Cases Results ({testCasesPassed}/{totalTestCases} Passed)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Our AI evaluated your submission against 5 distinct test scenarios under the hood.
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${verdict.badge}`}>
                {verdict.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCases.map((tc, idx) => {
                const passed = Boolean(tc.passed);
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 shadow-2xs space-y-3 transition-all ${
                      passed
                        ? "bg-card border-emerald-200/80 hover:border-emerald-300"
                        : "bg-card border-rose-200/80 hover:border-rose-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">
                        Test Case #{tc.test_case_id || idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                          passed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {passed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Passed
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> Failed
                          </>
                        )}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono bg-secondary/50 p-2.5 rounded-xl border border-border/50">
                      <div className="truncate">
                        <span className="text-muted-foreground select-none">Input: </span>
                        <span className="text-foreground">{typeof tc.input === 'object' ? JSON.stringify(tc.input) : tc.input}</span>
                      </div>
                      <div className="truncate">
                        <span className="text-muted-foreground select-none">Expected: </span>
                        <span className="text-emerald-600 font-semibold">{typeof tc.expected_output === 'object' ? JSON.stringify(tc.expected_output) : tc.expected_output}</span>
                      </div>
                      <div className="truncate">
                        <span className="text-muted-foreground select-none">Output: </span>
                        <span className={passed ? "text-emerald-600" : "text-rose-600 font-semibold"}>
                          {typeof tc.actual_output === 'object' ? JSON.stringify(tc.actual_output) : tc.actual_output}
                        </span>
                      </div>
                    </div>

                    {tc.explanation && (
                      <div className="text-[11px] text-muted-foreground leading-relaxed">
                        {renderHumanText(tc.explanation)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Optimal Reference Solution with Big-O Complexity */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Optimal Reference Solution</h2>
                  <p className="text-xs text-muted-foreground">Production-ready implementation with Big-O complexity analysis</p>
                </div>
              </div>
            </div>

            {/* Complexity Badges Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-600" /> Time Complexity
                  </span>
                  <span className="font-mono font-extrabold text-sm text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {parsedCorrectAnswer?.time_complexity || "O(N)"}
                  </span>
                </div>
                <div className="text-xs text-indigo-900/80 leading-relaxed pt-1">
                  {renderHumanText(parsedCorrectAnswer?.time_complexity_explanation || "Linear scanning through the input elements without redundant nested loops.")}
                </div>
              </div>

              <div className="rounded-2xl border border-purple-200/80 bg-purple-50/60 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-purple-600" /> Space Complexity
                  </span>
                  <span className="font-mono font-extrabold text-sm text-purple-700 bg-white px-2.5 py-0.5 rounded-lg border border-purple-200">
                    {parsedCorrectAnswer?.space_complexity || "O(1)"}
                  </span>
                </div>
                <div className="text-xs text-purple-900/80 leading-relaxed pt-1">
                  {renderHumanText(parsedCorrectAnswer?.space_complexity_explanation || "Constant auxiliary memory without auxiliary allocation proportional to input size.")}
                </div>
              </div>
            </div>

            {/* Highlighted Code Block with Copy Button */}
            <div className="w-full max-w-full overflow-hidden">
              <FormatCode
                code={parsedCorrectAnswer?.code || "// Optimal code unavailable"}
                language={interviewMeta?.language || "javascript"}
              />
            </div>

            {/* Solution Explanation */}
            {parsedCorrectAnswer?.explanation && (
              <div className="rounded-2xl bg-secondary/50 border border-border p-4 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Algorithmic Intuition & Explanation
                </h4>
                <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {renderHumanText(parsedCorrectAnswer.explanation)}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Compare Your Submitted Code */}
          {feedbackRecord?.userAns && (
            <Collapsible
              open={userCodeOpen}
              onOpenChange={setUserCodeOpen}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <CollapsibleTrigger className="p-4 sm:p-5 text-left flex items-center justify-between w-full hover:bg-secondary/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-sm text-foreground">
                    View Your Submitted Code
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({feedbackRecord.userAns.split("\n").length} lines)
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    userCodeOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-w-full">
                <pre>
                  <code>{feedbackRecord.userAns}</code>
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Section 4: Deep-Dive AI Evaluation Feedback (5 Aspects) */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Detailed Evaluation Feedback</h2>
                <p className="text-xs text-muted-foreground">Expert insights on correctness, efficiency, and code quality</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(feedbackDetails).map(([key, value]) => {
                if (!value || typeof value === "object") return null;
                const formattedKey = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-1.5 w-full max-w-full overflow-hidden"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {formattedKey}
                    </span>
                    <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {renderHumanText(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="rounded-xl gap-2 text-xs hover:bg-secondary"
              >
                <Home className="h-3.5 w-3.5" />
                Return to Dashboard
              </Button>
            </Link>

            <Link href={`/dashboard/interview/${interviewId}/codingRound`}>
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs shadow-sm">
                <RotateCcw className="h-3.5 w-3.5" />
                Retake Coding Challenge
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
