"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/Gemini_AI";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Question } from "@/utils/schema";
import { useRouter } from "next/navigation";

const AddQuestions = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (setState) => (e) => setState(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `
      Job Positions: ${jobPosition},
      Job Description: ${jobDesc},
      Years of Experience: ${jobExperience},
      Which type of question: ${typeQuestion},
      This company previous question: ${company},
      Based on this information, please provide 5 interview questions with answers in JSON format.
      Each question and answer should be fields in the JSON. Ensure "Question" and "Answer" are fields.
    `;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const MockQuestionJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      if (MockQuestionJsonResp) {
        const resp = await db
          .insert(Question)
          .values({
            mockId: uuidv4(),
            MockQuestionJsonResp,
            jobPosition,
            jobDesc,
            jobExperience,
            typeQuestion,
            company,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("YYYY-MM-DD"),
          })
          .returning({ mockId: Question.mockId });

        if (resp) {
          setOpenDialog(false);
          router.push("/dashboard/pyq/" + resp[0]?.mockId);
        }
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error.message);
      alert("There was an error processing the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 rounded-lg border bg-secondary hover:scale-105 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center text-blue-500">+ Add New Questions</h2>
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
  <DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>What model questions are you seeking</DialogTitle>
    </DialogHeader>

    <form onSubmit={onSubmit} className="mt-3 space-y-2">
      <div>
        <h2 className="text-base font-small text-gray-500">
          Add Details about your job position, job description and years of experience
        </h2>
      </div>

      <div>
        <label className="text-black">Job Role / Position</label>
        <Input
          className="mt-1"
          value={jobPosition}
          placeholder="Ex. Full stack Developer"
          required
          onChange={handleInputChange(setJobPosition)}
        />
      </div>

      <div>
        <label className="text-black text-bold">Job Description / Tech stack</label>
        <Textarea
          className="mt-1"
          value={jobDesc}
          placeholder="Ex. React, Angular, Nodejs, MySQL, NoSQL, Python"
          required
          onChange={handleInputChange(setJobDesc)}
        />
      </div>

      <div>
        <label className="text-black">Type of Questions</label>
        <Input
          className="mt-1"
          value={typeQuestion}
          placeholder="Ex. CPP, Leetcode, Domain based"
          required
          onChange={handleInputChange(setTypeQuestion)}
        />
      </div>

      <div>
        <label className="text-black">Company you are targeting</label>
        <Input
          className="mt-1"
          value={company}
          placeholder="Ex. Microsoft, Apple, Google"
          required
          onChange={handleInputChange(setCompany)}
        />
      </div>

      <div>
        <label className="text-black">Years of Experience</label>
        <Input
          className="mt-1"
          type="number"
          value={jobExperience}
          placeholder="Ex. 5"
          max="50"
          required
          onChange={handleInputChange(setJobExperience)}
        />
      </div>

      <div className="flex gap-5 justify-end pt-3">
        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className='bg-blue-500'>
          {loading ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Generating From AI
            </>
          ) : (
            "Prep. Questions"
          )}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default AddQuestions;
