import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav id="nav-bar" className="text-white md:sticky top-0 md:bg-none fixed bg-primary-black m-0 min-h-full md:h-min w-max text-2xl flex-col md:text-center md:backdrop-blur-xl left-[-100%]">
      <input type="checkbox" id="menu-toggle" className="hidden"/>
      <label htmlFor="menu-toggle" className="cursor-pointer md:hidden block p-4 fixed top-0 left-0">
        <Image src={"/menu.svg"} alt="menu icon" width={40} height={40}/>
      </label>
      <span className="md:w-screen mt-18 border-b-primary-white flex md:border-b-2 p-4 md:flex md:items-start md:gap-x-12 md:flex-row flex-wrap md:justify-center gap-6 align-middle  w-min md:mt-0">
      <Link href="/" className="flex md:flex-row md:w-max">
        <Image src="/favicon.ico" alt="logo" width={30} height={30}/>
        <span className="hidden md:block md pl-3 hover:underline">
        Listan
        </span>
      </Link>
      <Link href="/download" className="md:w-max hover:underline">Download</Link>
      <Link href="/docs" className="md:w-max hover:underline">Docs</Link>
      <Link href="/app" className="md:w-max hover:underline">Webapp</Link>
      <Link href="/settings" className="w-full md:w-max md:text-end md:grow hover:underline">Account</Link>   
      </span>
      <style>
        {
          `
          #nav-bar {
            transition: left 0.3s ease-in-out;
          }
          #nav-bar:has(input:checked) {
            left: 0;
          }
          `
        }
      </style>
    </nav>
  )
}