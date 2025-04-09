"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/Gemini_AI";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CodingInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const AddNewCodingRound = () => {
  const [openDialog2, setOpenDialog2] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmitCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const InputPrompt =
        `I need to create a coding problem for the mock interview.` +
        "Job position: " +
        jobPosition +
        ", Years of experience: " +
        jobExperience +
        " -  Based on this information generate a problem and its solution in " +
        language +
        ` language in this JSON structure without any extra space in between - { "question": { "title": "", "difficulty": "", "description": "", "input_format": "", "output_format": "", "constraints": "", "sample_input": [ "", "" ], "sample_output": [ "", "" ], "explanation": "", "platform": "", "hint": "" }, "code_solution": { "explanation": "", "code": "","time_complexity":"","other_approach": "" } }`;

      const result = await chatSession.sendMessage(InputPrompt);
      const rawText = result.response.text();

      // Clean and extract only the JSON part
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No valid JSON found in AI response.");
      }

      const MockJsonResp = match[0];
      const parsed = JSON.parse(MockJsonResp); // Ensure valid JSON

      const resp = await db
        .insert(CodingInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition,
          language,
          jobExperience: Number(jobExperience),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: CodingInterview.mockId });

      if (resp) {
        setOpenDialog2(false);
        setJobPosition("");
        setLanguage("");
        setJobExperience("");
        router.push(`/dashboard/interview/${resp[0]?.mockId}/codingRound`);
      } else {
        toast.error("Error generating question.");
      }
    } catch (error) {
      toast.error("Please try again!!");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 rounded-lg bg-secondary hover:scale-110 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog2(true)}
      >
        <h2 className="text-xl text-center text-blue-500 font-semibold">
          Coding Round
        </h2>
      </div>

      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Coding Interview
            </DialogTitle>
            <DialogDescription>
              Add details about your job position/role, Job description and years of experience
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmitCode}>
            <div className="mt-4 text-black">
              <label className="text-[1rem] font-semibold">
                Job Role/Job Position
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. Software developer"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div className="mt-4 text-black">
              <label className="text-[1rem] font-semibold">
                Programming Language
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. Java, Cpp or Python"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div className="mt-4 text-black">
              <label className="text-[1rem] font-semibold">
                Years of Experience
              </label>
              <Input
                className="mt-2"
                placeholder="Ex. 4"
                type="number"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>

            <div className="flex gap-5 justify-end mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog2(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-500">
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Generating Questions
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewCodingRound;
