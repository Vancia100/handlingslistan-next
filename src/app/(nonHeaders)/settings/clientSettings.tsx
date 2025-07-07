"use client"

import { useState, useRef, useActionState } from "react"

import { type User } from "next-auth"
import {
  usernameValidator,
  emailValidator,
} from "@/schemas/chageCredentialsSchema"
import {
  changeUsername,
  changeMail,
  type ServerAction,
} from "@/actions/changeCredentials"

import type { ZodType } from "zod/v4"
export default function ClientSettings({ user }: { user: User }) {
  return (
    <div className="bg-primary-black-50 border-primary-black flex flex-col gap-3 rounded-xl border-2 p-4">
      <SettingsPart
        title="Username:"
        info={user.name ?? ""}
        changeAction={changeUsername}
        validator={usernameValidator.refine(
          (name) => name != user.name,
          "Username cant be the same as old username!",
        )}
      />
      <SettingsPart
        title="Email:"
        info={user.email ?? ""}
        changeAction={changeMail}
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
  changeAction: ServerAction
  validator: ZodType<string> // No clue if this is supported.
  // Want to make it any validator that validates to a JS string.
}) {
  const [state, action, isLoading] = useActionState(props.changeAction, {
    success: true,
    message: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

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
              action(isValid.data)
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
