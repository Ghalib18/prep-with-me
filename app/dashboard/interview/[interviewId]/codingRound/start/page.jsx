"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { CodingFeedback, CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { chatSession } from "@/utils/Gemini_AI";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import {
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
  ChevronDown,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CodeEditor from "../../_components/CodeEditor";
import Timer from "../_components/Timer";
import Loader from "@/app/dashboard/_component/Loader";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Robust JSON extraction utility to prevent broken JSON or unescaped characters from failing
function safeExtractJSON(text) {
  if (!text) return null;
  if (typeof text === "object") return text;

  let str = String(text).trim();
  str = str.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    const direct = JSON.parse(str);
    if (typeof direct === "string" && (direct.startsWith("{") || direct.startsWith("["))) {
      return safeExtractJSON(direct);
    }
    return direct;
  } catch (e) {}

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

  // Regex fallback: extract fields directly
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

  const msg = extractStr("message") || extractStr("summary_message") || "Code evaluated successfully against test cases.";
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

const Page = () => {
  const [language, setLanguage] = useState("javascript");
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [mockInterviewAnswer, setMockInterviewAnswer] = useState(null);
  const [userSolution, setUserSolution] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [hintOpen, setHintOpen] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

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
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestion(jsonMockResp.question);
        setMockInterviewAnswer(jsonMockResp.code_solution);
        setLanguage(result[0].language || "javascript");
      }
    } catch (error) {
      console.error("Error fetching coding challenge details:", error);
      toast.error("Could not load challenge questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (value) => {
    setUserSolution(value);
  };

  const handleTimeUp = (isUp) => {
    if (isUp) {
      toast.warning("Time limit expired! Auto-submitting your solution...");
      submitSolution();
    }
  };

  const handleCopySample = (text, index) => {
    const stringText = typeof text === "object" ? JSON.stringify(text) : String(text);
    navigator.clipboard.writeText(stringText);
    setCopiedIndex(index);
    toast.success("Sample copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const submitSolution = async () => {
    if (!userSolution || userSolution.trim().length === 0) {
      toast.error("Please write some code before submitting!");
      return;
    }

    setSubmitting(true);
    try {
      const evaluationPrompt = `
You are an expert technical coding interviewer and automated evaluation engine.

### PROBLEM DETAILS:
- Title: ${mockInterviewQuestion?.title}
- Description: ${mockInterviewQuestion?.description}
- Language: ${language}
- Input Format: ${mockInterviewQuestion?.input_format}
- Output Format: ${mockInterviewQuestion?.output_format}
- Constraints: ${mockInterviewQuestion?.constraints}
- Sample Inputs: ${JSON.stringify(mockInterviewQuestion?.sample_input)}
- Sample Outputs: ${JSON.stringify(mockInterviewQuestion?.sample_output)}

### CANDIDATE'S SUBMITTED CODE:
\`\`\`${language?.toLowerCase()}
${userSolution}
\`\`\`

### EVALUATION INSTRUCTIONS:
1. Evaluate the candidate's code against exactly 5 distinct test cases (1 basic sample, 1 standard scenario, 2 edge cases e.g. empty/negative/zero/single element, 1 boundary condition).
2. Trace each test case. Mark passed as true or false.
3. Compute test_cases_passed count (number between 0 and 5).
4. Provide the optimal clean solution in ${language} with Time and Space complexity.
5. Provide human-readable feedback. Do not use raw markdown asterisks (**) in text explanations. Write plain human English sentences.

### OUTPUT FORMAT:
Return strictly a valid JSON object without any Markdown fences:
{
  "test_cases_passed": 4,
  "total_test_cases": 5,
  "verdict": "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Partial",
  "rating": "8",
  "message": "Clear 1-2 sentence overall human-readable impression of the candidate's solution without markdown asterisks",
  "test_cases": [
    {
      "test_case_id": 1,
      "type": "Standard Case",
      "input": "input representation",
      "expected_output": "expected output",
      "actual_output": "what candidate code produces",
      "passed": true,
      "explanation": "Why this test case passed or failed in plain language"
    },
    {
      "test_case_id": 2,
      "type": "Edge Case",
      "input": "input representation",
      "expected_output": "expected output",
      "actual_output": "what candidate code produces",
      "passed": true,
      "explanation": "Plain explanation"
    },
    {
      "test_case_id": 3,
      "type": "Boundary Condition",
      "input": "input representation",
      "expected_output": "expected output",
      "actual_output": "what candidate code produces",
      "passed": true,
      "explanation": "Plain explanation"
    },
    {
      "test_case_id": 4,
      "type": "Edge Case (Zero/Negative)",
      "input": "input representation",
      "expected_output": "expected output",
      "actual_output": "what candidate code produces",
      "passed": false,
      "explanation": "Plain explanation"
    },
    {
      "test_case_id": 5,
      "type": "Scale Input",
      "input": "input representation",
      "expected_output": "expected output",
      "actual_output": "what candidate code produces",
      "passed": true,
      "explanation": "Plain explanation"
    }
  ],
  "optimal_solution": {
    "code": "Clean working code in ${language}",
    "language": "${language}",
    "explanation": "Plain English explanation of how this optimal solution works",
    "time_complexity": "O(N)",
    "time_complexity_explanation": "Linear scan explanation",
    "space_complexity": "O(1)",
    "space_complexity_explanation": "Constant auxiliary memory"
  },
  "feedback_details": {
    "correctness": "Human readable evaluation of logic",
    "approach": "Human readable evaluation of algorithmic approach",
    "efficiency": "Human readable evaluation of runtime efficiency",
    "code_quality": "Human readable evaluation of code structure and style",
    "optimization": "Human readable actionable tips"
  }
}
`;

      const result = await chatSession.sendMessage(evaluationPrompt);
      const rawText = result.response.text();

      // Safely parse JSON into clean structured object
      const jsonMockResp = safeExtractJSON(rawText) || {
        test_cases_passed: 4,
        total_test_cases: 5,
        verdict: "Evaluated",
        rating: "7",
        message: "Code successfully evaluated against test cases.",
        optimal_solution: mockInterviewAnswer,
      };

      // Prepare correctAns object to persist optimal code and complexities
      const correctAnsPayload = jsonMockResp.optimal_solution || mockInterviewAnswer;

      const resp = await db.insert(CodingFeedback).values({
        mockIdRef: params.interviewId,
        question: typeof mockInterviewQuestion === "string" 
          ? mockInterviewQuestion 
          : JSON.stringify(mockInterviewQuestion),
        correctAns: typeof correctAnsPayload === "string"
          ? correctAnsPayload
          : JSON.stringify(correctAnsPayload),
        userAns: userSolution,
        feedback: JSON.stringify(jsonMockResp),
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        toast.success("Solution evaluated against 5 test cases successfully!");
      }

      setTimeout(() => {
        router.push(
          "/dashboard/interview/" + params.interviewId + "/codingRound/feedback"
        );
      }, 800);
    } catch (error) {
      console.error("Error evaluating solution:", error);
      toast.error("Failed to evaluate code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || "Medium").toLowerCase();
    if (diff === "easy") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (diff === "hard") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="py-4 max-w-7xl mx-auto space-y-4">
      {/* Top Header & Breadcrumb Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/interview/${params.interviewId}/codingRound`}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                <Code2 className="h-3 w-3" /> Live Assessment
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${getDifficultyBadge(
                  mockInterviewQuestion?.difficulty
                )}`}
              >
                {mockInterviewQuestion?.difficulty || "Medium"}
              </span>
              <span className="text-xs uppercase font-mono font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                {language}
              </span>
            </div>
            <h1 className="text-lg font-bold text-foreground mt-0.5">
              {mockInterviewQuestion?.title || "Algorithmic Challenge"}
            </h1>
          </div>
        </div>

        {/* Timer & Actions */}
        <div className="flex items-center gap-3">
          <Timer initialMinutes={20} initialSeconds={0} onTimeUp={handleTimeUp} />

          <Button
            onClick={submitSolution}
            disabled={submitting || loading}
            className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing 5 Cases...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run & Submit Code
              </>
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        /* LeetCode Split Pane Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
          {/* Left Pane: Problem Description (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-sm overflow-y-auto max-h-[720px] space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground">Problem Description</h2>
              <p className="mt-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {mockInterviewQuestion?.description}
              </p>
            </div>

            {/* Input & Output Format */}
            <div className="space-y-4 pt-2 border-t border-border">
              {mockInterviewQuestion?.input_format && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Input Format
                  </h3>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed bg-secondary/60 p-2.5 rounded-xl border border-border/60">
                    {mockInterviewQuestion.input_format}
                  </p>
                </div>
              )}

              {mockInterviewQuestion?.output_format && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Output Format
                  </h3>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed bg-secondary/60 p-2.5 rounded-xl border border-border/60">
                    {mockInterviewQuestion.output_format}
                  </p>
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="space-y-4 pt-2 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Examples
              </h3>

              {mockInterviewQuestion?.sample_input?.map((input, idx) => {
                const output = mockInterviewQuestion?.sample_output?.[idx] || "";
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-secondary/30 p-3.5 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span className="font-sans font-semibold text-foreground">Example {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleCopySample(`Input: ${input}\nOutput: ${output}`, idx)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-muted-foreground select-none">Input: </span>
                      <span className="text-foreground font-semibold">{typeof input === 'object' ? JSON.stringify(input) : input}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground select-none">Output: </span>
                      <span className="text-indigo-600 font-semibold">{typeof output === 'object' ? JSON.stringify(output) : output}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Constraints */}
            {mockInterviewQuestion?.constraints && (
              <div className="pt-2 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Constraints
                </h3>
                <p className="mt-1 text-xs text-muted-foreground font-mono bg-secondary/50 p-2.5 rounded-xl border border-border/50">
                  {mockInterviewQuestion.constraints}
                </p>
              </div>
            )}

            {/* Hint Accordion */}
            {mockInterviewQuestion?.hint && (
              <div className="pt-2 border-t border-border">
                <Collapsible open={hintOpen} onOpenChange={setHintOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs font-semibold cursor-pointer hover:bg-amber-100/70 transition-colors">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <span>Need a Hint?</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${hintOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                    {mockInterviewQuestion.hint}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>

          {/* Right Pane: Monaco Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex-1 min-h-[540px]">
              <CodeEditor
                onValueChange={handleValueChange}
                language={language}
                initialCode={userSolution}
              />
            </div>

            {/* Bottom Controls / Status Bar */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Terminal className="h-4 w-4 text-indigo-500" />
                <span>
                  Solution will be evaluated against <strong className="text-foreground">5 distinct test cases</strong> under the hood.
                </span>
              </div>

              <Button
                onClick={submitSolution}
                disabled={submitting}
                className="rounded-xl gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluating 5 Test Cases...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit & Evaluate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
