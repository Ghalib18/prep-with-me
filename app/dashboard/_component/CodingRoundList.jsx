"use client";

import { db } from "@/utils/db";
import { CodingInterview, CodingFeedback } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Code2,
  Calendar,
  Clock,
  Trash2,
  ArrowRight,
  FileText,
  Loader2,
  AlertTriangle,
  Sparkles,
  Terminal
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const CodingRoundList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      getInterviewList();
    }
  }, [user]);

  const getInterviewList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(CodingInterview)
        .where(
          eq(CodingInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(CodingInterview.id));

      setInterviewList(result || []);
    } catch (error) {
      console.error("Error fetching coding rounds:", error);
      toast.error("Unable to load coding interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      // Delete associated coding feedback records
      await db
        .delete(CodingFeedback)
        .where(eq(CodingFeedback.mockIdRef, deleteTarget.mockId));

      // Delete the coding interview
      await db
        .delete(CodingInterview)
        .where(eq(CodingInterview.mockId, deleteTarget.mockId));

      toast.success("Coding interview deleted successfully");
      setDeleteTarget(null);
      getInterviewList();
    } catch (error) {
      console.error("Failed to delete coding interview:", error);
      toast.error("Failed to delete coding round. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Code2 className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-xl text-foreground tracking-tight">
            Previous Coding Rounds
          </h2>
        </div>
        {interviewList?.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-200">
            {interviewList.length} {interviewList.length === 1 ? "Challenge" : "Challenges"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-5 border rounded-2xl bg-card space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-8 rounded-xl" />
                <Skeleton className="h-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : interviewList && interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview) => (
            <div
              key={interview.mockId || interview.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              {/* Decorative top accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {interview?.jobPosition}
                      </h3>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
                        Coding Round
                      </span>
                    </div>
                  </div>

                  {/* Delete Trigger Button */}
                  <button
                    onClick={() => setDeleteTarget(interview)}
                    aria-label="Delete coding challenge"
                    className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Badges / Metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 border border-indigo-200/60 uppercase">
                    {interview?.language || "Code"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1 font-medium text-foreground">
                    <Clock className="h-3 w-3 text-indigo-500" />
                    {interview?.jobExperience} {Number(interview?.jobExperience) === 1 ? 'Year' : 'Years'} Exp
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {interview?.createdAt || "Recent"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t border-border/60">
                <Link
                  href={`/dashboard/interview/${interview?.mockId}/codingRound/feedback`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 rounded-xl border-border/80 text-xs font-medium hover:bg-secondary hover:text-indigo-600"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Feedback
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/interview/${interview?.mockId}/codingRound`}
                  className="w-full"
                >
                  <Button
                    size="sm"
                    className="w-full gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-medium text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 hover:shadow-md transition-all"
                  >
                    Start
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-secondary/30 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground text-base">No Coding Rounds Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Create your first live coding challenge above to practice problem-solving in Monaco editor with 5 automated test cases.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg">
              Delete Coding Challenge?
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              This will permanently delete the coding interview for{" "}
              <strong className="text-foreground">{deleteTarget?.jobPosition}</strong> ({deleteTarget?.language}) along with your submitted code, test case results, and AI feedback.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-xl gap-2 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Challenge
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodingRoundList;
