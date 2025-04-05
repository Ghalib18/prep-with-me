"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    getQuestionDetails();
  }, []);

  const getQuestionDetails = async () => {
    try {
      const result = await db
        .select()
        .from(Question)
        .where(eq(Question.mockId, params.pyqId));

      const raw = result[0]?.MockQuestionJsonResp || "";

      // Extract valid JSON array from string
      const jsonStart = raw.indexOf("[");
      const jsonEnd = raw.lastIndexOf("]");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid JSON format in response");
      }

      const cleaned = raw.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(cleaned);

      setQuestionData(parsed);
    } catch (error) {
      console.error("Error parsing or fetching question data:", error.message);
    }
  };

  return (
    questionData.length > 0 && (
      <div className="p-10 my-5">
        <Accordion type="single" collapsible>
          {questionData.map((item, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index} className="mb-5">
              <AccordionTrigger>{item?.Question}?</AccordionTrigger>
              <AccordionContent>{item?.Answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  );
};

export default Page;
