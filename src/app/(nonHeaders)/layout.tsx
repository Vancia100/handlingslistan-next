export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mb-4 flex h-min min-h-full w-screen flex-col items-center p-10 pt-15 text-center">
      {children}
    </main>
  )
}
