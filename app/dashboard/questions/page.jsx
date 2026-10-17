import React from "react";
import StudyMaterialSection from "../_component/StudyMaterialSection";

const Questions = () => {
  return (
    <div className="p-6 md:p-10">
      <div className="border-b border-border/80 pb-4">
        <h1 className="font-bold text-2xl text-blue-600 tracking-tight">Curated Questions & Study Sheets</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Access top community roadmaps, Striver's SDE sheet, LeetCode SQL 50, System Design, and practice interview question sheets.
        </p>
      </div>

      {/* Curated Study Materials & Question Sheets */}
      <StudyMaterialSection />
    </div>
  );
};

export default Questions;