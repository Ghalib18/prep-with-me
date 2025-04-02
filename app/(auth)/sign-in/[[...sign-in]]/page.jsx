import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex h-screen w-full">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center relative bg-gray-900">
        <img
          alt="Interview Illustration"
          src="https://www.southmoorschool.co.uk/wp-content/uploads/job_interview_illustration.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative text-center text-white p-8 mt-auto pb-12">
          <h2 className="text-4xl font-extrabold">Welcome to Prep With AI 📊</h2>
          <p className="mt-4 text-lg font-semibold text-white/90">
            Your AI-powered interview preparation assistant.
          </p>
        </div>
      </div>

      {/* Right Side - SignIn */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Prep-With-AI
          </h1>
          {/* <p className="mt-4 text-lg font-semibold text-gray-500 dark:text-gray-400">
            Log in to access your AI interview assistant.
          </p> */}
          <div className="mt-6">
            <SignIn />
          </div>
        </div>
      </div>
    </section>
  );
}
