import { auth, signOut } from "@/server/auth"
import Image from "next/image"
import { redirect } from "next/navigation"

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
          <Image
            className="rounded-full"
            alt="The users profile icon"
            height={50}
            width={50}
            src={user.image}
          />
        )}
      </span>
      <div className="bg-primary-black-50 border-primary-black flex flex-col gap-3 rounded-xl border-2 p-4">
        <SettingsPart
          title="Username:"
          info={user.name ?? ""}
          change={async () => {
            "use server"
            console.log("change username")
          }}
        />
        <SettingsPart
          title="Email:"
          info={user.email ?? ""}
          change={async () => {
            "use server"
            console.log("change email")
          }}
        />
      </div>

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

function SettingsPart(props: {
  title: string
  change: () => void
  info: string
}) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-end gap-2">
      <h3 className="grow text-start">{props.title}</h3>
      <p>{props.info}</p>
      <button
        className="bg-primary-blue border-primary-blue hover:border-primary-white cursor-pointer rounded-xl border-2 p-1"
        onClick={props.change}>
        Change
      </button>
    </div>
  )
}
