"use client"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      className="hover:border-primary-purple border-primary-black-75 hover:bg-primary-black-75 fixed top-5 left-5 rounded-xl border-2 p-2 text-xl text-white"
      onClick={() => {
        console.log(
          "Back button clicked",
          document.location.origin,
          document.referrer,
        )
        if (
          !document.referrer.startsWith(window.location.origin) &&
          document.referrer
        ) {
          console.log("redir home")
          // router.push("/")
        } else {
          router.back()
        }
      }}>
      Back
    </button>
  )
}
