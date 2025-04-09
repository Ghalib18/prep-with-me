"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { CodingFeedback } from "@/utils/schema";
import { eq } from "drizzle-orm";
import FormatCode from "../_components/FormatCode";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loader from "@/app/dashboard/_component/Loader";
import { toast } from "sonner";
import { X } from "lucide-react";

const Page = () => {
  const { interviewId } = useParams();

  const [correctAnswer, setCorrectAnswer] = useState();
  const [solutionFeedback, setSolutionFeedback] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    setLoading(true);

    try {
      const result = await db
        .select()
        .from(CodingFeedback)
        .where(eq(CodingFeedback.mockIdRef, interviewId))
        .orderBy(CodingFeedback.id);

      const jsonResp = result[result.length - 1];

      setSolutionFeedback(JSON.parse(jsonResp.feedback));
      setCorrectAnswer(JSON.parse(jsonResp.correctAns));
    } catch (error) {
      toast.error("Please try again!!", {
        icon: <X className="text-red-600" />,
      });
    }

    setLoading(false);
  };

  return (
    <div className="pt-12">
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Congrats Heading */}
          <h2 className="text-3xl font-bold text-green-500 mb-6">
            Congratulations!{" "}
            <span className="text-black text-2xl">
              on completing this Challenge
            </span>
          </h2>

          {/* Feedback Box */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <h2 className="font-bold text-2xl text-gray-700">
              Here is your personalized feedback
            </h2>

            {solutionFeedback && (
              <div className="my-8 text-gray-500">
                <div className="mb-6">
                  <p>{solutionFeedback?.message}</p>
                </div>

                {[
                  "correctness",
                  "approach",
                  "efficiency",
                  "code_quality",
                  "optimization",
                  "overall_feedback",
                ].map((key) => (
                  <h1 className="mb-4" key={key}>
                    <span className="text-lg font-semibold text-gray-600">
                      {key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                    </span>{" "}
                    {solutionFeedback?.[key]}
                  </h1>
                ))}
              </div>
            )}
          </div>

          {/* Correct Answer Section */}
          <div className="w-full bg-gray-100 shadow-md rounded-2xl mt-8 p-4">
            <h1 className="font-bold mb-4">Correct Solution:</h1>

            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="bg-gray-700 p-4 border-[4px] border-gray-750 rounded-xl w-full lg:w-1/2">
                <FormatCode code={correctAnswer?.code} language="java" />
              </div>

              <div className="mt-4 lg:mt-2 flex flex-col gap-4 text-gray-500 w-full lg:w-1/2">
                <div>
                  <span className="font-bold mr-2 text-gray-700">
                    Explanation:
                  </span>
                  <span>{correctAnswer?.explanation}</span>
                </div>
                <div>
                  <span className="font-bold mr-2 text-gray-700">
                    Time Complexity:
                  </span>
                  <span>{correctAnswer?.time_complexity}</span>
                </div>
                <div>
                  <span className="font-bold mr-2 text-gray-700">
                    Other Approach:
                  </span>
                  <span>{correctAnswer?.other_approach}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Button to Dashboard */}
          <Link href="/dashboard">
            <Button className="my-8 bg-blue-500">Go to Dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
