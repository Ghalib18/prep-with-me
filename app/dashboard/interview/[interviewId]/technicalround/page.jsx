"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState, useContext } from 'react';
import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import {
  Lightbulb,
  WebcamIcon,
  Briefcase,
  Layers,
  Clock,
  ArrowRight,
  ArrowLeft,
  Video,
  VideoOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Mic,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";
import { WebCamContext } from "../../../layout";

function Interview() {
  const params = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails();
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      if (result && result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  const techStackList = interviewData?.jobDesc
    ? interviewData.jobDesc.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="py-8 max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Technical Interview Setup
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Let's Get Started
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify your camera & audio permissions, inspect role details, and start when you're ready.
          </p>
        </div>

        <Link href={`/dashboard/interview/${params.interviewId}/technicalround/start`}>
          <Button size="lg" className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-md shadow-blue-500/20 px-6">
            Start Interview
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Role Overview & Tips (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Role Specification Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Interview Profile</h2>
                <p className="text-xs text-muted-foreground">Tailored parameters for this session</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Target Position
                </span>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {interviewData?.jobPosition || "Technical Candidate"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Experience Level
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-foreground">
                      {interviewData?.jobExperience || "0"} {Number(interviewData?.jobExperience) === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Question Count
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-foreground">5 Questions</span>
                  </div>
                </div>
              </div>

              {techStackList.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tech Stack & Topics Covered
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {techStackList.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Information Alert Box */}
          <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/80 via-yellow-50/40 to-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900 text-sm">Important Interview Instructions</h3>
                <p className="text-xs leading-relaxed text-amber-800">
                  {process.env.NEXT_PUBLIC_INFORMATION ||
                    "Enable your web camera and microphone to begin the AI mock interview. It has 5 questions which you may answer aloud. At the end, you will receive an in-depth score and tailored feedback report."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-amber-900/80">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Quiet environment recommended
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-amber-600" /> Speak clearly into your microphone
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: WebCam & Hardware Readiness (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold text-sm text-foreground">Hardware Preview</h3>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  webCamEnabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    webCamEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
                  }`}
                />
                {webCamEnabled ? "Camera Active" : "Camera Standby"}
              </span>
            </div>

            {/* Camera Viewport */}
            <div className="relative mt-5 w-full aspect-video rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-border shadow-inner">
              {webCamEnabled ? (
                <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-3 border border-slate-800">
                    <WebcamIcon className="h-8 w-8" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">Camera preview disabled</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    Click the button below to enable camera permissions for simulation
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Camera Button */}
            <div className="mt-5 w-full">
              <Button
                variant={webCamEnabled ? "outline" : "default"}
                onClick={() => setWebCamEnabled((prev) => !prev)}
                className={`w-full rounded-xl gap-2 ${
                  webCamEnabled
                    ? "border-border text-foreground hover:bg-secondary"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {webCamEnabled ? (
                  <>
                    <VideoOff className="h-4 w-4 text-red-500" />
                    Turn Off WebCam
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    Enable WebCam Preview
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action call to start */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-foreground">Ready to begin?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Questions will be presented one at a time.
              </p>
            </div>
            <Link href={`/dashboard/interview/${params.interviewId}/technicalround/start`}>
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 shadow-sm">
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
