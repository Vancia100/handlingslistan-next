"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function RouteReplacer(props: { id: number }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/app/list/create/${props.id}`)
  }, [router, props.id])
  return null
}
