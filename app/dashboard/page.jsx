import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Header from "./_component/Header"
import AddNewinterview from './_component/AddNewinterview'
import InterviewList from './_component/InterViewList'

function Layout() {
  return (
    <div className='p-10'>
     <h2 className='font-bold text-2xl text-blue-500'>Dashboard</h2>
     <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
     <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
       <AddNewinterview/>
     </div>
     <InterviewList/>
    </div>
  )
}

export default Layout