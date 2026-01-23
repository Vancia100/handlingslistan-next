import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HeaderFooterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="from-primary-purple to-primary-black mb-4 flex h-min min-h-screen w-screen flex-col items-center bg-linear-to-b p-10 pt-15 text-center">
        {children}
      </main>
      <Footer />
    </>
  )
}
