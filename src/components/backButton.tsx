"use client"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      className="bg-primary-black-75 border-primary-purple hover:border-primary-black fixed top-5 left-5 rounded-xl border-2 p-2 text-xl text-white"
      onClick={() => {
        if (document.referrer.startsWith(window.location.origin)) {
          router.back()
        } else {
          router.push("/")
        }
      }}>
      Back
    </button>
  )
}
