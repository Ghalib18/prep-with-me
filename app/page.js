"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, CheckCircle, Clock, Award } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AIMockInterviewLanding() {
  
const router=useRouter();
const handleStartClick = () => {
  router.push('/dashboard');
};
  return (
    <>
      {/* Include CSS */}
      <style jsx global>{`
        /* Base styles */
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
          --radius: 0.5rem;
        }

        /* Custom colors */
        .bg-blue-50 {
          background-color: #f0f7ff;
        }
        .bg-blue-600 {
          background-color: #0077c5;
        }
        .bg-blue-700 {
          background-color: #0060a0;
        }
        .text-blue-500 {
          color: #0c96e6;
        }
        .text-blue-600 {
          color: #0077c5;
        }
        .text-blue-700 {
          color: #0060a0;
        }
        .text-white {
          color: #ffffff;
        }
        
        /* Layout */
        .container {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        @media (min-width: 640px) {
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
        
        /* Utility classes */
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-10 { z-index: 10; }
        .min-h-screen { min-height: 100vh; }
        .h-full { height: 100%; }
        .w-full { width: 100%; }
        .overflow-hidden { overflow: hidden; }
        .bg-white { background-color: white; }
        .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
        .from-blue-50 { --tw-gradient-from: #f0f7ff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(240, 247, 255, 0)); }
        .to-white { --tw-gradient-to: #ffffff; }
        
        .flex { display: flex; }
        .grid { display: grid; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-x-6 { column-gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .text-center { text-align: center; }
        
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .p-6 { padding: 1.5rem; }
        .p-3 { padding: 0.75rem; }
        
        .mt-6 { margin-top: 1.5rem; }
        .mt-10 { margin-top: 2.5rem; }
        .mt-20 { margin-top: 5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .ml-2 { margin-left: 0.5rem; }
        
        .max-w-2xl { max-width: 42rem; }
        .max-w-md { max-width: 28rem; }
        
        .rounded-full { border-radius: 9999px; }
        .rounded-xl { border-radius: 0.75rem; }
        
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        
        .font-extrabold { font-weight: 800; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        
        .tracking-tight { letter-spacing: -0.025em; }
        
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        
        .group:hover .group-hover\:translate-x-1 { transform: translateX(0.25rem); }
        .group:hover .group-hover\:opacity-100 { opacity: 1; }
        .hover\:bg-blue-700:hover { background-color: #0060a0; }
        .hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        
        .opacity-0 { opacity: 0; }
        .inline-block { display: inline-block; }
        
        .h-5 { height: 1.25rem; }
        .w-5 { width: 1.25rem; }
        .h-10 { height: 2.5rem; }
        .w-10 { width: 2.5rem; }
        .h-16 { height: 4rem; }
        .w-16 { width: 4rem; }
        
        @media (min-width: 640px) {
          .sm\:text-5xl { font-size: 3rem; line-height: 1; }
          .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .sm\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        }
        
        @media (min-width: 768px) {
          .md\:text-6xl { font-size: 3.75rem; line-height: 1; }
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        
        @media (min-width: 1024px) {
          .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
          .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .lg\:flex-row { flex-direction: row; }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-white">
        <AnimatedBackground />

        <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AnimatedText
              text="AI Mock Interview"
              className="text-4xl font-extrabold tracking-tight text-blue-700 sm:text-5xl md:text-6xl"
            />

            <p className="mt-6 max-w-2xl text-xl text-blue-600">
              Practice your interview skills with our AI-powered mock interview platform. Get real-time feedback and
              improve your chances of landing your dream job.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button  onClick={handleStartClick} className="group relative overflow-hidden rounded-full bg-blue-600 px-8 py-6 text-lg font-semibold text-white transition-all hover:bg-blue-700">
                Start Your Interview
                <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 h-full w-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-blue-500" />}
                title="Realistic Conversations"
                description="Our AI simulates real interview scenarios with natural conversations and follow-up questions."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-blue-500" />}
                title="Instant Feedback"
                description="Receive detailed feedback on your answers, communication skills, and areas for improvement."
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-blue-500" />}
                title="Practice Anytime"
                description="No scheduling needed. Practice interviews whenever you want, as many times as you need."
              />
            </div>

            <div className="mt-20">
              <h2 className="text-3xl font-bold tracking-tight text-blue-700 sm:text-4xl">
                Why Choose AI Mock Interview?
              </h2>
              <div className="mt-10 flex flex-col items-center justify-center gap-8 lg:flex-row">
                <div className="flex max-w-md flex-col items-center text-center">
                  <Award className="h-16 w-16 text-blue-500" />
                  <h3 className="mt-4 text-xl font-bold text-blue-700">Industry-Specific Questions</h3>
                  <p className="mt-2 text-blue-600">
                    Our platform offers tailored questions for various industries including tech, finance, healthcare,
                    and more.
                  </p>
                </div>
                <div className="flex max-w-md flex-col items-center text-center">
                  <Clock className="h-16 w-16 text-blue-500" />
                  <h3 className="mt-4 text-xl font-bold text-blue-700">Improve With Each Session</h3>
                  <p className="mt-2 text-blue-600">
                    Track your progress over time and see how your interview skills improve with each practice session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// AnimatedBackground Component
function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `rgba(0, 122, 255, ${Math.random() * 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray = []
    const numberOfParticles = Math.min(100, window.innerWidth / 10)

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Connect particles with lines
    function connect() {
      const maxDistance = 150
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(0, 122, 255, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      connect()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-gradient-to-b from-blue-50 to-white" />
}

// FeatureCard Component
function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="flex flex-col items-center rounded-xl bg-blue-50 p-6 text-center shadow-md transition-all hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 rounded-full bg-white p-3 shadow-sm">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-blue-700">{title}</h3>
      <p className="text-blue-600">{description}</p>
    </motion.div>
  )
}

// AnimatedText Component
function AnimatedText({ text, className }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate={isVisible ? "visible" : "hidden"}>
      {text.split("").map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={child} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}




  