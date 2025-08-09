"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Briefcase,
  FileText,
  Upload,
  Award,
  TrendingUp,
  Bell,
  Menu,
  Sparkles,
  User,
  Calendar,
  Target,
  Zap,
  Trophy,
  BookOpen,
} from "lucide-react"
import { useState } from "react"

interface ModernSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

const sidebarSections = [
  {
    id: "overview",
    label: "Dashboard",
    icon: Home,
    description: "Overview & Analytics",
    gradient: "bg-electric-gradient",
    iconColor: "icon-electric",
    count: null,
    isNew: false,
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Briefcase,
    description: "Explore Internships",
    gradient: "bg-sunset-gradient",
    iconColor: "icon-orange",
    count: "12 New",
    isNew: true,
  },
  {
    id: "noc-center",
    label: "NOC Center",
    icon: FileText,
    description: "Certificate Requests",
    gradient: "bg-nature-gradient",
    iconColor: "icon-green",
    count: "2 Pending",
    isNew: false,
  },
  {
    id: "reports-manager",
    label: "Reports Manager",
    icon: Upload,
    description: "Submit Reports",
    gradient: "bg-royal-gradient",
    iconColor: "icon-purple",
    count: "Due Today",
    isNew: false,
  },
  {
    id: "certificates-gallery",
    label: "Certificates",
    icon: Award,
    description: "Your Achievements",
    gradient: "bg-cosmic-gradient",
    iconColor: "icon-pink",
    count: "3 Earned",
    isNew: false,
  },
  {
    id: "progress-tracker",
    label: "Progress Tracker",
    icon: TrendingUp,
    description: "Track Journey",
    gradient: "bg-aurora-gradient",
    iconColor: "icon-yellow",
    count: "78%",
    isNew: false,
  },
  {
    id: "notification-center",
    label: "Notifications",
    icon: Bell,
    description: "Updates & Alerts",
    gradient: "bg-sunset-gradient",
    iconColor: "icon-pink",
    count: "5",
    isNew: false,
  },
]

function SidebarContent({ activeSection, onSectionChange, collapsed = false, className }: ModernSidebarProps) {
  return (
    <div className={cn("h-full flex flex-col bg-transparent", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/30">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-14 h-14 bg-cosmic-gradient rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-float">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-electric-green rounded-full border-3 border-white animate-pulse-glow flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </div>
          {!collapsed && (
            <div className="animate-fade-scale">
              <h2 className="font-bold text-gray-900 text-2xl text-gradient">IMS Portal</h2>
              <p className="text-sm text-gray-600 font-medium">Internship Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-3">
          {sidebarSections.map((section, index) => (
            <div key={section.id} className="animate-slide-left" style={{ animationDelay: `${index * 0.1}s` }}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto rounded-2xl transition-all duration-500 group relative overflow-hidden",
                  collapsed ? "p-4" : "p-4",
                  activeSection === section.id
                    ? `${section.gradient} text-white shadow-2xl transform scale-105 hover:scale-110`
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-lg hover:scale-105",
                )}
                onClick={() => onSectionChange(section.id)}
              >
                {/* Background Animation */}
                {activeSection === section.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl animate-shimmer"></div>
                )}

                <div className="flex items-center gap-4 w-full relative z-10">
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 relative",
                      activeSection === section.id
                        ? "bg-white/20 shadow-lg backdrop-blur-sm"
                        : "bg-gray-100 group-hover:bg-white group-hover:shadow-md",
                    )}
                  >
                    <section.icon
                      className={cn(
                        "h-6 w-6 transition-all duration-300",
                        activeSection === section.id
                          ? "text-white"
                          : `${section.iconColor} group-hover:text-gray-700 icon-glow`,
                      )}
                    />
                    {section.isNew && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-green rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base">{section.label}</span>
                        {section.count && (
                          <Badge
                            className={cn(
                              "text-xs px-3 py-1 font-semibold",
                              activeSection === section.id
                                ? "bg-white/20 text-white border-white/30 backdrop-blur-sm"
                                : section.count.includes("New")
                                  ? "badge-electric animate-pulse-glow"
                                  : section.count.includes("Due") || section.count.includes("Pending")
                                    ? "badge-orange animate-pulse"
                                    : section.count.includes("%")
                                      ? "badge-green"
                                      : "badge-purple",
                            )}
                          >
                            {section.count}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-1 transition-colors duration-300",
                          activeSection === section.id ? "text-white/90" : "text-gray-500",
                        )}
                      >
                        {section.description}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-6 border-t border-gray-200/30 space-y-6">
          {/* Achievement Section */}
          <div className="vibrant-card bg-electric-gradient text-white rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Achievement Unlocked!</p>
                <p className="text-xs text-white/80">Consistent Performer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Progress to Next Level</span>
                <span className="font-bold text-white">78%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-white/80">
                <span>Level 5</span>
                <span>+250 XP to Level 6</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="vibrant-card text-center p-4 hover-glow">
              <div className="text-2xl font-bold text-gradient">8.5</div>
              <div className="text-xs text-gray-600 font-medium">CGPA</div>
            </div>
            <div className="vibrant-card text-center p-4 hover-glow">
              <div className="text-2xl font-bold text-gradient">95%</div>
              <div className="text-xs text-gray-600 font-medium">Attendance</div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4 vibrant-card p-4 hover-lift">
            <div className="flex items-center justify-center w-12 h-12 bg-electric-gradient rounded-2xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">D23it176</p>
              <p className="text-xs text-gray-600">Computer Engineering</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="status-dot status-active"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button className="btn-electric h-12 p-2 text-xs">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button className="btn-nature h-12 p-2 text-xs">
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button className="btn-sunset h-12 p-2 text-xs">
              <Target className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ModernSidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
  onToggleCollapse,
}: Omit<ModernSidebarProps, "className">) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <SidebarContent activeSection={activeSection} onSectionChange={onSectionChange} collapsed={collapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden vibrant-card hover:bg-electric-gradient hover:text-white transition-all duration-300 w-12 h-12"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 glass-sidebar">
          <SidebarContent
            activeSection={activeSection}
            onSectionChange={(section) => {
              onSectionChange(section)
              setIsOpen(false)
            }}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
