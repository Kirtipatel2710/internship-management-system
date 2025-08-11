import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Providers } from "../providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Internship Management System - CHARUSAT University",
  description:
    "Comprehensive internship management platform for CHARUSAT University students, teachers, and T&P officers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Providers wraps the whole app, including TeacherDashboard */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
