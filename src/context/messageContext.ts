"use client"
import { createContext, useContext } from "react"

const context = createContext((message: string) => {
  console.log("sendMessage", message)
})

export const MessageContextProvider = context.Provider

export const useMessageContext = () => {
  const text = useContext(context)
  if (context === undefined) {
    throw new Error("useMessageContext must be used within a MessageProvider")
  }
  return text
}
