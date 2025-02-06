import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HeaderFooterLayout({
  children,
}:Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}