"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";

function Interview() {
    const params = useParams();
    const [interviewData,setInterviewData]=useState(); 
    // const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
    const [webCamEnabled, setWebCamEnabled ]  = useState(false);


    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, []);
    // used to get the interview details through mockId/InterviewId
    const GetInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
    };

    return(
        <div className="my-5">
        <h2 className="font-bold text-2xl text-center text-blue-500">Let's Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col p-5 rounded-lg border gap-5">
              <h2 className="text-sm text-gray-500">
                <strong className='text-blue-500'>Job Role/Job Position: </strong>
                {interviewData?.jobPosition}
              </h2>
              <h2 className="text-sm text-gray-500">
                <strong className='text-blue-500'>Job Description/Job Stack: </strong>
                {interviewData?.jobDesc}
              </h2>
              <h2 className="text-sm text-gray-500">
                <strong className='text-blue-500'>Years of Experience: </strong>
                {interviewData?.jobExperience}
              </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
              <h2 className="flex gap-2 items-center text-yellow-700 mb-2">
                <Lightbulb />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-xs text-yellow-500">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </h2>
            </div>
          </div>
          <div>
            {webCamEnabled ? <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  height={300}
                  width={300}
                  mirrored={true}
                />
              :
              <div>
                <WebcamIcon className="h-55 w-full my-4 p-20 bg-secondary rounded-lg border" />
                <Button
                onClick={() => setWebCamEnabled(true)}
                className={`${webCamEnabled ? "w-full" : "w-full"} bg-blue-300`}>
                {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
              </Button>
              </div>
            }
          </div>
        </div>
        <div className="flex justify-center my-4 md:-my-13 md:justify-end md:items-end">
          <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
            <Button className='bg-blue-500 '>Start Interview</Button>
          </Link>
        </div>
      </div>
    ) 
}

export default Interview;
