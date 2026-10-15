"use client";
import React, { useState, useEffect } from "react";
import { Lightbulb, Volume2, VolumeX, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuestionSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech if question changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [activeQuestionIndex]);

  const toggleTextToSpeech = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text to speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      speech.pitch = 1.0;
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(speech);
    }
  };

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return null;
  }

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[460px]">
      <div>
        {/* Question Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {mockInterviewQuestion.map((_, index) => {
            const isActive = activeQuestionIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveQuestionIndex && setActiveQuestionIndex(index)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>Q{index + 1}</span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
              <HelpCircle className="h-3.5 w-3.5" /> Question {activeQuestionIndex + 1} of{" "}
              {mockInterviewQuestion.length}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleTextToSpeech(currentQuestion?.Question)}
              className={`rounded-xl gap-2 text-xs transition-colors ${
                isSpeaking
                  ? "border-blue-400 bg-blue-50 text-blue-600 animate-pulse"
                  : "hover:text-blue-600"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" /> Stop Reading
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" /> Listen Question
                </>
              )}
            </Button>
          </div>

          <h2 className="mt-4 text-lg md:text-xl font-bold text-foreground leading-snug">
            {currentQuestion?.Question}
          </h2>
        </div>
      </div>

      {/* Structured Guidelines Box */}
      <div className="mt-6 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-card p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Lightbulb className="h-4 w-4 shrink-0 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Interview Tips</h4>
        </div>
        <p className="mt-1.5 text-xs text-blue-900/80 leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "Click 'Record Answer' when ready. Explain your reasoning clearly, discuss trade-offs, and state assumptions before concluding."}
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;
