import SignUp from "./signup"
import { Suspense } from "react"
import { auth } from "@hndl/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
export default function Login(props: {
  searchParams: Promise<Record<string, string>>
}) {
  const redir = props.searchParams
  return (
    <div className="bg-primary-black-50 flex flex-col items-center justify-center rounded-2xl">
      <Suspense>
        <SignUpSuspense redir={redir} />
      </Suspense>
    </div>
  )
}
async function SignUpSuspense(props: {
  redir: Promise<Record<string, string>>
}) {
  const redir = await props.redir
  const user = await auth.api.getSession({ headers: await headers() })
  console.log(user)
  if (user) {
    redirect(redir.redirect ?? "/app")
  }
  return <SignUp redirect={redir.redirect} />
}
