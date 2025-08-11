"use client"

import { useState, useEffect } from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

// Local cn function (same as shadcn/ui's utility)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Inline version of useIsMobile hook
function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [breakpoint])

  return isMobile
}

export function Sidebar() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(!isMobile)

  useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  return (
    <aside
      className={cn(
        "border-r bg-gray-100 p-4 transition-all",
        open ? "w-64" : "w-16"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="mb-4"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {open && (
        <div className="space-y-4">
          <Input placeholder="Search..." />
          {/* Sidebar links go here */}
        </div>
      )}
    </aside>
  )
}
