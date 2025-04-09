import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Header from "./_component/Header"
import AddNewinterview from './_component/AddNewinterview'
import InterviewList from './_component/InterViewList'
import AddNewCodingRound from './_component/AddNewCodingRound'
import CodingRoundList from './_component/CodingRoundList'

function Layout() {
  return (
    <div className='p-10'>
     <h2 className='font-bold text-2xl text-blue-500'>Dashboard</h2>
     <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
     <div className='grid grid-cols-1 md:grid-cols-3 my-5 gap-4'>
       <AddNewinterview/>
       <AddNewCodingRound/>
     </div>
     <InterviewList/>
     <CodingRoundList/>
    </div>
  )
}

export default Layout