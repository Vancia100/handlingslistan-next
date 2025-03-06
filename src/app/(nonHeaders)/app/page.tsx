import { db } from "@/server/db"
import Link from "next/link"
import { auth } from "@/server/auth"

import Slider from "@/components/slider"
import Card from "@/components/card"

export default function WebbApp() {
  return (
    <div className="flex flex-col text-center align-middle">
      <h1 className="m-5 w-full text-6xl">WebbApp</h1>
      <p>This page does not have the headers or footers of the main page!</p>

      <div className="flex flex-col">
        <h1>WebbApp</h1>
        <button
          onClick={async () => {
            "use server"
            await db.user.create({
              data: {
                email: "test@test.com",
              },
            })
          }}>
          Create User button
        </button>
      </div>
      <Slider>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
        <Card url="app" title="Title" description="description"></Card>
      </Slider>
      <Link href="/app/create">Create post</Link>
    </div>
  )
}

const UserList = async () => {
  "use server"
  const user = await auth()
  return <div>{user?.user.email ?? "no user"}</div>
}
