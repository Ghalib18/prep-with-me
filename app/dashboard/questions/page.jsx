import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddQuestions from '../_component/AddQuestions'
import QuestionList from "../_component/QuestionList";
import StudyMaterialSection from "../_component/StudyMaterialSection";

const Questions = () => {
  return (
    <div className="p-6 md:p-10" >
      <div className="border-b border-border/80 pb-4">
        <h1 className="font-bold text-2xl text-blue-600 tracking-tight" >Curated Questions & Study Sheets</h1>
        <p className="text-xs text-muted-foreground mt-1" >
          Access top community roadmaps, Striver's SDE sheet, LeetCode SQL 50, System Design, and practice interview questions.
        </p>
      </div>

      {/* Curated Study Materials & Question Sheets */}
      <StudyMaterialSection/>

      {/* Custom Questions Creator & List */}
      <div className="mt-12 border-t border-border/80 pt-8">
        <h2 className="font-bold text-lg text-foreground mb-1">Custom Role Questions</h2>
        <p className="text-xs text-muted-foreground mb-4">Generate company & role specific questions using AI.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 my-5" >
          <AddQuestions/>
        </div>
        <QuestionList/>
      </div>
    </div>
  );
};


export default Questions;