/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESUNE_ANALYZER_GEMINI_API: process.env.RESUNE_ANALYZER_GEMINI_API,
    RESUME_ANALYZER_GEMINI_API: process.env.RESUME_ANALYZER_GEMINI_API,
    NEXT_PUBLIC_RESUME_ANALYZER_GEMINI_API: process.env.NEXT_PUBLIC_RESUME_ANALYZER_GEMINI_API,
  },
};

export default nextConfig;

