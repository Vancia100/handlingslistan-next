"use server"
import { db } from "@/server/db"

export default async function searchPeople(name: string) {
  const users = await db.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: name,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  return users
}
