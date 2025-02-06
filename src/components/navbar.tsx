import Link from "next/link"
import Image from "next/image"
export default function Navbar() {
  return (
    <nav className="text-white md:sticky absolute top-0 bg-none m-0 w-max md:text-2xl text-4xl flex-col md:text-center">
      <button id="hamburger-button" className="text-2xl p-4 md:hidden block cursor-pointer">Hamburger</button>
      <span className="w-screen border-b-[#3d295a] bg-[#2e026d] border-b-3 p-4 hidden md:flex md:items-start md:gap-x-12 md:flex-row flex-wrap items-center justify-center gap-4 align-middle">
      <Link href="/" className="flex md:flex-row md:w-max w-full">
        <Image src="/favicon.ico" alt="logo" width={30} height={30}/>
        <span className="hidden md:block md pl-3">
        Listan
        </span>
      </Link>
      <Link href="/download" className="w-full md:w-max">Download</Link>
      <Link href="/docs" className="w-full md:w-max">Docs</Link>
      <Link href="/app" className="w-full md:w-max">Web vertion</Link>
      <Link href="/settings" className="w-full md:w-max md:text-end md:grow">Account</Link>   
      </span>
    </nav>
  )
}