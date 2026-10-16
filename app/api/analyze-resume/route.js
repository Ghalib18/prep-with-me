import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fileBase64,
      mimeType,
      fileName,
      jobRole,
      companyName,
      techStack,
      experience,
      additionalInfo,
    } = body;

    if (!fileBase64 || !jobRole) {
      return NextResponse.json(
        { error: "Resume file and target role are required." },
        { status: 400 }
      );
    }

    // Prioritize RESUNE_ANALYZER_GEMINI_API as explicitly requested
    const apiKey =
      process.env.RESUNE_ANALYZER_GEMINI_API ||
      process.env.NEXT_PUBLIC_RESUME_ANALYZER_GEMINI_API ||
      process.env.RESUME_ANALYZER_GEMINI_API ||
      process.env.NEXT_PUBLIC_RESUNE_ANALYZER_GEMINI_API ||
      process.env.NEXT_PUBLIC_GEMINI_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const filePart = {
      inlineData: {
        data: fileBase64,
        mimeType: mimeType || "application/pdf",
      },
    };

    const prompt = `
You are a Staff Technical Recruiter and Senior ATS (Applicant Tracking System) Hiring Specialist.
Evaluate the uploaded resume against the following target candidate profile:

- Target Job Role: ${jobRole}
- Target Company: ${companyName || "Top Tier Tech / Industry standard"}
- Target Tech Stack: ${techStack || "Standard stack for " + jobRole}
- Experience Level / Years: ${experience || "Not specified (evaluate against standard requirements for role)"}
- Additional Role Context / Requirements: ${additionalInfo || "None provided"}

TASK:
1. Conduct a deep, meticulous ATS parse and human recruiter evaluation of the candidate's resume.
2. Score the resume objectively out of 100 based on ATS pass probability, role alignment, tech stack match, and impact phrasing.
3. Identify strong points, critical flaws, missing keywords, and detailed room for improvement with concrete advice.
4. Return ONLY a valid JSON object matching the exact structure below. Do not wrap in markdown or backticks.

REQUIRED JSON FORMAT:
{
  "overallScore": 84,
  "scoreCategory": "Strong Match",
  "atsScore": 88,
  "skillsMatchScore": 80,
  "experienceMatchScore": 85,
  "formattingScore": 90,
  "summaryVerdict": "Executive summary from recruiter: 2-3 sentences explaining candidate readiness and the single highest leverage improvement.",
  "strengths": [
    "Clear project achievements showing practical full-stack capabilities",
    "Clean resume layout easily parseable by standard ATS systems"
  ],
  "weaknesses": [
    "Bullet points lack quantifiable metrics (e.g., % improvement, revenue, latency)",
    "Missing crucial industry keywords specified in modern tech stacks"
  ],
  "roomForImprovement": [
    {
      "category": "Quantifiable Impact & Metrics",
      "severity": "High",
      "critique": "Descriptions explain what was worked on, but not the measurable impact or scale.",
      "recommendation": "Use the X-Y-Z formula (e.g., 'Reduced query latency by 45% by introducing Redis caching for 100k daily active users')."
    },
    {
      "category": "Keyword & Tech Alignment",
      "severity": "Medium",
      "critique": "Target technologies like Docker, CI/CD, or PostgreSQL are not clearly highlighted in project bullets.",
      "recommendation": "Explicitly mention relevant tools inside bullet points rather than only in a skills list."
    },
    {
      "category": "Action Verbs & Framing",
      "severity": "Medium",
      "critique": "Passive phrasing like 'Helped with' or 'Responsible for' weakens candidate authority.",
      "recommendation": "Start every bullet with strong action verbs: Spearheaded, Architected, Engineered, Optimized."
    }
  ],
  "techStackAnalysis": {
    "matchedSkills": ["JavaScript", "React", "Node.js", "Tailwind CSS"],
    "missingSkills": ["TypeScript", "Next.js", "PostgreSQL", "Docker", "AWS"],
    "additionalNoticedSkills": ["HTML5", "CSS3", "Git"]
  },
  "sectionReview": [
    {
      "section": "Contact Information & Links",
      "score": 95,
      "status": "Great",
      "notes": "Complete contact info with working portfolio and GitHub links."
    },
    {
      "section": "Professional Summary",
      "score": 80,
      "status": "Needs Polish",
      "notes": "Make it sharper and directly tailored to the target company and role."
    },
    {
      "section": "Work Experience & Projects",
      "score": 78,
      "status": "Needs Improvement",
      "notes": "Inject more numbers, metrics, and business outcomes."
    },
    {
      "section": "Technical Skills",
      "score": 85,
      "status": "Good",
      "notes": "Group skills logically into Languages, Frameworks, Cloud/DevOps, and Databases."
    },
    {
      "section": "Education & Certifications",
      "score": 90,
      "status": "Great",
      "notes": "Well structured with clear dates and degree."
    }
  ],
  "actionableRoadmap": [
    "Add at least 1 numerical metric to every bullet point in recent experience",
    "Integrate target tech stack keywords throughout project descriptions",
    "Customize the summary statement to explicitly target the desired role"
  ]
}
`;

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();

    // Clean JSON response (strip markdown fences if present)
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const analysisData = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error("Resume Analysis API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze resume. Please try again.",
      },
      { status: 500 }
    );
  }
}
