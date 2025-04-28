"use client"

import { useState, useCallback } from "react"

import { MessageContextProvider } from "@/context/messageContext"

const MESSAGEVIEWTIME = 3000

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [messages, setMessages] = useState<{ message: string; id: string }[]>(
    [],
  )

  const addMessage = useCallback(
    (message: string) => {
      setMessages((prev) => [
        ...prev,
        { message, id: Math.random().toString(36).substring(2, 15) },
      ])

      setTimeout(() => {
        setMessages((prev) => prev.slice(1))
      }, MESSAGEVIEWTIME)
    },
    [setMessages],
  )

  return (
    <MessageContextProvider value={addMessage}>
      <div className="absolute top-0 left-0 flex h-full w-1/3 flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-primary-black-75 rounded-3xl opacity-50">
            {message.message}
          </div>
        ))}
      </div>
      {children}
    </MessageContextProvider>
  )
}
