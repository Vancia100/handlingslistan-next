"use server"
import { db } from "@/server/db"
import { auth } from "@/server/auth"
export default async function deleteAcount() {
  const user = (await auth())?.user
  if (!user) return

  await db.user.delete({
    where: {
      id: user.id,
    },
  })
}
