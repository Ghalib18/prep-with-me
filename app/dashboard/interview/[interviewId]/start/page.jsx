"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import QuestionSection from './_component/QuestionsSection';
import { Button } from "@/components/ui/button"
import Link from "next/link";

// ⬇️ Dynamically import RecordAnswerSection to fix window error
const RecordAnswerSection = dynamic(
  () => import('./_component/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
  const params = useParams();
  const [interData, setInterData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    setInterData(result[0]);
    setMockInterviewQuestion(jsonMockResp);
    console.log(jsonMockResp);
  };

  return (
    <div >
      <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-40">
        {/* Question Section */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/audio Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interData={interData}
        />
      </div>
      <div className="flex gap-3 my-5  md:my-0  md:justify-end md:gap-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            className='bg-blue-500 rounded-full '
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className='bg-blue-500 rounded-full'
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
          <Link
            href={"/dashboard/interview/" + interData?.mockId + "/feedback"}
          >
            <Button  className='bg-blue-500 rounded-full'>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;


