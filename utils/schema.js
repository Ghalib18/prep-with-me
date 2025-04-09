import { serial, text, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});
export const UserAnswer = pgTable('userAnswer',{
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt')
});
export const Question = pgTable('question', {
    id: serial('id').primaryKey(),
    MockQuestionJsonResp: text('MockQuestionJsonResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    typeQuestion: varchar('typeQuestion').notNull(),
    company: varchar('company').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});
export const CodingInterview = pgTable("codingInterview", {
    id: serial("id").primaryKey(),
    jsonMockResp: text("jsonMockResp").notNull(),
    jobPosition: varchar("jobPosition").notNull(),
    language: varchar("language").notNull(),
    jobExperience: varchar("jobExperience").notNull(),
    createdBy: varchar("createdBy").notNull(),
    createdAt: varchar("createdAt").notNull(),
    mockId: varchar("mockId").notNull(),
  });
  
  export const CodingFeedback = pgTable("codingFeedback", {
    id: serial("id").primaryKey(),
    mockIdRef: varchar("mockId").notNull(),
    question: varchar("question").notNull(),
    correctAns: text("correctAns"),
    userAns: text("userAns"),
    feedback: text("feedback"),
    userEmail: varchar("userEmail"),
    createdAt: varchar("createdAt"),
  });