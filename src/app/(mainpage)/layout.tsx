import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HeaderFooterLayout({
  children,
}:Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen w-screen h-min mb-4 text-white flex flex-col items-center pt-15 text-center p-10">
    {children}
    </main>
    <Footer/>
    </>
  )
}