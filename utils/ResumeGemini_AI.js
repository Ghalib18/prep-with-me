const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Prioritize RESUNE_ANALYZER_GEMINI_API as requested, with graceful fallbacks
const apiKey =
  process.env.RESUNE_ANALYZER_GEMINI_API ||
  process.env.NEXT_PUBLIC_RESUME_ANALYZER_GEMINI_API ||
  process.env.RESUME_ANALYZER_GEMINI_API ||
  process.env.NEXT_PUBLIC_RESUNE_ANALYZER_GEMINI_API ||
  process.env.NEXT_PUBLIC_GEMINI_API;

const genAI = new GoogleGenerativeAI(apiKey);

export const getResumeAnalyzerModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
};

export const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
