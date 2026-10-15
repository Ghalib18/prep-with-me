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
import { Loader2, Code2, Sparkles, Terminal, Layers } from "lucide-react";
import { db } from "@/utils/db";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CodingInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const POPULAR_LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript"];

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
        `I need to create a coding problem for a technical assessment.` +
        "Job position: " +
        jobPosition +
        ", Years of experience: " +
        jobExperience +
        " - Based on this information generate an algorithmic coding problem and its reference solution in " +
        language +
        ` language in this strict JSON structure without markdown code blocks: { "question": { "title": "", "difficulty": "Easy" | "Medium" | "Hard", "description": "", "input_format": "", "output_format": "", "constraints": "", "sample_input": [ "", "" ], "sample_output": [ "", "" ], "explanation": "", "platform": "LeetCode Style", "hint": "" }, "code_solution": { "explanation": "", "code": "","time_complexity":"","other_approach": "" } }`;

      const result = await chatSession.sendMessage(InputPrompt);
      const rawText = result.response.text();

      // Clean and extract only the JSON part
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No valid JSON found in AI response.");
      }

      const MockJsonResp = match[0];
      JSON.parse(MockJsonResp); // Validate JSON

      const resp = await db
        .insert(CodingInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition,
          language,
          jobExperience: String(jobExperience),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: CodingInterview.mockId });

      if (resp && resp[0]?.mockId) {
        toast.success("Coding challenge generated successfully!");
        setOpenDialog2(false);
        setJobPosition("");
        setLanguage("");
        setJobExperience("");
        router.push("/dashboard/interview/" + resp[0]?.mockId + "/codingRound");
      }
    } catch (error) {
      toast.error("Failed to generate coding problem. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpenDialog2(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-indigo-400/60 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="font-mono font-bold text-sm">&lt;/&gt;</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3 w-3" /> Live Coding
          </span>
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors">
            Coding Round
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Solve algorithmic problems in an interactive Monaco editor with 5 automated test cases & AI evaluation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
          <span>Start Coding Challenge &rarr;</span>
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Code2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">Set Up Coding Challenge</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Define your role and preferred programming language. AI will curate an algorithmic challenge tailored to your experience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmitCode} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Job Role / Target Position
              </label>
              <Input
                placeholder="Ex. Senior Backend Engineer, Data Structures Specialist"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="mt-1.5 rounded-xl border-border"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Programming Language
                </label>
                <div className="flex gap-1">
                  {POPULAR_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                        language.toLowerCase() === lang.toLowerCase()
                          ? "bg-indigo-600 text-white"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                placeholder="Ex. Python, Java, JavaScript, C++, Go"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1.5 rounded-xl border-border"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Years of Experience
              </label>
              <Input
                placeholder="Ex. 3"
                type="number"
                min="0"
                max="50"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                className="mt-1.5 rounded-xl border-border"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog2(false)}
                disabled={loading}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-md shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Challenge...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Challenge
                  </>
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
