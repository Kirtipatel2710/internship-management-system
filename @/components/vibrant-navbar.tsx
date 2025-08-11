"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { signOut } from "@/lib/supabase"
import { toast } from "@/components/ui/sonner"

export function VibrantNavbar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error("Sign Out Failed", {
        description: error.message,
      })
    } else {
      toast.success("Signed Out", {
        description: "You have been successfully signed out.",
      })
    }
  }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 px-4 text-white shadow-md md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold text-white md:text-base">
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Internship Portal</span>
        </Link>
        <Link
          href="/dashboard/student"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student" ? "text-white" : "text-blue-100"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/student/opportunities"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/opportunities" ? "text-white" : "text-blue-100"
          }`}
        >
          Opportunities
        </Link>
        <Link
          href="/dashboard/student/noc-request"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/noc-request" ? "text-white" : "text-blue-100"
          }`}
        >
          NOC Request
        </Link>
        <Link
          href="/dashboard/student/reports"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/reports" ? "text-white" : "text-blue-100"
          }`}
        >
          Reports
        </Link>
        <Link
          href="/dashboard/student/certificates"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/certificates" ? "text-white" : "text-blue-100"
          }`}
        >
          Certificates
        </Link>
        <Link
          href="/dashboard/student/status"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/status" ? "text-white" : "text-blue-100"
          }`}
        >
          Status
        </Link>
        <Link
          href="/dashboard/student/notifications"
          className={`transition-colors hover:text-gray-200 ${
            pathname === "/dashboard/student/notifications" ? "text-white" : "text-blue-100"
          }`}
        >
          Notifications
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-white/20 text-white hover:bg-white/30">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gradient-to-b from-purple-600 to-blue-600 text-white">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold text-white">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Internship Portal</span>
            </Link>
            <Link href="/dashboard/student" className="hover:text-gray-200">
              Dashboard
            </Link>
            <Link href="/dashboard/student/opportunities" className="text-blue-100 hover:text-gray-200">
              Opportunities
            </Link>
            <Link href="/dashboard/student/noc-request" className="text-blue-100 hover:text-gray-200">
              NOC Request
            </Link>
            <Link href="/dashboard/student/reports" className="text-blue-100 hover:text-gray-200">
              Reports
            </Link>
            <Link href="/dashboard/student/certificates" className="text-blue-100 hover:text-gray-200">
              Certificates
            </Link>
            <Link href="/dashboard/student/status" className="text-blue-100 hover:text-gray-200">
              Status
            </Link>
            <Link href="/dashboard/student/notifications" className="text-blue-100 hover:text-gray-200">
              Notifications
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-100" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:ring-offset-blue-600"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-900">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-100">Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100">Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="hover:bg-gray-100">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
