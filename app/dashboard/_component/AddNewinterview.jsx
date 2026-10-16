"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from '@/utils/Gemini_AI';
import {
  Loader2,
  Plus,
  Sparkles,
  Terminal,
  Code2,
  Layers,
  Clock,
  History,
  Trash2,
  ArrowRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import moment from 'moment/moment';
import { toast } from 'sonner';
import { desc, eq } from 'drizzle-orm';
import { getUserUsage } from '@/utils/tokenLimit';
import LimitReachedDialog from '@/components/LimitReachedDialog';

function AddNewinterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"
  const [usedCount, setUsedCount] = useState(0);
  const [previousList, setPreviousList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExp, setJobExp] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserTechnicalRounds();
    }
  }, [user]);

  const fetchUserTechnicalRounds = async () => {
    try {
      setLoadingHistory(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email))
        .orderBy(desc(MockInterview.id));

      setPreviousList(result || []);
      setUsedCount(result?.length || 0);
    } catch (e) {
      console.error("Error fetching technical rounds:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteRound = async (mockId) => {
    try {
      setDeletingId(mockId);
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
      await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));
      toast.success("Technical round deleted successfully.");
      fetchUserTechnicalRounds();
    } catch (error) {
      console.error("Failed to delete interview:", error);
      toast.error("Failed to delete interview. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartPreviousRound = (mockId) => {
    if (usedCount >= 2) {
      setLimitDialogOpen(true);
      return;
    }
    setOpenDailog(false);
    router.push(`/dashboard/interview/${mockId}/technicalround`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check token quota only when attempting to create a new round!
    if (usedCount >= 2) {
      setLimitDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const InputPrompt = `
        Job Positions: ${jobRole}, 
        Job Description: ${jobDesc}, 
        Years of Experience: ${jobExp}. 
        Based on this information, please provide 5 interview questions with answers in JSON format, ensuring "Question" and "Answer" are fields in the JSON.
      `;
      const result = await chatSession.sendMessage(InputPrompt);
      let MockJsonResp = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(MockJsonResp);

      if (parsed) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(parsed),
            jobPosition: jobRole,
            jobDesc: jobDesc,
            jobExperience: jobExp,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        if (resp && resp[0]?.mockId) {
          toast.success("Technical round generated successfully!");
          setOpenDailog(false);
          fetchUserTechnicalRounds();
          router.push('/dashboard/interview/' + resp[0]?.mockId + '/technicalround');
        }
      }
    } catch (error) {
      console.error("Error generating technical round:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card - Always opens dialog so user can access history and create */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          fetchUserTechnicalRounds();
          setOpenDailog(true);
        }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-blue-400/60 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Terminal className="h-5 w-5" />
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              usedCount >= 2
                ? "bg-rose-100 text-rose-700 border-rose-200"
                : "bg-blue-100 text-blue-700 border-blue-200"
            }`}
          >
            {usedCount >= 2 ? "Limit Reached" : `${2 - usedCount}/2 Free Left`}
          </span>
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
            Technical Round
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Practice customized technical questions with speech response, camera simulation & instant AI grading.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-blue-100/60 pt-4 mt-auto">
          <span className="text-xs font-semibold text-blue-600">
            {previousList.length > 0 ? `${previousList.length} Sessions Available` : "Start Practice"}
          </span>
          <span className="inline-flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
            Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Limit Reached Upgrade Dialog */}
      <LimitReachedDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        featureName="Technical Mock Interview"
        currentCount={usedCount}
        maxLimit={2}
      />

      {/* Main Technical Round Hub Modal */}
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg">AI Technical Round</DialogTitle>
                  <DialogDescription className="text-xs">
                    Create tailored technical interviews or access your previous round sessions.
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
                      ? "bg-white text-blue-700 shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Create Round
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === "history"
                      ? "bg-white text-blue-700 shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History className="h-3 w-3" />
                  <span>Previous</span>
                  {previousList.length > 0 && (
                    <span className="ml-1 rounded-full bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 font-bold">
                      {previousList.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* TAB 1: CREATE NEW INTERVIEW */}
          {activeTab === "create" && (
            <form onSubmit={onSubmit} className="space-y-4 pt-3">
              {usedCount >= 2 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs flex items-center justify-between text-rose-800">
                  <span>Free quota of 2 sessions reached. Upgrade for unlimited AI interviews.</span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setOpenDailog(false);
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
                  placeholder="Ex. Senior Full Stack Engineer, React Developer, DevOps"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="mt-1.5 rounded-xl border-border text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Job Description / Tech Stack
                </label>
                <Textarea
                  placeholder="Ex. React, Next.js, Node.js, TypeScript, PostgreSQL, System Design, REST APIs"
                  required
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="mt-1.5 rounded-xl border-border resize-none text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Years of Experience
                </label>
                <Input
                  placeholder="Ex. 2"
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={jobExp}
                  onChange={(e) => setJobExp(e.target.value)}
                  className="mt-1.5 rounded-xl border-border text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDailog(false)}
                  disabled={loading}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: PREVIOUS ROUNDS HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3 pt-3">
              {loadingHistory ? (
                <div className="space-y-2 py-4">
                  <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
                  <div className="h-16 bg-muted/60 animate-pulse rounded-xl" />
                </div>
              ) : previousList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/50 space-y-2">
                  <Terminal className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-xs font-semibold text-foreground">No previous technical interviews found</p>
                  <p className="text-[11px] text-muted-foreground">
                    Create your first technical round to practice questions and review answers.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("create")}
                    className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    Create First Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {previousList.map((item) => (
                    <div
                      key={item.mockId}
                      className="rounded-xl border border-border/80 bg-secondary/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {item.jobPosition}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
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
                            setOpenDailog(false);
                            router.push(`/dashboard/interview/${item.mockId}/technicalround/feedback`);
                          }}
                          className="h-8 text-xs cursor-pointer gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> Feedback
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStartPreviousRound(item.mockId)}
                          className={`h-8 text-xs cursor-pointer gap-1 ${
                            usedCount >= 2
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {usedCount >= 2 ? (
                            <>Restart (Upgrade) <ArrowRight className="h-3 w-3" /></>
                          ) : (
                            <>Start <ArrowRight className="h-3.5 w-3.5" /></>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={deletingId === item.mockId}
                          onClick={() => handleDeleteRound(item.mockId)}
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
}

export default AddNewinterview;
