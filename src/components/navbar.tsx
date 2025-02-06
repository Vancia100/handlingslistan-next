import Link from "next/link"
export default function Navbar() {
  return (
    <nav className="m-0 w-lvw flex items-start gap-12 flex-wrap p-6 text-1xl">
      <span>
        svg
        Listan
      </span>
      <Link href="/download">Download</Link>
      <Link href="/webap">Web vertion</Link>
      <Link href="/docs">Docs</Link>
      <Link href="/profile" className=" grow text-right ">Account</Link>
      
    </nav>
  )
}