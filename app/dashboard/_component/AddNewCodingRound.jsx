"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/Gemini_AI";
import {
  Loader2,
  Code2,
  Sparkles,
  Terminal,
  Layers,
  History,
  Trash2,
  ArrowRight,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { db } from "@/utils/db";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CodingInterview, CodingFeedback } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { desc, eq } from "drizzle-orm";
import { getUserUsage } from "@/utils/tokenLimit";
import LimitReachedDialog from "@/components/LimitReachedDialog";

const POPULAR_LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript"];

const AddNewCodingRound = () => {
  const [openDialog2, setOpenDialog2] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"
  const [usedCount, setUsedCount] = useState(0);
  const [previousList, setPreviousList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [jobPosition, setJobPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserCodingRounds();
    }
  }, [user]);

  const fetchUserCodingRounds = async () => {
    try {
      setLoadingHistory(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const result = await db
        .select()
        .from(CodingInterview)
        .where(eq(CodingInterview.createdBy, email))
        .orderBy(desc(CodingInterview.id));

      setPreviousList(result || []);
      setUsedCount(result?.length || 0);
    } catch (e) {
      console.error("Error fetching coding rounds:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteCodingRound = async (mockId) => {
    try {
      setDeletingId(mockId);
      await db.delete(CodingFeedback).where(eq(CodingFeedback.mockIdRef, mockId));
      await db.delete(CodingInterview).where(eq(CodingInterview.mockId, mockId));
      toast.success("Coding round deleted successfully.");
      fetchUserCodingRounds();
    } catch (error) {
      console.error("Failed to delete coding round:", error);
      toast.error("Failed to delete coding round. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartPreviousCoding = (mockId) => {
    if (usedCount >= 2) {
      setLimitDialogOpen(true);
      return;
    }
    setOpenDialog2(false);
    router.push(`/dashboard/interview/${mockId}/codingRound`);
  };

  const onSubmitCode = async (e) => {
    e.preventDefault();

    // Check token quota only when creating a new round!
    if (usedCount >= 2) {
      setLimitDialogOpen(true);
      return;
    }

    setLoading(true);

    try {
      const InputPrompt =
        `I need to create a coding problem for a technical assessment.` +
        "Job position: " +
        jobPosition +
        ", Years of experience: " +
        jobExperience +
        " - Based on this information generate an algorithmic coding problem and its reference solution in " +
        language +
        ` language in this strict JSON structure without markdown code blocks: { "question": { "title": "", "difficulty": "Easy" | "Medium" | "Hard", "description": "", "input_format": "", "output_format": "", "constraints": "", "sample_input": [ "", "" ], "sample_output": [ "", "" ], "explanation": "", "platform": "LeetCode Style", "hint": "" }, "code_solution": { "explanation": "", "code": "","time_complexity":"","other_approach": "" } }`;

      const result = await chatSession.sendMessage(InputPrompt);
      const rawText = result.response.text();

      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No valid JSON found in AI response.");
      }

      const MockJsonResp = match[0];
      JSON.parse(MockJsonResp);

      const resp = await db
        .insert(CodingInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          language: language,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: CodingInterview.mockId });

      if (resp && resp[0]?.mockId) {
        toast.success("Coding problem generated successfully!");
        setOpenDialog2(false);
        fetchUserCodingRounds();
        router.push("/dashboard/interview/" + resp[0]?.mockId + "/codingRound");
      }
    } catch (error) {
      toast.error("Failed to generate coding problem. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card - Always opens dialog so user can access past sessions or create */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          fetchUserCodingRounds();
          setOpenDialog2(true);
        }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-indigo-400/60 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="font-mono font-bold text-sm">&lt;/&gt;</span>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              usedCount >= 2
                ? "bg-rose-100 text-rose-700 border-rose-200"
                : "bg-indigo-100 text-indigo-700 border-indigo-200"
            }`}
          >
            {usedCount >= 2 ? "Limit Reached" : `${2 - usedCount}/2 Free Left`}
          </span>
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors">
            Coding Round
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Solve algorithmic problems in an interactive Monaco editor with 5 automated test cases & AI evaluation.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-indigo-100/60 pt-4 mt-auto">
          <span className="text-xs font-semibold text-indigo-600">
            {previousList.length > 0 ? `${previousList.length} Sessions Available` : "Start Challenge"}
          </span>
          <span className="inline-flex items-center text-xs font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
            Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Limit Reached Upgrade Dialog */}
      <LimitReachedDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        featureName="Algorithmic Coding Round"
        currentCount={usedCount}
        maxLimit={2}
      />

      {/* Main Coding Round Hub Modal */}
      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg">AI Coding Assessment</DialogTitle>
                  <DialogDescription className="text-xs">
                    Generate an algorithmic problem or review previous submissions.
                  </DialogDescription>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-xl text-xs border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("create")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === "create"
                      ? "bg-white text-indigo-700 shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  New Challenge
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === "history"
                      ? "bg-white text-indigo-700 shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History className="h-3 w-3" />
                  <span>Previous</span>
                  {previousList.length > 0 && (
                    <span className="ml-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.2 font-bold">
                      {previousList.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* TAB 1: CREATE NEW CODING ROUND */}
          {activeTab === "create" && (
            <form onSubmit={onSubmitCode} className="space-y-4 pt-3">
              {usedCount >= 2 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs flex items-center justify-between text-rose-800">
                  <span>Free quota of 2 sessions reached. Upgrade for unlimited coding challenges.</span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setOpenDialog2(false);
                      router.push("/dashboard/upgrade");
                    }}
                    className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer ml-2"
                  >
                    Upgrade
                  </Button>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Job Role / Target Position
                </label>
                <Input
                  placeholder="Ex. Senior Backend Engineer, Data Structures Specialist"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="mt-1.5 rounded-xl border-border text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Programming Language
                </label>
                <select
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="" disabled>
                    Select preferred language
                  </option>
                  {POPULAR_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Years of Experience
                </label>
                <Input
                  placeholder="Ex. 3"
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                  className="mt-1.5 rounded-xl border-border text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog2(false)}
                  disabled={loading}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Coding Challenge
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: PREVIOUS CODING CHALLENGES */}
          {activeTab === "history" && (
            <div className="space-y-3 pt-3">
              {loadingHistory ? (
                <div className="space-y-2 py-4">
                  <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
                  <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
                </div>
              ) : previousList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/50 space-y-2">
                  <Code2 className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-xs font-semibold text-foreground">No previous coding challenges found</p>
                  <p className="text-[11px] text-muted-foreground">
                    Start a coding challenge to write algorithms, test edge cases, and view feedback.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("create")}
                    className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  >
                    Create First Challenge
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {previousList.map((item) => (
                    <div
                      key={item.mockId}
                      className="rounded-xl border border-border/80 bg-secondary/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-400/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {item.jobPosition}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="rounded-md bg-indigo-100 text-indigo-700 px-1.5 py-0.5 text-[10px] font-bold">
                            {item.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.jobExperience} Years Exp
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {item.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setOpenDialog2(false);
                            router.push(`/dashboard/interview/${item.mockId}/codingRound/feedback`);
                          }}
                          className="h-8 text-xs cursor-pointer gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> Feedback
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStartPreviousCoding(item.mockId)}
                          className={`h-8 text-xs cursor-pointer gap-1 ${
                            usedCount >= 2
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          {usedCount >= 2 ? (
                            <>Restart (Upgrade) <ArrowRight className="h-3 w-3" /></>
                          ) : (
                            <>Code <ArrowRight className="h-3.5 w-3.5" /></>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={deletingId === item.mockId}
                          onClick={() => handleDeleteCodingRound(item.mockId)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          {deletingId === item.mockId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewCodingRound;
