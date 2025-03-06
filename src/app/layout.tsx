import "@/styles/globals.css"

import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Listan",
  description:
    "The all in one grocery list, home economics, reciept and recepie manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="text-primary-white bg-primary-black min-h-screen max-w-screen">
        {children}
      </body>
    </html>
  )
}
