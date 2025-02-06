import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HeaderFooterLayout({
  children,
}:Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <Navbar/>
    <div className="min-h-full w-screen mb-4">
    {children}
    </div>
    <Footer/>
    </>
  )
}