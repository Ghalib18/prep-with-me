"use client"
import React,{useEffect} from 'react'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
function Header() {

  const path=usePathname();
  useEffect(()=>{
    console.log(path)
  },[])
  return (
    <div className='flex p-1.5 items-center justify-between bg-secondary shadow-md'>
      <Image src='/logo.svg' alt="logo" width={100} height={80} />
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard'&&'text-primary font-bold'}
        `}
        >Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/questions'&&'text-primary font-bold'}
        `}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/upgrade'&&'text-primary font-bold'}
        `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/how'&&'text-primary font-bold'}
        `}>How its Work</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header
