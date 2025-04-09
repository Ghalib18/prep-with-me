"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/Gemini_AI'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import {v4 as uuidv4} from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from "next/navigation";



  
function AddNewinterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobRole ,setJobRole]=useState()
    const [jobDesc ,setJobDesc]=useState()
    const [jobExp ,setJobExp]=useState()
    const [loading, setLoading]=useState(false)
    const [jsonResponse,setJsonResponse]=useState([])
    const {user}=useUser()
    const router = useRouter()

    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault()
        const InputPrompt = `
        Job Positions: ${jobRole}, 
        Job Description: ${jobDesc}, 
        Years of Experience: ${jobExp}. 
        Based on this information, please provide 5 interview questions with answers in JSON format, ensuring "Question" and "Answer" are fields in the JSON.
      `;
        const result=await chatSession.sendMessage(InputPrompt)
        const MockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "")
        .trim();
        console.log(JSON.parse(MockJsonResp))
        setJsonResponse(MockJsonResp);
        if( MockJsonResp){
         const resp=await db.insert(MockInterview)
         .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobRole,
            jobDesc:jobDesc,
            jobExperience:jobExp,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY")
         }).returning({mockId:MockInterview.mockId})
         console.log("Inserted ID:",resp);
         if(resp){
          router.push('/dashboard/interview/'+resp[0]?.mockId+'/technicalround')
          setOpenDailog(false);
         }
        }
        else{
            console.log("error")
        }
        setLoading(false)
    }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDailog(true)}>
        <h2  className='font-bold text-lg text-center text-blue-500'> Technical Round</h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Tell us about your job interview</DialogTitle>
            <DialogDescription>
                
            </DialogDescription>
            <form onSubmit={onSubmit}>
            <div>
                    <h2>Add details about job position,job description and year of experience</h2>
                    <div className='mt-7 my-2'>
                        <label className='font-semibold'>Job Role/Job Position</label>
                        <Input placeholder="Ex. Full Stack developer"  required onChange={(event)=>setJobRole(event.target.value)}/>
                    </div>
                    <div className=' my-2'>
                        <label className='font-semibold '>Job Description/Tech-stack</label>
                        <Textarea  placeholder="Ex. React,Next.js,Sql" required
                        onChange={(event)=>setJobDesc(event.target.value)}/>
                    </div>
                    <div className='my-2'>
                        <label className='font-semibold'>Year of Experience</label>
                        <Input placeholder="Ex. 1" type="number" required
                        onChange={(event)=>setJobExp(event.target.value)}/>
                    </div>
                </div>
            <div className='flex gap-5 justify-end'>
               <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>cancel</Button>
                <Button type="submit" disabled={loading} className='bg-blue-400'>
                    {loading?
                    <>
                    <LoaderCircle className='animate-spin'/>'Generating from AI'
                    </>:'Start Interview'
                    }</Button>
            </div>
            </form>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewinterview
