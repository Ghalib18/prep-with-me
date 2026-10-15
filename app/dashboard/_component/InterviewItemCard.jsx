"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Briefcase, Calendar, Clock, Trash2, ArrowRight, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InterviewItemCard = ({ interview, onRefresh }) => {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/technicalround");
  };

  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/technicalround/feedback");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Delete answers recorded for this interview
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, interview?.mockId));
      // Delete the mock interview record
      await db.delete(MockInterview).where(eq(MockInterview.mockId, interview?.mockId));
      
      toast.success("Technical interview deleted successfully");
      setOpenDeleteDialog(false);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to delete interview:", error);
      toast.error("Failed to delete interview. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5">
        {/* Top subtle decorative gradient accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row with Job Position and Delete button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {interview?.jobPosition}
                </h3>
                <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
                  Technical Round
                </span>
              </div>
            </div>

            {/* Delete Trigger Button */}
            <button
              onClick={() => setOpenDeleteDialog(true)}
              aria-label="Delete interview"
              className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Badges / Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/80 px-2.5 py-1 font-medium text-foreground">
              <Clock className="h-3 w-3 text-blue-500" />
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
          <Button
            onClick={onFeedback}
            variant="outline"
            size="sm"
            className="w-full gap-1.5 rounded-xl border-border/80 text-xs font-medium hover:bg-secondary hover:text-blue-600"
          >
            <FileText className="h-3.5 w-3.5" />
            Feedback
          </Button>
          <Button
            onClick={onStart}
            size="sm"
            className="w-full gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-medium text-white shadow-sm hover:from-blue-500 hover:to-indigo-500 hover:shadow-md transition-all"
          >
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg">
              Delete Technical Interview?
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              This will permanently delete the technical interview for{" "}
              <strong className="text-foreground">{interview?.jobPosition}</strong> along with all recorded answers and AI feedback. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setOpenDeleteDialog(false)}
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
                  Delete Interview
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewItemCard;