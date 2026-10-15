"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Terminal } from "lucide-react";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(MockInterview.id));

      setInterviewList(result || []);
    } catch (error) {
      console.error("Error fetching technical interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Terminal className="h-4 w-4" />
          </div>
          <h2 className="font-semibold text-xl text-foreground tracking-tight">
            Previous Technical Rounds
          </h2>
        </div>
        {interviewList?.length > 0 && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200">
            {interviewList.length} {interviewList.length === 1 ? "Session" : "Sessions"}
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
            <InterviewItemCard
              key={interview.mockId || interview.id}
              interview={interview}
              onRefresh={GetInterviewList}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-secondary/30 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground text-base">No Technical Rounds Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Create your first AI technical interview above to practice targeted questions and get instant comprehensive feedback.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewList;