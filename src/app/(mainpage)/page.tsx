import Link from "next/link";
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center max-w-full">
      <h1 className="md:text-8xl text-4xl">Handlingslistan</h1>
      <p className="mt-4 md:text-3xl text-xl">
        {"The all in one domestics management tool"}
      </p>
      <Link href={"/auth/signin"} className="mt-4 md:text-4xl text-2xl bg-blue-900 rounded-md p-3 hover:bg-blue-800">
        Download now
      </Link>
      <Link href={"/app"} className="mt-9 md:text-3xl text-xl">
      Do not want to download? try the web vertion <u className="text-blue-400"> here</u>
      </Link>    
      <div className="flex flex-row mt-9 gap-5 flex-wrap justify-center">
      <Link href={"/auth/login"} className="md:text-3xl mx-5 text-2xl bg-blue-900 rounded-md p-3 min-w-min w-50 text-center hover:bg-blue-800">
        Login
      </Link>
      <Link href={"/auth/register"} className="md:text-3xl mx-5 text-2xl bg-blue-900 rounded-md p-3 min-w-min w-50 text-center hover:bg-blue-800">
        Register
      </Link>
      </div> 
    </div>
  );
}
