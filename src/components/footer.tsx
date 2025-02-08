import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="m-0 w-lvw flex items-start gap-12 flex-wrap p-6 text-4 bg-primary-black">
      <span>
        svg
        Listan
      </span>
      <Link href="/download">Download</Link>
      <Link href="/webap">Web version</Link>
      <Link href="/docs">Docs</Link>
      <Link href="/profile" className=" grow text-right ">Account</Link>
    </footer>
  )
}