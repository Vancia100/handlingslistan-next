import SignIn from "./sign-in"
import { auth } from "@hndl/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Login(props: {
  searchParams: Promise<Record<string, string>>
}) {
  const redir = await props.searchParams
  return (
    <div className="bg-primary-black-50 flex flex-col items-center justify-center rounded-2xl p-9">
      <h1 className="pb-8 text-4xl">Sign in</h1>
      <SignIn redirect={redir.redirect} />
      <div className="flex flex-col gap-4">
        <Link
          href={"/auth/login/credentials"}
          className="bg-primary-blue border-primary-blue rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg">
          Sign in with Credentials
        </Link>
      </div>
    </div>
  )
}
