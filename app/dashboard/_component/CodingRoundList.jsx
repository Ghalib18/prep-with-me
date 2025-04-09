"use client";

import { db } from "@/utils/db";
import { CodingInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const CodingRoundList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && getInterviewList();
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

      setInterviewList(result);
    } catch (error) {
      toast.error("Unable to load content!!");
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        ""
      ) : (
        <div>
          <h2 className="text-gray-600 font-medium text-2xl mt-24">
            Previous Coding Round
          </h2>

          <div className="bg-gray-100 rounded-2xl p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-7">
            {interviewList &&
              interviewList.map((interview, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-700 shadow-md rounded-xl p-1 hover:shadow-lg hover:shadow-gray-600"
                >
                  <h2 className="font-bold text-lg text-blue-500">
                    {interview?.jobPosition}
                  </h2>
                  <h2 className="font-xs text-gray-500 my-3">
                    Years of Experience: {interview?.jobExperience}
                  </h2>
                  <h2 className="text-xs text-gray-500">
                    Created At: {interview?.createdAt}
                  </h2>

                  <div className="flex justify-between  mt-2 gap-4">
                    <Link
                      href={`/dashboard/interview/${interview?.mockId}/codingRound/feedback`}
                      className="w-full"
                    >
                      <Button
                        size="xs"
                        className="w-full bg-blue-400 text-white rounded-full"
                      >
                        Feedback
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/interview/${interview?.mockId}/codingRound`}
                      className="w-full"
                    >
                      <Button
                        size="xs"
                        className="w-full bg-blue-400 text-white rounded-full"
                      >
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingRoundList;
