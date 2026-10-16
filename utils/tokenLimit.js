import { db } from "@/utils/db";
import { MockInterview, CodingInterview, ResumeAnalysis } from "@/utils/schema";
import { eq } from "drizzle-orm";

export const FREE_LIMITS = {
  technical: 2,
  coding: 2,
  resume: 2,
  total: 6,
};

export async function getUserUsage(userEmail) {
  if (!userEmail) {
    return {
      technical: 0,
      coding: 0,
      resume: 0,
      total: 0,
      technicalRemaining: 2,
      codingRemaining: 2,
      resumeRemaining: 2,
      isTechnicalExhausted: false,
      isCodingExhausted: false,
      isResumeExhausted: false,
      isTotalExhausted: false,
    };
  }

  try {
    const techRounds = await db
      .select({ id: MockInterview.id })
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail));

    const codingRounds = await db
      .select({ id: CodingInterview.id })
      .from(CodingInterview)
      .where(eq(CodingInterview.createdBy, userEmail));

    const resumeAnalyses = await db
      .select({ id: ResumeAnalysis.id })
      .from(ResumeAnalysis)
      .where(eq(ResumeAnalysis.createdBy, userEmail));

    const technicalCount = techRounds.length;
    const codingCount = codingRounds.length;
    const resumeCount = resumeAnalyses.length;
    const totalCount = technicalCount + codingCount + resumeCount;

    return {
      technical: technicalCount,
      coding: codingCount,
      resume: resumeCount,
      total: totalCount,
      technicalRemaining: Math.max(0, FREE_LIMITS.technical - technicalCount),
      codingRemaining: Math.max(0, FREE_LIMITS.coding - codingCount),
      resumeRemaining: Math.max(0, FREE_LIMITS.resume - resumeCount),
      isTechnicalExhausted: technicalCount >= FREE_LIMITS.technical,
      isCodingExhausted: codingCount >= FREE_LIMITS.coding,
      isResumeExhausted: resumeCount >= FREE_LIMITS.resume,
      isTotalExhausted: totalCount >= FREE_LIMITS.total,
    };
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return {
      technical: 0,
      coding: 0,
      resume: 0,
      total: 0,
      technicalRemaining: 2,
      codingRemaining: 2,
      resumeRemaining: 2,
      isTechnicalExhausted: false,
      isCodingExhausted: false,
      isResumeExhausted: false,
      isTotalExhausted: false,
    };
  }
}
