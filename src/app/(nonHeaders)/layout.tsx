import BackButton from "@/components/backButton"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-min min-h-screen w-screen flex-col items-center p-10 pt-15 text-center">
      <BackButton />
      {children}
    </main>
  )
}
