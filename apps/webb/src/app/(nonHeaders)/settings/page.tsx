import { auth } from "@hndl/auth/server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"

// import ClientSettings from "./clientSettings"
import DeleteAcount from "./deleteAccount"
import SignOut from "./signOutButton"

export default async function Profile() {
  const authenticated = await auth.api.getSession({
    headers: await headers(),
  })
  if (!authenticated) {
    redirect("/auth/login?redirect=/settings")
  }
  const user = authenticated.user
  return (
    <div className="md:bg-primary-black-75 fldeleteAcountActionex w-2/3 max-w-4xl min-w-min flex-col rounded-2xl p-8 text-center align-middle text-lg md:text-xl">
      <h1 className="m-5 text-3xl">Profile</h1>
      <span className="flex flex-row items-center justify-center pb-4 text-3xl">
        <h1 className="pr-5">{user.name}</h1>
        {user.image && (
          // Not needed to have a next img when loading a separate source
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
      {/* <ClientSettings user={user} /> */}

      <div className="flex flex-row justify-evenly">
        <SignOut />
        <DeleteAcount />
      </div>
    </div>
  )
}
