import SignIn from "@/components/sign-in"

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center p-9 bg-primary-black-50 rounded-2xl" >
      <h1 className="text-4xl pb-8">Sign in</h1>
      <SignIn />
    </div>
  )
}