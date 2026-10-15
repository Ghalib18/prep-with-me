"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Mic, Square, Video, VideoOff, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/Gemini_AI";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastSavedAnswer, setLastSavedAnswer] = useState("");
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API);

  // Timer effect for recording duration
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // When recording finishes and userAnswer has been transcribed, update DB
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info("Microphone recording started. Speak your answer clearly.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Microphone access denied. Please verify your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result.split(",")[1];
          const result = await model.generateContent([
            "Transcribe the following audio accurately:",
            { inlineData: { data: base64Audio, mimeType: "audio/webm" } },
          ]);

          const transcription = result.response.text();
          setUserAnswer(transcription.trim());
          setLastSavedAnswer(transcription.trim());
        } catch (innerError) {
          console.error("Transcription generation error:", innerError);
          toast.error("Failed to transcribe audio. Please try again.");
          setLoading(false);
        }
      };
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Error during audio transcription.");
      setLoading(false);
    }
  };

  const updateUserAnswer = async () => {
    try {
      setLoading(true);
      const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

      const feedbackPrompt =
        "Question: " +
        currentQuestion?.Question +
        ", User Answer: " +
        userAnswer +
        ". Based on this technical interview question and candidate answer, please provide a rating (scale 1 to 10) and concise constructive feedback with areas of improvement in 3 to 5 lines. Return strictly in valid JSON format with keys 'rating' (number or string out of 10) and 'feedback' (string).";

      const result = await chatSession.sendMessage(feedbackPrompt);
      let MockJsonResp = result.response.text();

      // Clean markdown code fence if present
      MockJsonResp = MockJsonResp.replace(/```json/g, "").replace(/```/g, "").trim();

      let jsonFeedbackResp;
      try {
        jsonFeedbackResp = JSON.parse(MockJsonResp);
      } catch (e) {
        console.warn("Could not parse feedback as strict JSON, formatting fallback:", MockJsonResp);
        jsonFeedbackResp = {
          rating: "7",
          feedback: MockJsonResp,
        };
      }

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interData?.mockId,
        question: currentQuestion?.Question,
        correctAns: currentQuestion?.Answer,
        userAns: userAnswer,
        feedback: typeof jsonFeedbackResp?.feedback === "string" 
          ? jsonFeedbackResp.feedback 
          : JSON.stringify(jsonFeedbackResp?.feedback),
        rating: String(jsonFeedbackResp?.rating || "7"),
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      if (resp) {
        toast.success("Answer recorded and evaluated by AI!");
      }
      setUserAnswer("");
    } catch (error) {
      console.error("Error saving user answer:", error);
      toast.error("An error occurred while evaluating your response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[460px]">
      {/* Video Viewport Frame */}
      <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-border shadow-inner">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-2 border border-slate-800">
              <Video className="h-7 w-7" />
            </div>
            <p className="text-xs font-medium text-slate-300">Camera preview is off</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Toggle webcam below if needed</p>
          </div>
        )}

        {/* Live Recording HUD overlay */}
        {isRecording && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-red-600/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-lg animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>REC {formatTimer(recordingSeconds)}</span>
            </div>

            {/* Audio wave bars animation */}
            <div className="flex items-end gap-1 h-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
              <span className="w-1 bg-red-500 h-3 animate-pulse rounded-full" />
              <span className="w-1 bg-red-400 h-4 animate-bounce rounded-full" />
              <span className="w-1 bg-red-500 h-2 animate-pulse rounded-full" />
              <span className="w-1 bg-red-400 h-3 animate-bounce rounded-full" />
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
            <p className="text-xs font-medium tracking-wide">Transcribing & Grading Response...</p>
          </div>
        )}
      </div>

      {/* Control Action Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setWebCamEnabled((prev) => !prev)}
          className="rounded-xl gap-2 text-xs"
        >
          {webCamEnabled ? (
            <>
              <VideoOff className="h-3.5 w-3.5 text-muted-foreground" />
              Turn Off Cam
            </>
          ) : (
            <>
              <Video className="h-3.5 w-3.5 text-blue-600" />
              Turn On Cam
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          className={`rounded-xl gap-2 font-medium shadow-md transition-all ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Evaluating...
            </>
          ) : isRecording ? (
            <>
              <Square className="h-4 w-4 fill-white" />
              Stop Recording ({formatTimer(recordingSeconds)})
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Record Answer
            </>
          )}
        </Button>
      </div>

      {/* Transcribed Answer Preview Pill */}
      {lastSavedAnswer ? (
        <div className="mt-4 w-full rounded-xl bg-secondary/60 p-3 border border-border text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Answer Captured
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            "{lastSavedAnswer}"
          </p>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Audio is securely processed and evaluated via Google Gemini.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
