"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import QuestionSection from './_component/QuestionsSection';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Flag, Sparkles } from "lucide-react";

// Dynamically import RecordAnswerSection to prevent SSR window/MediaRecorder errors
const RecordAnswerSection = dynamic(
  () => import('./_component/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
  const params = useParams();
  const router = useRouter();
  const [interData, setInterData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails();
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      if (result && result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setInterData(result[0]);
        setMockInterviewQuestion(jsonMockResp || []);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const totalQuestions = mockInterviewQuestion?.length || 5;
  const progressPercent = Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header & Progress Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                <Sparkles className="h-3 w-3" /> Live Technical Round
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {interData?.jobPosition}
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground mt-1">
              Question {activeQuestionIndex + 1} of {totalQuestions}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/interview/${params.interviewId}/technicalround`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Briefing
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Interview Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interview Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Panel */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        {/* Video / Speech Recorder Panel */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interData={interData}
        />
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Button
          variant="outline"
          disabled={activeQuestionIndex === 0}
          onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
          className="rounded-xl gap-2 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous Question
        </Button>

        <div className="flex items-center gap-3">
          {activeQuestionIndex < totalQuestions - 1 ? (
            <Button
              onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
              className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs shadow-sm"
            >
              Next Question
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Link
              href={`/dashboard/interview/${interData?.mockId || params.interviewId}/technicalround/feedback`}
            >
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs shadow-md shadow-emerald-500/20">
                <CheckCircle className="h-4 w-4" />
                End Interview & View Feedback
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
