"use client";

import Loader from "@/app/dashboard/_component/Loader";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import img from "@/public/pic.png";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const [interviewData, setInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(CodingInterview)
        .where(eq(CodingInterview.mockId, params.interviewId));

      setInterviewData(result[0]);
    } catch (error) {
      toast.error("Please try again!!");
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="mt-2 h-[70vh] w-full">
          <h1 className="text-center text-3xl font-bold text-blue-500">Instructions</h1>
          <div className="flex gap-8 mt-8">
            <div className="info">
              <div className="flex flex-col gap-6 p-4 rounded-lg ">
                <div className="flex flex-col gap-5 bg-secondary text-gray-400  shadow-md p-6 rounded-md">
                  <h2 className="text-lg">
                    <strong className="text-blue-400">Job Role/Job Position: </strong>
                    {interviewData?.jobPosition}
                  </h2>
                  <h2 className="text-lg">
                    <strong className="text-blue-400">Programming Language: </strong>
                    {interviewData?.language}
                  </h2>
                  <h2 className="text-lg">
                    <strong className="text-blue-400">Years of Experience: </strong>
                    {interviewData?.jobExperience}
                  </h2>
                </div>
                <div className="flex flex-col gap-5 bg-secondary shadow-md text-gray-500 p-6 rounded-md">
                  <h2>
                    <strong className="text-blue-400">Hints: </strong>
                    It contains a hint which you may use when you are stuck in
                    question
                  </h2>
                  <h2>
                    <strong className="text-blue-400">Time Limit: </strong>
                    There will be a timer on the top right corner of the
                    interface showing the remaining duration
                  </h2>
                  <h2>
                    <strong className="text-blue-400">*NOTE: </strong>
                    Below editor interface, check error button will show you any
                    possible error and Save button will save your code before
                    submission
                  </h2>
                </div>
              </div>
            </div>
            <div className="image w-[80vw] h-[60vh] bg-secondary hidden sm:block mt-6 pt-5 px-2 rounded-lg border border-gray-700">
              <Image src={img} className="w-[80vw] h-[92%]" alt="Instructional" />
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href={`/dashboard/interview/${params.interviewId}/codingRound/start`}
            >
              <Button className="mt-2 bg-blue-500">Start Assessment</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
