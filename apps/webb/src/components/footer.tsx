import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-4 bg-primary-black m-0 flex w-lvw flex-wrap items-start gap-12 p-6">
      <span>svg Listan</span>
      <Link href="/download">Download</Link>
      <Link href="/webap">Web version</Link>
      <Link href="/docs">Docs</Link>
      <Link href="https://github.com/Vancia100/handlingslistan-next">
        Source code
      </Link>
      <Link href="/profile" className="grow text-right">
        Account
      </Link>
    </footer>
  )
}
