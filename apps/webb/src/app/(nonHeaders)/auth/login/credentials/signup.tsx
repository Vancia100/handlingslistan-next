"use client"
import { credentialsSchame } from "@hndl/types/validators"
import { authClient } from "@hndl/auth/client"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

export default function Credentials(props: { redirect?: string }) {
  const [login, setLogin] = useState(false)
  const router = useRouter()

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
      const creds = validator.data
      const signin = creds.createAccount
        ? await authClient.signUp.email({
            email: creds.email,
            name: creds.name!,
            password: creds.password,
          })
        : await authClient.signIn.email({
            email: creds.email,
            password: creds.password,
          })
      if (!signin.error) {
        // @ts-expect-error might 404
        router.push(props.redirect ?? "/app")
      }
    },
    [setPass, setExtraPass, login, props.redirect, router],
  )

  const error = login || extraPass == pass ? null : "The passwords do not match"
  return (
    <>
      <div className="flex w-full flex-row">
        <span
          className={
            (login ? "bg-primary-black-75 " : "") +
            " border-primary-blue grow rounded-l-2xl border-b-2 py-5 hover:underline"
          }
          onClick={() => setLogin(true)}>
          <h1 className="text-3xl">Sign In</h1>
        </span>
        <span
          className={
            (!login ? "bg-primary-black-75 " : "") +
            "border-primary-blue grow rounded-r-2xl border-b-2 py-5 shadow-white hover:underline hover:drop-shadow-lg"
          }
          onClick={() => setLogin(false)}>
          <h1 className="text-3xl">Sign Up</h1>
        </span>
      </div>
      <form action={clientAction} className="flex flex-col gap-2 p-9">
        <label htmlFor="eamil" className="m-3 w-max text-xl">
          Email:
          <label htmlFor="password"></label>
          <input
            name="email"
            type="email"
            placeholder="v@localhost:=)"
            defaultValue={prevVal}
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
          <>
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
            <label htmlFor="name" className="m-3 w-max text-xl">
              Username
              <input
                className="border-primary-purple bg-primary-black-75 font-primary-white mx-3 rounded-xl border-2 px-2.5"
                name="name"
                placeholder="Username"
              />
            </label>
          </>
        )}
        {error && <div>{error}</div>}
        <button
          disabled={!!error}
          type="submit"
          className="bg-primary-blue border-primary-blue mx-auto max-w-[70%] rounded-3xl border-2 p-2 px-30 text-xl shadow-white hover:border-white hover:drop-shadow-lg">
          Sign in
        </button>
      </form>
    </>
  )
}
