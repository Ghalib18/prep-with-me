"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from '@/utils/Gemini_AI';
import { Loader2, Plus, Sparkles, Terminal, Code2, Layers } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

function AddNewinterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExp, setJobExp] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const InputPrompt = `
        Job Positions: ${jobRole}, 
        Job Description: ${jobDesc}, 
        Years of Experience: ${jobExp}. 
        Based on this information, please provide 5 interview questions with answers in JSON format, ensuring "Question" and "Answer" are fields in the JSON.
      `;
      const result = await chatSession.sendMessage(InputPrompt);
      let MockJsonResp = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Ensure valid JSON parsing
      const parsed = JSON.parse(MockJsonResp);

      if (parsed) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(parsed),
            jobPosition: jobRole,
            jobDesc: jobDesc,
            jobExperience: jobExp,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        if (resp && resp[0]?.mockId) {
          toast.success("Technical round generated successfully!");
          setOpenDailog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId + '/technicalround');
        }
      }
    } catch (error) {
      console.error("Error generating technical round:", error);
      toast.error("Failed to generate questions. Please try again.");
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
        onClick={() => setOpenDailog(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-blue-400/60 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3 w-3" /> AI Powered
          </span>
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
            Technical Round
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Practice customized technical questions with speech response, camera simulation & instant AI grading.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
          <Plus className="h-4 w-4" />
          <span>Create Technical Interview</span>
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Code2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">Set Up Technical Round</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Provide your target role, required skills, and experience. Our AI will curate 5 tailored interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Job Role / Target Position
              </label>
              <Input
                placeholder="Ex. Senior Full Stack Engineer, React Developer, DevOps"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="mt-1.5 rounded-xl border-border"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Job Description / Tech Stack
              </label>
              <Textarea
                placeholder="Ex. React, Next.js, Node.js, TypeScript, PostgreSQL, System Design, REST APIs"
                required
                rows={3}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="mt-1.5 rounded-xl border-border resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Years of Experience
              </label>
              <Input
                placeholder="Ex. 2"
                type="number"
                min="0"
                max="50"
                required
                value={jobExp}
                onChange={(e) => setJobExp(e.target.value)}
                className="mt-1.5 rounded-xl border-border"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDailog(false)}
                disabled={loading}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-md shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewinterview;
