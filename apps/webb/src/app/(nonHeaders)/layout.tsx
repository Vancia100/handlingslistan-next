import BackButton from "@/components/backButton"
import InitTRPC from "./initTRPC"
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log(process.env.BETTER_AUTH_URL, "test")
  return (
    <main className="flex h-min min-h-screen w-screen flex-col items-center p-10 pt-15 text-center">
      <BackButton />
      <InitTRPC>{children}</InitTRPC>
    </main>
  )
}
