"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight, Layers, FileCode2 } from "lucide-react";

function StudyMaterialCard() {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push("/dashboard/questions")}
      onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/questions")}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-purple-400/60 bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/90 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
          <Sparkles className="h-3 w-3" /> Curated Sheets
        </span>
      </div>

      <div className="my-5">
        <h3 className="text-lg font-bold text-foreground group-hover:text-purple-600 transition-colors">
          Study Materials
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          Striver SDE Sheet, LeetCode SQL 50, System Design Primer & CS Core interview roadmaps
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-purple-100/60 pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
          <Layers className="h-4 w-4" />
          <span>Top Coding Sheets</span>
        </div>
        <span className="inline-flex items-center text-xs font-medium text-purple-600 group-hover:translate-x-1 transition-transform">
          Open Sheets <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export default StudyMaterialCard;
