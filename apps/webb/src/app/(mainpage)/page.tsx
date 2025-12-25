import Link from "next/link"
export default function HomePage() {
  return (
    <div className="flex max-w-full flex-col items-center justify-center">
      <h1 className="text-4xl md:text-8xl">Handlingslistan</h1>
      <p className="mt-4 text-xl md:text-3xl">
        {"The all in one domestics management tool"}
      </p>
      <Link
        href={"/download"}
        className="bg-primary-black-50 hover:bg-primary-black-75 mt-4 rounded-md p-3 text-2xl shadow-md md:text-4xl">
        Download now
      </Link>
      <Link href={"/app"} className="mt-9 text-xl hover:underline md:text-3xl">
        Do not want to download? try the web vertion{" "}
        <u className="text-blue-400"> here</u>
      </Link>
      <div className="mt-9 flex flex-row flex-wrap justify-center gap-5">
        <Link
          href={"/auth/login"}
          className="bg-primary-black-50 hover:bg-primary-black-75 mx-5 w-50 min-w-min rounded-md p-3 text-center text-2xl shadow-md md:text-3xl">
          Login
        </Link>
        <Link
          href={"/auth/login"}
          className="bg-primary-black-50 hover:bg-primary-black-75 mx-5 w-50 min-w-min rounded-md p-3 text-center text-2xl shadow-md md:text-3xl">
          Register
        </Link>
      </div>
    </div>
  )
}
