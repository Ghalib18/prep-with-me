import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const InterviewItemCard = ({interview}) => {

    const router = useRouter()
    const onStart = ()=>{
        router.push("/dashboard/interview/"+interview?.mockId+"/technicalround")
    }
    const onFeedback = ()=>{
        router.push("/dashboard/interview/"+interview?.mockId+"/technicalround/feedback")
    }
  return (
    <div className="border border-gray-500 bg-white shadow-sm rounded-lg p-3 mx-2 my-2 hover:shadow-black" >
        <h2 className='font-bold text-blue-500' >{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600' >{interview?.jobExperience} Years of experience</h2>
        <h2 className="text-xs text-gray-400" >Created At:{interview.createdAt}</h2>

        <div className='flex justify-between mt-2 gap-3 ' >
            <Button onClick={onFeedback} size="xs"  className="w-18 bg-blue-400 rounded-full" >Feedback</Button>
            <Button onClick={onStart} size="xs"  className="w-15 bg-blue-400 rounded-full">Start</Button>
        </div>
    </div>

  )
}

export default InterviewItemCard