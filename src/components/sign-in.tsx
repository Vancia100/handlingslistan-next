import { signIn } from "@/server/auth"

export default async function SignIn(props: { redirect?: string }) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("discord", { redirectTo: props.redirect ?? "/" })
      }}>
      <button
        type="submit"
        className="bg-primary-blue border-primary-blue rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg">
        Sign in with Discord
      </button>
    </form>
  )
}
