"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Sparkles,
  ArrowLeft,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Decorative Aurora Background Glows */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Left Branding & Highlights Panel (Desktop) */}
      <div className="relative z-10 hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 border-r border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/40 backdrop-blur-xl">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white block">
                HireReady<span className="text-blue-500">.ai</span>
              </span>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest block">
                AI Career Preparation Suite
              </span>
            </div>
          </div>

          <div className="mt-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Create Your Free Account</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Start Your Journey with 6 Free Practice Sessions
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Join thousands of engineers practicing voice interviews, solving coding rounds, and optimizing their ATS resumes with Google Gemini AI.
            </p>
          </div>

          <div className="mt-10 space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>2 Full Voice Technical Interviews included</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>2 Live Algorithmic Monaco Coding Sessions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>2 Instant ATS Resume Scans & Feedback Reports</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Unlimited Access to Curated Question & Study Sheets</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Bank-grade Auth Security</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md lg:hidden mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm text-white">HireReady.ai</span>
          </div>
        </div>

        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Get Started Free
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
              Create your account to start practicing immediately
            </p>
          </div>

          <div className="w-full flex justify-center">
            <SignUp
              fallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-slate-900/90 border border-slate-800 shadow-2xl rounded-3xl p-6 backdrop-blur-xl w-full",
                  headerTitle: "text-white text-lg font-bold",
                  headerSubtitle: "text-slate-400 text-xs",
                  socialButtonsBlockButton:
                    "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl transition-colors font-medium text-xs py-2.5",
                  socialButtonsBlockButtonText: "text-slate-200 font-medium text-xs",
                  dividerLine: "bg-slate-800",
                  dividerText: "text-slate-500 text-xs",
                  formFieldLabel: "text-slate-300 text-xs font-semibold",
                  formFieldInput:
                    "bg-slate-950/80 border border-slate-800 text-white rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs py-2.5",
                  formButtonPrimary:
                    "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer",
                  footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold text-xs",
                  identityPreviewText: "text-slate-300 text-xs",
                  formFieldAction: "text-blue-400 hover:text-blue-300 text-xs",
                },
              }}
            />
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Protected by Clerk Authentication &bull; HireReady AI
          </div>
        </div>
      </div>
    </div>
  );
}