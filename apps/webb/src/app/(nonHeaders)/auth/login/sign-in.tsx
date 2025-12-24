import { authClient } from "@hndl/auth/client"
import Link from "next/link"

export default function SignIn(props: { redirect?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <form
        action={async () => {
          "use server"
          await signIn("discord", { redirectTo: props.redirect ?? "/" })
        }}
      >
        <button
          type="submit"
          className="bg-primary-blue border-primary-blue rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
        >
          Sign in with Discord
        </button>
      </form>
      <Link
        href={"/auth/login/credentials"}
        className="bg-primary-blue border-primary-blue rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
      >
        Sign in with Credentials
      </Link>
    </div>
  )
}
