import { signIn } from "@/server/auth";

export default function SignIn() {
  return (
    <form action={async () => {
      "use server"
      await signIn("discord")
    }}>
      <button type="submit" className="bg-primary-blue p-3 rounded-3xl text-xl hover:border-white hover:drop-shadow-lg shadow-white border-2 border-primary-blue">Sign in with Discord</button>
    </form>
  )
}