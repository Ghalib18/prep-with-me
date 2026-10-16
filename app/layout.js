import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireReady AI - AI Mock Interview, Algorithmic Coding & Resume Analyzer",
  description: "Prepare for your dream tech career with HireReady AI: voice-driven mock interviews, Monaco coding assessments, ATS resume analyzer, and curated study sheets.",
};


export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider >
      <html lang="en">
        <body className={inter.className}>
          <Toaster/>
            {children}
          </body>
      </html>
    </ClerkProvider>
  );
};