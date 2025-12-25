"use client"

import { useState, useRef } from "react"

import type { User } from "@hndl/auth"
import { authClient } from "@hndl/auth/client"
import {
  usernameValidator,
  emailValidator,
} from "@/schemas/chageCredentialsSchema"
import { useRouter } from "next/navigation"

import type { ZodType } from "zod/v4"
export default function ClientSettings({ user }: { user: User }) {
  return (
    <div className="bg-primary-black-50 border-primary-black flex flex-col gap-3 rounded-xl border-2 p-4">
      <SettingsPart
        title="Username:"
        info={user.name ?? ""}
        changeAction={async (newUsername) => {
          const mes = await authClient.updateUser({
            name: newUsername,
          })
          return mes.error?.message
        }}
        validator={usernameValidator.refine(
          (name) => name != user.name,
          "Username cant be the same as old username!",
        )}
      />
      <SettingsPart
        title="Email:"
        info={user.email ?? ""}
        changeAction={async (newEmail) => {
          const mes = await authClient.changeEmail({
            newEmail,
          })
          return mes.error?.message
        }}
        validator={emailValidator.refine(
          (email) => email != user.email,
          "Email cant be the same as old email!",
        )}
      />
    </div>
  )
}

function SettingsPart(props: {
  title: string
  info: string
  changeAction: (arg0: string) => Promise<string | undefined>
  validator: ZodType<string> // No clue if this is supported.
  // Want to make it any validator that validates to a JS string.
}) {
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()
  return (
    <div className="flex flex-row flex-wrap items-center justify-end gap-2">
      <h3 className="grow text-start">{props.title}</h3>
      {isOpen ? (
        <div className="">
          <form
            action={async (data) => {
              const inp = data.get("new")
              if (!inp) return

              const isValid = props.validator.safeParse(inp)
              if (isValid.error) {
                const errorMsg = isValid.error.message
                console.log(errorMsg)
                return
              }
              if (
                !confirm(`Are you sure you want to change your ${props.title}?`)
              )
                return

              setIsOpen(false)
              const ret = await props.changeAction(isValid.data)
              if (ret) {
                alert(ret)
              } else {
                router.refresh()
              }
            }}
            ref={formRef}>
            <input type="text" name="new" placeholder={`new ${props.title}`} />
          </form>
        </div>
      ) : (
        <p>{props.info}</p>
      )}
      <button
        className="bg-primary-blue border-primary-blue hover:border-primary-white cursor-pointer rounded-xl border-2 p-1"
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true)
            return
          }
          formRef.current?.requestSubmit()
        }}>
        Change
      </button>
    </div>
  )
}
