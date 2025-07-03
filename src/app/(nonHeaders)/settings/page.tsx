import { auth, signOut } from "@/server/auth"
import { redirect } from "next/navigation"

import ClientSettings from "./clientSettings"

export default async function Profile() {
  const authenticated = await auth()
  if (!authenticated) {
    redirect("/auth/login?redirect=/settings")
  }
  const user = authenticated.user
  return (
    <div className="md:bg-primary-black-75 flex w-2/3 max-w-4xl min-w-min flex-col rounded-2xl p-8 text-center align-middle text-lg md:text-xl">
      <h1 className="m-5 text-3xl">Profile</h1>
      <span className="flex flex-row items-center justify-center pb-4 text-3xl">
        <h1 className="pr-5">{user.name}</h1>
        {user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-full"
            alt="The users profile icon"
            height={50}
            width={50}
            src={user.image}
          />
        )}
      </span>
      <ClientSettings user={user} />

      <div className="flex flex-row justify-evenly">
        <button
          className="bg-primary-blue border-primary-blue mt-4 w-max cursor-pointer self-center rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
          onClick={async () => {
            "use server"
            await signOut({ redirectTo: "/auth/login" })
          }}>
          Sign Out
        </button>
        <button
          className="bg-primary-blue border-primary-blue mt-4 w-max cursor-pointer self-center rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg"
          onClick={async () => {
            "use server"
            await signOut({ redirectTo: "/auth/login" })
          }}>
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  )
}
