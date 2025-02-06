import Link from "next/link";
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="h-screen flex flex-col items-center justify-center">
      <h1 className=" text-8xl">Handlingslistan</h1>
      <p className="mt-4 text-3xl">
        {"The all in one domestics management tool"}
      </p>
      <Link href={"/auth/signin"} className="mt-4 text-4xl bg-blue-900 rounded-md p-3 hover:bg-blue-800">
        Download now
      </Link>
      <Link href={"/localapp"} className="mt-9 text-3xl ">
      Do not want to download? try the web vertion <u className="text-blue-400"> here</u>
      </Link>    
      <div className="flex flex-row mt-9 gap-20">
      <Link href={"/auth/login"} className="text-3xl bg-blue-900 rounded-md p-3 min-w-min w-50 text-center hover:bg-blue-800">
        Login
      </Link>
      <Link href={"/auth/register"} className="text-3xl bg-blue-900 rounded-md p-3 min-w-min w-50 text-center hover:bg-blue-800">
        Register
      </Link>
      </div> 
      </div>
    </main>
  );
}
