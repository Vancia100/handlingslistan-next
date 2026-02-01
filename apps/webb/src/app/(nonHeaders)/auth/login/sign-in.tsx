"use client"
import { authClient } from "@hndl/auth/client"

export default function SignIn(props: { redirect?: string }) {
  return (
    <button
      className="bg-primary-blue border-primary-blue mb-5 rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
      onClick={async () => {
        // Implement discord auth with betterAuth
        await authClient.signIn.social({
          provider: "discord",
          callbackURL: props.redirect,
        })
      }}>
      Sign in with Discord
    </button>
  )
}
