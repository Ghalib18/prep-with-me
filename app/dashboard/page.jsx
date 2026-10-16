import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Header from "./_component/Header"
import AddNewinterview from './_component/AddNewinterview'
import AddNewCodingRound from './_component/AddNewCodingRound'
import ResumeAnalyzerCard from './_component/ResumeAnalyzerCard'
import StudyMaterialCard from './_component/StudyMaterialCard'
import TokenUsageTracker from './_component/TokenUsageTracker'

function Layout() {
  return (
    <div className='p-6 md:p-10'>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div>
          <h1 className='font-bold text-2xl text-blue-600 tracking-tight'>Dashboard</h1>
          <p className='text-xs text-muted-foreground'>Prepare with AI Mock Interviews, Algorithmic Coding, Resume Analysis & Curated Sheets</p>
        </div>
      </div>

      {/* Free Plan Token Quota Tracker */}
      <TokenUsageTracker />

      {/* 4 Core Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-6 gap-4'>
        <AddNewinterview/>
        <AddNewCodingRound/>
        <ResumeAnalyzerCard/>
        <StudyMaterialCard/>
      </div>
    </div>
  )
}



export default Layout