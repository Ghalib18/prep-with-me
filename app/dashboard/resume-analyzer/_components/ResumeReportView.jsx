"use client";
import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Building2,
  Briefcase,
  Layers,
  ArrowLeft,
  Printer,
  Sparkles,
  TrendingUp,
  Target,
  FileCheck2,
  BadgeCheck,
  ChevronRight,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeReportView({
  report,
  metadata,
  onBack,
  onNewAnalysis,
}) {
  const [checkedItems, setCheckedItems] = useState({});

  if (!report) return null;

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const overallScore = Number(report.overallScore) || 75;
  const atsScore = Number(report.atsScore) || 80;
  const skillsScore = Number(report.skillsMatchScore) || 75;
  const expScore = Number(report.experienceMatchScore) || 70;
  const formatScore = Number(report.formattingScore) || 85;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500 border-emerald-500 bg-emerald-50/50";
    if (score >= 60) return "text-amber-500 stroke-amber-500 border-amber-500 bg-amber-50/50";
    return "text-rose-500 stroke-rose-500 border-rose-500 bg-rose-50/50";
  };

  const getScoreBadgeBg = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to History
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3 w-3" /> AI Analysis Report
              </span>
              {metadata?.createdAt && (
                <span className="text-xs text-muted-foreground">
                  Analyzed on {metadata.createdAt}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-1">
              {metadata?.jobRole || "Candidate"}
              {metadata?.companyName && (
                <span className="text-muted-foreground font-normal text-lg">
                  at <span className="text-foreground font-medium">{metadata.companyName}</span>
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
          {onNewAnalysis && (
            <Button
              size="sm"
              onClick={onNewAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs cursor-pointer"
            >
              <FileCheck2 className="h-3.5 w-3.5" /> Analyze Another Resume
            </Button>
          )}
        </div>
      </div>

      {/* Target Parameters Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-secondary/50 rounded-xl p-3 border border-border/60 text-xs">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Target Role</span>
            <span className="font-semibold text-foreground truncate">{metadata?.jobRole || "N/A"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-600 shrink-0" />
          <div className="truncate">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Target Company</span>
            <span className="font-semibold text-foreground truncate">{metadata?.companyName || "Industry Standard"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Tech Stack</span>
            <span className="font-semibold text-foreground truncate">{metadata?.techStack || "General Requirements"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600 shrink-0" />
          <div className="truncate">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Resume File</span>
            <span className="font-semibold text-foreground truncate">{metadata?.fileName || "Uploaded Resume"}</span>
          </div>
        </div>
      </div>

      {/* Score Overview Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-blue-50/20 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Radial Circular Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="stroke-muted/30"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className={`transition-all duration-1000 ease-out ${
                    overallScore >= 80
                      ? "stroke-emerald-500"
                      : overallScore >= 60
                      ? "stroke-amber-500"
                      : "stroke-rose-500"
                  }`}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={
                    2 * Math.PI * 52 * (1 - Math.min(overallScore, 100) / 100)
                  }
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {overallScore}
                </span>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeBg(
                  overallScore
                )}`}
              >
                <Award className="h-3.5 w-3.5" />
                {report.scoreCategory || (overallScore >= 80 ? "Strong Match" : overallScore >= 60 ? "Moderate Match" : "Needs Attention")}
              </span>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                {overallScore >= 80
                  ? "Highly competitive for ATS filters and recruiter screening."
                  : overallScore >= 60
                  ? "Solid foundation, but notable opportunities exist to maximize interview calls."
                  : "Critical improvements required to pass initial ATS filters."}
              </p>
            </div>
          </div>

          {/* Sub-Metrics Cards & Recruiter Verdict */}
          <div className="lg:col-span-8 space-y-5">
            {/* 4 Pillars Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80">
                <span className="text-[11px] font-semibold text-muted-foreground block">ATS Compatibility</span>
                <span className="text-xl font-bold text-foreground mt-1 block">{atsScore}%</span>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80">
                <span className="text-[11px] font-semibold text-muted-foreground block">Skills & Tech Match</span>
                <span className="text-xl font-bold text-foreground mt-1 block">{skillsScore}%</span>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${skillsScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80">
                <span className="text-[11px] font-semibold text-muted-foreground block">Experience Level</span>
                <span className="text-xl font-bold text-foreground mt-1 block">{expScore}%</span>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${expScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80">
                <span className="text-[11px] font-semibold text-muted-foreground block">Structure & Impact</span>
                <span className="text-xl font-bold text-foreground mt-1 block">{formatScore}%</span>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${formatScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recruiter Verdict Callout */}
            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Executive Recruiter Verdict
                  </h4>
                  <p className="mt-1 text-sm text-foreground/90 leading-relaxed">
                    {report.summaryVerdict ||
                      "The candidate profile shows strong foundational qualifications for the target role. Incorporating higher-impact quantitative bullet points and targeting specific missing keywords will substantially raise interview conversion rates."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Red Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-emerald-950">Key Strengths Found</h3>
          </div>
          <ul className="space-y-2.5">
            {report.strengths?.length > 0 ? (
              report.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground">No specific strengths recorded.</li>
            )}
          </ul>
        </div>

        {/* Primary Weaknesses / Red Flags */}
        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/20 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-rose-950">Identified Vulnerabilities</h3>
          </div>
          <ul className="space-y-2.5">
            {report.weaknesses?.length > 0 ? (
              report.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground">No critical vulnerabilities noted.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Tech Stack & Keywords Gap Analysis */}
      {report.techStackAnalysis && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Tech Stack & Keyword Alignment
              </h3>
              <p className="text-xs text-muted-foreground">
                Comparison of detected skills in your resume versus target role expectations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {/* Matched Skills */}
            <div className="space-y-2 rounded-xl bg-emerald-50/30 border border-emerald-100 p-4">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Matched Tech Keywords ({report.techStackAnalysis.matchedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.techStackAnalysis.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="space-y-2 rounded-xl bg-rose-50/30 border border-rose-100 p-4">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Missing / Recommended Keywords ({report.techStackAnalysis.missingSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.techStackAnalysis.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-800"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Detected Skills */}
            <div className="space-y-2 rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                Other Detected Skills ({report.techStackAnalysis.additionalNoticedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.techStackAnalysis.additionalNoticedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room for Improvement - High-Value Actionable Insights */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Room for Improvement & Specific Fixes
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct recommendations to elevate your resume from standard to top 5%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {report.roomForImprovement?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-secondary/30 p-4 flex flex-col justify-between space-y-3 hover:border-amber-400/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-xs text-foreground">
                    {item.category || `Improvement #${idx + 1}`}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.severity === "High"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.severity || "Suggested"} Priority
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Issue: </strong>
                  {item.critique}
                </p>
              </div>

              <div className="bg-white/80 rounded-lg p-2.5 border border-border/60 text-xs">
                <span className="font-semibold text-emerald-700 block mb-0.5">
                  💡 How to Fix:
                </span>
                <span className="text-foreground/90">{item.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section-by-Section Evaluation */}
      {report.sectionReview && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Section-by-Section Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Deep dive into each resume section's ATS score and content effectiveness
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {report.sectionReview.map((section, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {section.section}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        section.score >= 85
                          ? "bg-emerald-100 text-emerald-700"
                          : section.score >= 70
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {section.status || `${section.score}%`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {section.notes}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 sm:w-32 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        section.score >= 85
                          ? "bg-emerald-500"
                          : section.score >= 70
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-8 text-right">
                    {section.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Roadmap / Interactive Checklist */}
      {report.actionableRoadmap?.length > 0 && (
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ListTodo className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Action Checklist Before Applying
              </h3>
              <p className="text-xs text-muted-foreground">
                Check off items as you refine your resume document
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mt-4">
            {report.actionableRoadmap.map((item, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  checkedItems[idx]
                    ? "bg-emerald-50/80 border-emerald-300 text-muted-foreground line-through"
                    : "bg-card border-border/80 text-foreground hover:border-blue-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[idx]}
                  onChange={() => toggleCheck(idx)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs leading-relaxed font-medium">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
