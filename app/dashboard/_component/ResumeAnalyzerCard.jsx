"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FileSearch, Sparkles, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { getUserUsage } from "@/utils/tokenLimit";
import LimitReachedDialog from "@/components/LimitReachedDialog";

function ResumeAnalyzerCard() {
  const router = useRouter();
  const { user } = useUser();
  const [usedCount, setUsedCount] = useState(0);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user]);

  const loadUsage = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const data = await getUserUsage(email);
      setUsedCount(data.resume || 0);
      return data;
    } catch (e) {
      return { resume: 0 };
    }
  };

  const handleClick = () => {
    router.push("/dashboard/resume-analyzer");
  };


  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-emerald-400/60 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <FileSearch className="h-5 w-5" />
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              usedCount >= 2
                ? "bg-rose-100 text-rose-700 border-rose-200"
                : "bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
          >
            {usedCount >= 2 ? "Limit Reached" : `${2 - usedCount}/2 Free Left`}
          </span>
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors">
            Resume Analyzer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            Upload resume (PDF/Image) with target role & company to get ATS score & improvement roadmap
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-emerald-100/60 pt-4 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>ATS Score & Feedback</span>
          </div>
          <span className="inline-flex items-center text-xs font-medium text-emerald-600 group-hover:translate-x-1 transition-transform">
            {usedCount >= 2 ? "Upgrade to Unlock" : "Start Analysis"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <LimitReachedDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        featureName="Resume ATS Analyzer"
        currentCount={usedCount}
        maxLimit={2}
      />
    </>
  );
}

export default ResumeAnalyzerCard;
