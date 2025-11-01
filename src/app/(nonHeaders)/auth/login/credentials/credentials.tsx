"use client"
import createAccount from "@/actions/credentialAcount"
import { credentialsSchame } from "@/schemas/credentialsSchema"

import { useState, useActionState, useCallback } from "react"
export default function Credentials(props: { redirect?: string }) {
  const [state, action, isLoading] = useActionState(createAccount, {
    message: "",
    prev: {
      email: "",
      password: "",
    },
  })

  const [login, setLogin] = useState(true)
  const [pass, setPass] = useState("")
  const [extraPass, setExtraPass] = useState("")
  const [prevVal, setPrevVal] = useState("")

  const clientAction = useCallback(
    async (credentials: FormData) => {
      const inputs = Object.fromEntries(credentials)
      const pasrsed_credentials = {
        ...inputs,
        createAccount: !login,
      }
      setPass("")
      setExtraPass("")
      setPrevVal(credentials.get("email") as string)

      console.log("parsed", pasrsed_credentials)
      const validator = credentialsSchame.safeParse(pasrsed_credentials)
      if (!validator.success) {
        console.log(validator.error.message)
        return
      }
      console.log("success", validator.data)
      action(validator.data)
    },
    [setPass, setExtraPass, action, login],
  )

  const error = login || extraPass == pass ? null : "The passwords do not match"
  return (
    <form action={clientAction} className="flex flex-col gap-2">
      <label htmlFor="eamil" className="m-3 w-max text-xl">
        Email:
        <label htmlFor="password"></label>
        <input
          name="email"
          type="email"
          placeholder="v@handla.se"
          defaultValue={state.prev.email ?? prevVal}
          className="border-primary-purple bg-primary-black-75 font-primary-white mx-3 rounded-xl border-2 px-2.5"
        />
        Password
        <input
          className="border-primary-purple bg-primary-black-75 font-primary-white mx-3 rounded-xl border-2 px-2.5"
          name="password"
          type="password"
          placeholder="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </label>
      {!login && (
        <label htmlFor="secondPassword" className="m-3 w-max text-xl">
          Retype password
          <input
            className="border-primary-purple bg-primary-black-75 font-primary-white mx-3 rounded-xl border-2 px-2.5"
            name="secondPassword"
            placeholder="password"
            type="password"
            value={login ? extraPass : undefined}
            onChange={(e) => setExtraPass(e.target.value)}
          />
        </label>
      )}
      {error && <div>{error}</div>}
      <button
        disabled={!!error}
        type="submit"
        className="bg-primary-blue border-primary-blue rounded-3xl border-2 p-3 text-xl shadow-white hover:border-white hover:drop-shadow-lg">
        Sign in
      </button>
    </form>
  )
}
