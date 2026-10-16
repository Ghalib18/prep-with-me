"use client";

import React from "react";
import {
  Terminal,
  Code2,
  FileSearch,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Video,
  Mic,
  Cpu,
  Layers,
  Award,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HowItWorksPage() {
  const router = useRouter();

  const FEATURES = [
    {
      title: "1. AI Technical Mock Interview",
      subtitle: "Voice-driven simulation with webcam and speech-to-text",
      icon: Terminal,
      color: "from-blue-600 to-indigo-600",
      tag: "Speech & Camera Simulation",
      steps: [
        {
          title: "Provide Role Parameters",
          desc: "Enter your target job position, tech domain, and years of experience.",
        },
        {
          title: "5 AI Tailored Questions",
          desc: "Gemini AI formulates realistic, company-caliber behavioral and technical questions.",
        },
        {
          title: "Record with Voice & Webcam",
          desc: "Answer aloud via real-time speech recognition while maintaining camera eye contact.",
        },
        {
          title: "Instant Scoring & Model Answers",
          desc: "Compare your spoken response with reference model answers and get an objective rating.",
        },
      ],
    },
    {
      title: "2. Live Algorithmic Coding Round",
      subtitle: "LeetCode-style code assessments with real-time test cases",
      icon: Code2,
      color: "from-indigo-600 to-purple-600",
      tag: "Monaco Editor & Test Runner",
      steps: [
        {
          title: "Choose Programming Language",
          desc: "Select from Python, JavaScript, TypeScript, Java, or C++.",
        },
        {
          title: "Generated Algorithmic Challenge",
          desc: "Receive problem statement, input/output formats, edge case constraints, and hints.",
        },
        {
          title: "Code in In-Browser Editor",
          desc: "Write solution in a full-featured Monaco editor (same engine as VS Code).",
        },
        {
          title: "Automated Evaluation & Big-O",
          desc: "Run against 5 automated test cases with Big-O time and space complexity feedback.",
        },
      ],
    },
    {
      title: "3. AI Resume Analyzer & ATS Scanner",
      subtitle: "Multimodal document analysis for 0-100 ATS optimization",
      icon: FileSearch,
      color: "from-emerald-600 to-teal-600",
      tag: "PDF & Image Multimodal Scan",
      steps: [
        {
          title: "Upload Document (PDF or Image)",
          desc: "Drag & drop your resume file with target role and company name.",
        },
        {
          title: "Target Tech Stack Matching",
          desc: "Gemini scans skills against role requirements to detect keyword gaps.",
        },
        {
          title: "Radial Score & 4 Core Pillars",
          desc: "Inspect overall score out of 100, ATS readability, and experience alignment.",
        },
        {
          title: "Actionable Improvement Roadmap",
          desc: "Get rewrite suggestions (e.g. Google X-Y-Z formula) and an interactive fix checklist.",
        },
      ],
    },
    {
      title: "4. Curated Study Materials & Question Sheets",
      subtitle: "Direct links to the industry's most respected interview roadmaps",
      icon: BookOpen,
      color: "from-amber-600 to-orange-600",
      tag: "Industry Standard Roadmaps",
      steps: [
        {
          title: "DSA Sheets",
          desc: "Direct access to Striver's SDE Sheet, NeetCode 150, and Blind 75.",
        },
        {
          title: "Database Mastery",
          desc: "LeetCode Top SQL 50 study plan and Mode Analytics interactive queries.",
        },
        {
          title: "System Design & Architecture",
          desc: "Donne Martin's System Design Primer and ByteByteGo visual breakdowns.",
        },
        {
          title: "Frontend & Behavioral",
          desc: "GreatFrontEnd 75, LeetCode 30 Days of JS, and the STAR behavioral framework.",
        },
      ],
    },
  ];

  return (
    <div className="py-8 space-y-12 max-w-5xl mx-auto px-4 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" /> Complete Platform Walkthrough
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          How HireReady AI Works
        </h1>

        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          An end-to-end career preparation suite combining AI mock interviews, live algorithmic coding, ATS resume scanning, and curated study sheets.
        </p>
      </div>

      {/* Free Tier Token Limit Explainer */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                6 Free Sessions on Starter Plan
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Every user receives <strong>6 free sessions total</strong> (2 Technical Mock Interviews, 2 Coding Rounds, and 2 Resume ATS Analyses). You can practice completely free, then upgrade to Monthly or Yearly for unlimited sessions.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/upgrade")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1 font-semibold shrink-0 cursor-pointer"
          >
            <span>View Pricing Plans</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Feature Step Breakdown Cards */}
      <div className="space-y-8">
        {FEATURES.map((feature, idx) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6 hover:border-blue-400/60 transition-colors"
            >
              {/* Feature Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.color} text-white shadow-md shadow-blue-500/10`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {feature.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground/80 border border-border/60 self-start sm:self-auto">
                  {feature.tag}
                </span>
              </div>

              {/* 4 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {feature.steps.map((step, stepIdx) => (
                  <div
                    key={stepIdx}
                    className="relative rounded-2xl bg-secondary/40 p-4 border border-border/60 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        Step 0{stepIdx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-foreground mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-foreground">Frequently Asked Questions</h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs font-semibold text-foreground">
              How does the 6-session free token limit work?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              Every newly registered user is granted 2 free Technical Mock Interviews, 2 free Algorithmic Coding Rounds, and 2 free Resume ATS Analyses (6 sessions total). Once used, you can upgrade to our monthly or yearly plan for unlimited sessions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xs font-semibold text-foreground">
              Are my webcam and microphone recorded or stored?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              No. Webcam video is processed strictly in your local browser for presentation simulation and is never recorded or uploaded to servers. Spoken answers are converted to text locally via the Web Speech API and evaluated via AI.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xs font-semibold text-foreground">
              What file formats does the Resume Analyzer accept?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              The Resume Analyzer accepts PDF (.pdf) as well as image formats (PNG, JPG, JPEG, WEBP) up to 10MB in size. We recommend PDF for the highest ATS accuracy.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xs font-semibold text-foreground">
              Where can I find the curated study sheets?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
              Curated study materials including Striver's SDE Sheet, LeetCode Top SQL 50, System Design Primer, and GreatFrontEnd are accessible directly on your Dashboard and under the Questions section.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-8 py-2.5 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          Go to Dashboard & Start Practicing &rarr;
        </Button>
      </div>
    </div>
  );
}