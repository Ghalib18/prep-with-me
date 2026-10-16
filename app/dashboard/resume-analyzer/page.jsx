"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { ResumeAnalysis } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { toast } from "sonner";
import {
  FileSearch,
  Upload,
  FileText,
  Sparkles,
  Trash2,
  Clock,
  Eye,
  Building2,
  Briefcase,
  Layers,
  Award,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PlusCircle,
  FileCheck2,
  History,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ResumeReportView from "./_components/ResumeReportView";
import LimitReachedDialog from "@/components/LimitReachedDialog";


const EXPERIENCE_OPTIONS = [
  "Entry Level / Fresher (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-8 years)",
  "Lead / Staff (8+ years)",
];

export default function ResumeAnalyzerPage() {
  const { user } = useUser();
  const fileInputRef = useRef(null);

  // Form State
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[1]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis & View State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [currentReport, setCurrentReport] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [activeTab, setActiveTab] = useState("new"); // "new" | "history" | "report"

  // History State
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  const ANALYSIS_STEPS = [
    "Reading & parsing document layout...",
    "Matching tech stack & keywords against target role...",
    "Running ATS compliance and impact verification...",
    "Formulating recruiter verdict and improvement roadmap...",
  ];

  // Fetch history when user is available
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) return;

      const result = await db
        .select()
        .from(ResumeAnalysis)
        .where(eq(ResumeAnalysis.createdBy, userEmail))
        .orderBy(desc(ResumeAnalysis.id));

      setHistoryList(result || []);
    } catch (error) {
      console.error("Error fetching resume history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // File selection & drag-and-drop
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processSelectedFile(file);
  };

  const processSelectedFile = (file) => {
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or an Image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please upload a smaller file.");
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processSelectedFile(file);
  };

  // Convert File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.toString().split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Analyze Resume
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!jobRole.trim()) {
      toast.error("Please provide a target job role.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload your resume file (PDF or Image).");
      return;
    }

    if (historyList.length >= 2) {
      setLimitDialogOpen(true);
      return;
    }

    setAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    try {
      const base64Data = await fileToBase64(selectedFile);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: base64Data,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
          jobRole: jobRole.trim(),
          companyName: companyName.trim(),
          techStack: techStack.trim(),
          experience: experience,
          additionalInfo: additionalInfo.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to analyze resume.");
      }

      const parsedAnalysis = result.data;
      const analysisUuid = uuidv4();
      const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";
      const createdDate = moment().format("DD-MM-YYYY");

      // Save to Neon Postgres DB via Drizzle
      await db.insert(ResumeAnalysis).values({
        analysisId: analysisUuid,
        jobRole: jobRole.trim(),
        companyName: companyName.trim() || "Not specified",
        techStack: techStack.trim() || "",
        experience: experience,
        additionalInfo: additionalInfo.trim() || "",
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        overallScore: String(parsedAnalysis.overallScore || 75),
        feedbackJson: JSON.stringify(parsedAnalysis),
        createdBy: userEmail,
        createdAt: createdDate,
      });

      toast.success("Resume analyzed successfully!");

      const meta = {
        analysisId: analysisUuid,
        jobRole: jobRole.trim(),
        companyName: companyName.trim(),
        techStack: techStack.trim(),
        fileName: selectedFile.name,
        createdAt: createdDate,
      };

      setCurrentReport(parsedAnalysis);
      setCurrentMetadata(meta);
      setActiveTab("report");

      // Refresh history list
      fetchHistory();
    } catch (error) {
      console.error("Resume analysis error:", error);
      toast.error(error.message || "Failed to analyze resume. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setAnalyzing(false);
    }
  };

  // View a past analysis
  const handleViewPastReport = (item) => {
    try {
      const parsed = JSON.parse(item.feedbackJson);
      setCurrentReport(parsed);
      setCurrentMetadata({
        analysisId: item.analysisId,
        jobRole: item.jobRole,
        companyName: item.companyName,
        techStack: item.techStack,
        fileName: item.fileName,
        createdAt: item.createdAt,
      });
      setActiveTab("report");
    } catch (e) {
      toast.error("Could not load report details.");
    }
  };

  // Delete an analysis from history
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await db
        .delete(ResumeAnalysis)
        .where(eq(ResumeAnalysis.analysisId, deleteTarget.analysisId));

      toast.success("Analysis deleted from history");
      setDeleteTarget(null);
      fetchHistory();

      if (currentMetadata?.analysisId === deleteTarget.analysisId) {
        setCurrentReport(null);
        setCurrentMetadata(null);
        setActiveTab("history");
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast.error("Failed to delete analysis record.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <FileSearch className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              AI Resume Analyzer & ATS Scanner
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Evaluate your resume against target roles, companies & tech stacks with actionable recruiter insights.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 bg-secondary/80 p-1 rounded-xl border border-border/80 text-xs">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "new"
                ? "bg-white text-emerald-700 shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" /> Analyze Resume
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-emerald-700 shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="h-3.5 w-3.5" /> Analysis History
            {historyList?.length > 0 && (
              <span className="ml-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 font-bold">
                {historyList.length}
              </span>
            )}
          </button>
          {currentReport && (
            <button
              onClick={() => setActiveTab("report")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "report"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="h-3.5 w-3.5" /> Current Report
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: REPORT VIEW */}
      {activeTab === "report" && currentReport && (
        <ResumeReportView
          report={currentReport}
          metadata={currentMetadata}
          onBack={() => setActiveTab("history")}
          onNewAnalysis={() => setActiveTab("new")}
        />
      )}

      {/* VIEW 2: NEW ANALYSIS FORM */}
      {activeTab === "new" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {analyzing ? (
            /* Multi-step Scanning & Analyzing Overlay */
            <div className="rounded-3xl border border-emerald-300/80 bg-gradient-to-br from-card via-card to-emerald-50/30 p-10 text-center shadow-lg space-y-6">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Analyzing Your Resume with Gemini AI...
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Comparing with target role benchmarks and ATS filtering algorithms.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2 text-left bg-secondary/50 rounded-2xl p-4 border border-border/80 text-xs">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-all duration-300 ${
                      idx === analysisStep
                        ? "text-emerald-700 font-bold"
                        : idx < analysisStep
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {idx < analysisStep ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : idx === analysisStep ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 ml-1 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAnalyze} className="space-y-6">
              {/* Form Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-border/80 pb-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                    Target Job Profile & Requirements
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide the position parameters so the AI recruiter can assess exact fitment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Target Role / Job Title <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Target Company Name
                    </label>
                    <Input
                      placeholder="e.g. Google, Amazon, Stripe, or Early Stage Startup"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Required Tech Stack / Keywords
                    </label>
                    <Input
                      placeholder="e.g. React, Next.js, Node.js, TypeScript, PostgreSQL, Tailwind"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Expected Experience Level
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                    >
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Additional Context / Job Description Snippet (Optional)
                  </label>
                  <Textarea
                    placeholder="Paste job description snippets, specific team expectations, or areas you want the AI to focus on..."
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="text-xs resize-none"
                  />
                </div>

                {/* Resume Upload Area */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>
                      Upload Resume Document <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      Supported: PDF, PNG, JPG, WEBP (Max 10MB)
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-border hover:border-emerald-400 hover:bg-emerald-50/20"
                      }`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform shadow-sm">
                        <Upload className="h-6 w-6" />
                      </div>
                      <h4 className="mt-4 text-sm font-bold text-foreground">
                        Drag and drop your resume here, or <span className="text-emerald-600 underline">browse</span>
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF format is recommended for highest ATS accuracy. Images also accepted.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 truncate">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Resume Preview"
                            className="h-12 w-12 rounded-lg object-cover border border-emerald-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
                            <FileText className="h-6 w-6" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-foreground truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || "Document"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeSelectedFile}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={analyzing || !selectedFile || !jobRole.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 font-semibold shadow-md shadow-emerald-600/20 px-8 py-2.5 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" /> Analyze Resume with AI
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* VIEW 3: ANALYSIS HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Your Resume Analysis History
              </h2>
              <p className="text-xs text-muted-foreground">
                Review past reports, tracked scores, and recommendations.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab("new")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Analyze New Resume
            </Button>
          </div>

          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 border rounded-2xl bg-card space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : historyList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">No analyses found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have not analyzed any resumes yet. Upload a resume to get your first detailed ATS score and improvement recommendations!
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("new")}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Analyze First Resume
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyList.map((item) => {
                const score = Number(item.overallScore) || 75;
                return (
                  <div
                    key={item.analysisId}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-600 transition-colors">
                            {item.jobRole}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="h-3 w-3" />
                            <span>{item.companyName || "Standard Industry"}</span>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                            score >= 80
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : score >= 60
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {score}/100
                        </span>
                      </div>

                      {/* File Name & Date */}
                      <div className="my-3 space-y-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.fileName || "Uploaded Resume"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{item.createdAt}</span>
                        </div>
                      </div>

                      {/* Tech Stack snippet */}
                      {item.techStack && (
                        <div className="mb-4">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                            Target Stack
                          </p>
                          <p className="text-xs text-foreground/80 line-clamp-1 bg-secondary/50 rounded-md px-2 py-1 border border-border/60">
                            {item.techStack}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border/70 mt-auto">
                      <Button
                        size="sm"
                        onClick={() => handleViewPastReport(item)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-8 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Report
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(item)}
                        className="h-8 px-2.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-base">
              Delete Resume Analysis?
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Are you sure you want to remove the analysis for{" "}
              <strong className="text-foreground">{deleteTarget?.jobRole}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="gap-1.5 text-xs cursor-pointer"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Free Tier Limit Dialog */}
      <LimitReachedDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        featureName="Resume ATS Analyzer"
        currentCount={historyList.length}
        maxLimit={2}
      />
    </div>
  );
}
