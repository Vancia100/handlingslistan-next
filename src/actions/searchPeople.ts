"use server"
import { db } from "@/server/db"

export default async function searchPeople(name: string) {
  const users = await db.user.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  return users
}
