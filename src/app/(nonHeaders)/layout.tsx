export default function Layout(
  { children }: Readonly<{ children: React.ReactNode }>
) {
  return (
    <main className="min-h-screen w-screen h-min mb-4 flex flex-col items-center pt-15 text-center p-10">
      {children}
    </main>
  )
}