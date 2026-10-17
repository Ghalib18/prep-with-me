"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Code2,
  FileSearch,
  BookOpen,
  BotMessageSquare,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Mic,
  Video,
  ChevronRight,
  Star,
  Layers,
  Database,
  Cpu,
  Play,
  TrendingUp,
  BrainCircuit,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AIMockInterviewLanding() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect to dashboard if already logged in, otherwise redirect to sign-in page
  const handleStartClick = () => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Interactive Mesh & Glow Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[140px]" />
        {/* Subtle developer grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <AnimatedConstellation />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              HireReady<span className="text-blue-500">.ai</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#mockup-preview" className="hover:text-white transition-colors">
              Live Simulation
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#curated-sheets" className="hover:text-white transition-colors">
              Study Sheets
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleStartClick}
                  className="hidden sm:inline-flex text-xs md:text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={handleStartClick}
                  className="relative group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Free</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md mb-6 shadow-sm shadow-blue-500/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>Powered by Google Gemini 2.5 Flash • 6 Free Starter Rounds</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Master Technical Interviews with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Realistic AI Simulation
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 mx-auto max-w-3xl text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed"
          >
            Practice voice-driven mock interviews with webcam simulation, solve algorithmic challenges in Monaco editor with automated test cases, and scan your resume with AI ATS scoring.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <button
              onClick={handleStartClick}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/35 transition-all hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Free Practice</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 ring-offset-2 ring-offset-slate-950" />
            </button>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 px-7 py-4 text-base font-semibold text-slate-200 transition-all hover:text-white backdrop-blur-md cursor-pointer"
            >
              <Play className="h-4 w-4 text-blue-400" />
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              <span>6 Free practice sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span>Instant AI diagnostic score</span>
            </div>
          </motion.div>

          {/* Hero Realistic Mockup Preview */}
          <motion.div
            id="mockup-preview"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 sm:mt-18 relative mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/90 p-2 sm:p-4 shadow-2xl shadow-blue-500/10 backdrop-blur-xl"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-slate-400 text-[11px] hidden sm:inline">
                  HireReady AI • Live Simulation: Senior Full Stack Engineer
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-semibold">Active Session</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">14:22 remaining</span>
              </div>
            </div>

            {/* Mockup Inside Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 text-left">
              {/* Left Column: Interview Prompt & Audio Waveform */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/30">
                      Question 2 of 5 • System Architecture
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Difficulty: High</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 leading-snug">
                    &ldquo;How would you design a rate limiter for a distributed API handling 100,000 requests per second, and which algorithms would you consider?&rdquo;
                  </h3>

                  {/* Audio waveform simulation */}
                  <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 text-blue-400 animate-pulse" />
                        <span className="text-slate-300 font-medium">AI Recruiter Speaking...</span>
                      </div>
                      <span className="font-mono text-[11px] text-blue-400">Waveform Active</span>
                    </div>
                    <div className="flex items-center gap-1 h-7">
                      {[30, 65, 45, 90, 75, 40, 85, 95, 60, 40, 80, 50, 70, 90, 65, 45, 85, 100, 75, 40, 60, 80, 45, 90, 70].map((h, i) => (
                        <span
                          key={i}
                          className="flex-1 rounded-full bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Algorithmic Code Editor Sneak Peek */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                      <span>RateLimiter.js (Monaco Editor)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> 5/5 Test Cases Passed
                    </span>
                  </div>
                  <pre className="mt-3 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                    <code>{`class TokenBucketRateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per sec
    this.lastRefill = Date.now();
  }
  allowRequest(tokensRequired = 1) {
    this.refill();
    if (this.tokens >= tokensRequired) {
      this.tokens -= tokensRequired;
      return true; // Request allowed
    }
    return false; // Rate limit exceeded (429)
  }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Right Column: Candidate Webcam & Real-Time AI Diagnostics */}
              <div className="lg:col-span-5 space-y-4">
                {/* Webcam Mockup */}
                <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-800/50 to-slate-900/90" />
                  <div className="relative text-center p-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-300 mb-2 border border-slate-700">
                      <Video className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 block">Candidate Webcam Feed</span>
                    <span className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Eye Contact & Voice Active
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    Candidate: Alex Chen
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
                    Speech-to-Text Live
                  </div>
                </div>

                {/* Instant AI Evaluation Feedback */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> Real-time Gemini Diagnostic
                    </span>
                    <span className="text-sm font-extrabold text-white bg-emerald-600/40 border border-emerald-400/40 px-2 py-0.5 rounded-lg">
                      8.8 / 10
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Properly selected Token Bucket & Redis Cluster for distributed sync.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">△</span>
                      <span>Next step: Consider mentioning Sliding Window Counter for smoother traffic spikes.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="relative z-10 py-20 border-t border-slate-800/70 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
              Complete Preparation Ecosystem
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Everything You Need to Crack Top Tech Roles
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400">
              Engineered for FAANG, tier-1 product companies, and startup engineering interviews. From system design & algorithmic coding to ATS resume optimization.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. AI Technical Mock */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  AI Voice Technical Mock
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Real-time conversational interview simulation with speech-to-text voice recognition, webcam presence tracking, and instant multi-dimensional evaluation.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Speech Recognition</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Webcam Simulation</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Custom Role & Exp</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-blue-400 group-hover:text-blue-300 cursor-pointer"
              >
                <span>Launch Mock Interview</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* 2. Monaco Code Runner */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Live Algorithmic Coding
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Solve LeetCode-style algorithms in Monaco Editor (VS Code power). Test your solution against 5 automated test cases with Big-O time and space complexity feedback.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Monaco Editor</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">5 Automated Tests</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Big-O Analysis</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 cursor-pointer"
              >
                <span>Practice Coding Rounds</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* 3. Resume ATS Analyzer */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <FileSearch className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  AI Resume ATS Analyzer
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Upload PDF or image resumes with your desired company and role. Get 0-100 ATS scores, keyword match percentages, formatting audits, and rewrite suggestions.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">0-100 ATS Score</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Keyword Gap Match</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">PDF & Image Support</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 cursor-pointer"
              >
                <span>Analyze Your Resume</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* 4. Curated Study Sheets */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  Curated Study Sheets
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Instant access to the tech industry’s most acclaimed sheets: Striver’s SDE Sheet, NeetCode 150, LeetCode Top SQL 50, System Design Primer, and CS Core cheat sheets.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Striver&apos;s SDE Sheet</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">LeetCode SQL 50</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">System Design Primer</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-purple-400 group-hover:text-purple-300 cursor-pointer"
              >
                <span>Browse Curated Sheets</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* 5. HireReady Chatbot Feature Teaser */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                    <BotMessageSquare className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                    Coming Soon
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                  HireReady AI Chatbot
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Your 24/7 conversational mentor. Ask coding hints, solve interview doubts, review behavioral STAR stories, and get instant resume bullet point rewrites.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">24/7 AI Coach</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Algorithmic Doubts</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">STAR Responses</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-violet-400 group-hover:text-violet-300 cursor-pointer"
              >
                <span>View Dashboard Feature</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* 6. Realistic Recruiter Analytics */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  Detailed AI Feedback
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  Never wonder how you did. Receive comprehensive diagnostic feedback highlighting your conceptual strengths, missed edge cases, and Gemini-generated ideal answers.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Score Out of 10</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Model Answers</span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">Strengths & Gaps</span>
                </div>
              </div>
              <button
                onClick={handleStartClick}
                className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-amber-400 group-hover:text-amber-300 cursor-pointer"
              >
                <span>Start Evaluation</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 border-t border-slate-800/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Simple 3-Step Process
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Setup to Feedback in Minutes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Zero hassle configuration. Start your interview session right in your browser.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold text-xl mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Define Target Role & Stack</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enter your role (e.g. Frontend Engineer, DevOps, Full Stack), years of experience, and job description to personalize questions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold text-xl mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Live Voice & Code Simulation</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Respond out loud using speech recognition with webcam presence or write algorithmic solutions in our Monaco code editor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-extrabold text-xl mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Instant AI Diagnostic Report</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Receive ratings, comparison with ideal industry responses, strengths, weaknesses, and a concrete roadmap to score higher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Study Sheets Teaser Section */}
      <section id="curated-sheets" className="relative z-10 py-20 border-t border-slate-800/70 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                Community Roadmaps & Sheets
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Top Curated Study Sheets Included
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Pre-indexed official resources to hone your algorithmic and system design mastery.
              </p>
            </div>
            <button
              onClick={handleStartClick}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Access All Sheets in Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  180+ Problems
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Striver&apos;s SDE Sheet</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                The gold standard for product-based company coding interviews by Raj Vikramaditya.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <Database className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  Top 50 Queries
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">LeetCode Top SQL 50</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Joins, aggregations, Window functions & complex CTE query patterns for backend and data roles.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  260k+ Stars
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">System Design Primer</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Learn how to design scalable architectures, microservices, load balancing, and distributed databases.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  Core Subjects
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">CS Fundamentals</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                High-yield revision notes for Operating Systems, DBMS ACID properties, and Computer Networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="relative z-10 py-20 border-t border-slate-800/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Candidate Success
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Loved by Engineers Preparing for Top Firms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;The voice mock interview with webcam simulated the exact pressure of my actual frontend interview. The Gemini feedback on my explanation of React Fiber was spot on.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="h-9 w-9 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-blue-300">
                  RK
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Rohan K.</h5>
                  <span className="text-[11px] text-slate-400">Frontend Engineer</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;Being able to solve coding rounds in Monaco editor with automated test cases and immediate Big-O feedback saved me weeks of unfocused prep.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="h-9 w-9 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                  SM
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Sanya M.</h5>
                  <span className="text-[11px] text-slate-400">Backend SDE Candidate</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;The ATS resume analyzer pointed out 6 missing key technical skills for my target Senior Cloud Architect role. Boosted my score from 58 to 91.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="h-9 w-9 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center font-bold text-xs text-emerald-300">
                  AT
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Arjun T.</h5>
                  <span className="text-[11px] text-slate-400">Cloud Infrastructure Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA Banner */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-400/30 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Start Your Free Preparation
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Ready to Land Your Dream Tech Offer?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Take your first AI technical interview or test your algorithmic coding skills today. 6 free starter sessions included with no credit card required.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartClick}
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-950 shadow-xl transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Free Now</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
              HR
            </div>
            <span className="font-bold text-white text-sm">HireReady AI</span>
            <span className="text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handleStartClick} className="hover:text-white transition-colors cursor-pointer">
              Dashboard
            </button>
            <button onClick={handleStartClick} className="hover:text-white transition-colors cursor-pointer">
              Sign In
            </button>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#curated-sheets" className="hover:text-white transition-colors">
              Study Sheets
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Background Particle Constellation
function AnimatedConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = `rgba(96, 165, 250, ${Math.random() * 0.25 + 0.08})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particlesArray = [];
    const numberOfParticles = Math.min(65, Math.floor(window.innerWidth / 20));

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    function connect() {
      const maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.12;
            ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      connect();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 h-full w-full opacity-60"
    />
  );
}