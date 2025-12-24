import Link from "next/link"
import Image from "next/image"

import styles from "./navbar.module.css"

export default function Navbar() {
  return (
    <nav
      className={
        styles.navBar +
        " " +
        "bg-primary-black fixed top-0 left-[-100%] m-0 min-h-full w-max flex-col text-2xl text-white md:sticky md:h-min md:bg-[#ffffff00] md:text-center md:backdrop-blur-xl"
      }>
      <input type="checkbox" id="menu-toggle" className="hidden" />
      <label
        htmlFor="menu-toggle"
        className="fixed top-0 left-0 block cursor-pointer p-4 md:hidden">
        <Image src={"/menu.svg"} alt="menu icon" width={40} height={40} />
      </label>
      <span className="border-b-primary-white mt-18 flex w-min flex-wrap gap-6 p-4 align-middle md:mt-0 md:flex md:w-screen md:flex-row md:items-start md:justify-center md:gap-x-12 md:border-b-2">
        <Link href="/" className="flex md:w-max md:flex-row">
          <Image src="/favicon.ico" alt="logo" width={30} height={30} />
          <span className="md hidden pl-3 hover:underline md:block">
            Listan
          </span>
        </Link>
        <Link href="/download" className="hover:underline md:w-max">
          Download
        </Link>
        <Link href="/docs" className="hover:underline md:w-max">
          Docs
        </Link>
        <Link href="/app" className="hover:underline md:w-max">
          Webapp
        </Link>
        <Link
          href="/settings"
          className="w-full hover:underline md:w-max md:grow md:text-end">
          Account
        </Link>
      </span>
    </nav>
  )
}
