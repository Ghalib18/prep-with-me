"use client"
import React,{useEffect} from 'react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";
import { toast } from "sonner";
function Header() {
 const router=useRouter()
  const path=usePathname();

  const handleClick = () => {
    if (path === '/dashboard') {
      router.refresh() // Reload the current page
    } 
      router.push('/dashboard');
  };
  const Click_Question = () => {
      router.push('/dashboard/questions');
  };
  const Click_upgrade = () => {
    router.push('/dashboard/upgrade');
};
  const Click_HowIt = () => {
    router.push('/dashboard/howit');
  };

  useEffect(()=>{
    console.log(path)
  },[])
  return (
    <div className='flex p-3 items-center justify-between bg-secondary shadow-md'>
      <div onClick={handleClick} className='flex items-center cursor-pointer pl-1 select-none hover:opacity-90 transition-opacity'>
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          HireReady AI
        </span>
      </div>
      <ul className='hidden md:flex gap-6 items-center'>

        <li  onClick={handleClick}className={`hover:text-blue-600 hover:font-bold  text-blue-500 transition-all cursor-pointer
        ${path=='/dashboard'&&'text-blue-700 font-bold'}
        `}
        >Dashboard</li>
        <li onClick={Click_Question}className={`hover:text-blue-600 hover:font-bold  text-blue-500 transition-all cursor-pointer
        ${path=='/dashboard/questions'&&'text-blue-700 font-bold'}
        `}>Questions</li>
        <li onClick={() => toast.info("HireReady AI Chatbot is coming soon! Stay tuned. 🚀", { description: "We are actively developing your 24/7 AI interview coach." })} className='hover:text-violet-600 hover:font-bold transition-all text-violet-500 cursor-pointer flex items-center gap-1.5'>
          <span>Chatbot</span>
          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-1.5 py-0.2 rounded-full border border-violet-200">Soon</span>
        </li>
        <li  onClick={Click_upgrade}className={`hover:text-blue-600 hover:font-bold transition-all text-blue-500 cursor-pointer
        ${path=='/dashboard/upgrade'&&'text-blue-700 font-bold'}
        `}>Upgrade</li>
        <li  onClick={Click_HowIt}className={`hover:text-blue-600 hover:font-bold transition-all text-blue-500 cursor-pointer
        ${path=='/dashboard/howit'&&'text-blue-700 font-bold'}
        `}>How its Work</li>
      </ul>

      <UserButton/>
    </div>
  )
}

export default Header
