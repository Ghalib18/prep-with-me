import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex h-screen w-full">
      {/* Left Side - Image */}
      <div className="w-[660px] hidden md:flex items-center justify-center relative bg-gray-900">
        <img
          alt="Interview Illustration"
          src="/1741529607505.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Right Side - SignIn */}
      <div className="w-full md:w-1/2  md:h-[430px] flex items-center justify-center bg-white dark:bg-gray-900 p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Welcome to AI-Mock_Inetrview
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
