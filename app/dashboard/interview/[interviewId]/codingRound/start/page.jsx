"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { CodingFeedback, CodingInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { chatSession } from "@/utils/Gemini_AI";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Lightbulb } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CodeEditor from "../../_components/CodeEditor";
import Timer from "../_components/Timer";
import Loader from "@/app/dashboard/_component/Loader";
import { toast } from "sonner";
import { Menu } from "@headlessui/react";

const page = () => {
  const [language, setLanguage] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [mockInterviewAnswer, setMockInterviewAnswer] = useState();
  const [userSolution, setUserSolution] = useState();
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

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

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp.question);
      setMockInterviewAnswer(jsonMockResp.code_solution);
      setLanguage(result[0].language);
    } catch (error) {
      toast.error("Please try again!!");
    }
    setLoading(false);
  };

  const handleValueChange = (value) => {
    setUserSolution(value);
  };

  const HandleTimeUp = (value) => {
    if (value) {
      updateUserAnswer();
    }
  };

  const updateUserAnswer = async () => {
    setLoading(true);
    try {
      const feedbackPrompt = `"This is a coding question - " Title: ${mockInterviewQuestion?.title} Description: ${mockInterviewQuestion?.description} Sample Input: ${mockInterviewQuestion?.sample_input[0]} Sample Output: ${mockInterviewQuestion?.sample_output[0]} " and this is the solution that I have solved - " ${userSolution} " - Based on this answer, please provide me feedback in JSON format without any extra space in between with these fields - message, correctness, approach, efficiency, code_quality, optimization, overall_feedback"`;

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const jsonMockResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(CodingFeedback).values({
        mockIdRef: params.interviewId,
        question: mockInterviewQuestion,
        correctAns: mockInterviewAnswer,
        userAns: userSolution,
        feedback: jsonMockResp,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        toast.success("User answer recorded successfully!!");
      }

      setTimeout(() => {
        router.push(
          "/dashboard/interview/" + params.interviewId + "/codingRound/feedback"
        );
      }, 1000);
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
        <div className="-mx-36 bg-white-400 text-gray-500 ">
          <div className="flex justify-between gap-8">
            <div className="m-1 max-w-[45vw] pr-4 pt-8 pl-12">
              <h1 className="text-xl font-semibold ">
                {mockInterviewQuestion?.title}
              </h1>
              <div className="mt-4 text-sm flex items-center gap-16">
                <h3 className="text-gray-500">
                  <strong className="text-blue-500">Level: </strong>
                  {mockInterviewQuestion?.difficulty}
                </h3>
                <div className="flex">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button as={Button} className="flex rounded-2xl bg-gray-200 text-blue-500">
                      <Lightbulb className="h-4 mr-1 " />
                      Hint
                    </Menu.Button>
                    <Menu.Items className="absolute mt-2 w-64 origin-top-right bg-gray-800 border border-gray-500 rounded-md shadow-lg text-gray-400 z-50 p-2">
                      <div className="px-2 py-1 text-sm">
                        {mockInterviewQuestion?.hint}
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
              <div className="h-[1px] bg-gray-600 my-5"></div>
              <div className="text-gray-600">
                <p>{mockInterviewQuestion?.description}</p>

                <div className="mt-8">
                  <strong>Input Format</strong>
                  <p>{mockInterviewQuestion?.input_format}</p>
                </div>
                <div className="mt-8 ">
                  <strong>Output Format</strong>
                  <p>{mockInterviewQuestion?.output_format}</p>
                </div>

                <div className="mt-8">
                  <h1 className="text-lg font-semibold mb-4 ">Example</h1>
                  <div className="bg-gray-200 border border-gray-300 rounded-md p-3">
                    <div>
                      <strong>Input: </strong>
                      {mockInterviewQuestion?.sample_input?.map((input, i) => (
                        <p key={i}>{input}</p>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 bg-gray-200 border border-gray-300 rounded-md p-3">
                    <div>
                      <strong>Output: </strong>
                      {mockInterviewQuestion?.sample_output?.map((output, i) => (
                        <p key={i}>{output}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="my-8">
                  <h1 className="text-lg font-semibold">Constraints</h1>
                  <p>{mockInterviewQuestion?.constraints}</p>
                </div>
              </div>
            </div>

            <div className="right-2 bg-gray-200 px-8 pt-2 pb-8">
              <div className="flex justify-between mb-2">
                <h1 className="border border-gray-400 bg-gray-300  rounded-lg px-4 h-6 text-blue-500">
                  {language?.toLowerCase()}
                </h1>
                <h1>
                  <Timer
                    initialMinutes={20}
                    initialSeconds={0}
                    onTimeUp={HandleTimeUp}
                  />
                </h1>
              </div>
              <div>
                {language && (
                  <CodeEditor
                    onValueChange={handleValueChange}
                    language={language.toLowerCase()}
                  />
                )}
              </div>
              {userSolution && (
                <div className="-mt-16">
                  <Button className="mt-4 bg-blue-500" onClick={updateUserAnswer}>
                    Submit Code
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
