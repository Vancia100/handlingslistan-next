import SignIn from "@/components/sign-in"

export default async function Login(props: {
  searchParams: Promise<Record<string, string>>
}) {
  const redir = await props.searchParams
  return (
    <div className="bg-primary-black-50 flex flex-col items-center justify-center rounded-2xl p-9">
      <h1 className="pb-8 text-4xl">Sign in</h1>
      <SignIn redirect={redir.redirect} />
    </div>
  )
}
