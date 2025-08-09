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
  Trophy,
  BookOpen,
  Crown,
  Star,
  Rocket,
  Diamond,
} from "lucide-react"
import { useState } from "react"

interface PremiumSidebarProps {
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
    isPremium: true,
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Briefcase,
    description: "Explore Internships",
    gradient: "bg-sunset-gradient",
    iconColor: "icon-sunset",
    count: "12 New",
    isNew: true,
    isPremium: true,
  },
  {
    id: "noc-center",
    label: "NOC Center",
    icon: FileText,
    description: "Certificate Requests",
    gradient: "bg-emerald-gradient",
    iconColor: "icon-emerald",
    count: "2 Pending",
    isNew: false,
    isPremium: false,
  },
  {
    id: "reports-manager",
    label: "Reports Manager",
    icon: Upload,
    description: "Submit Reports",
    gradient: "bg-royal-gradient",
    iconColor: "icon-royal",
    count: "Due Today",
    isNew: false,
    isPremium: false,
  },
  {
    id: "certificates-gallery",
    label: "Certificates",
    icon: Award,
    description: "Your Achievements",
    gradient: "bg-cosmic-gradient",
    iconColor: "icon-rose",
    count: "3 Earned",
    isNew: false,
    isPremium: true,
  },
  {
    id: "progress-tracker",
    label: "Progress Tracker",
    icon: TrendingUp,
    description: "Track Journey",
    gradient: "bg-ocean-gradient",
    iconColor: "icon-cyan",
    count: "78%",
    isNew: false,
    isPremium: true,
  },
  {
    id: "notification-center",
    label: "Notifications",
    icon: Bell,
    description: "Updates & Alerts",
    gradient: "bg-rose-gradient",
    iconColor: "icon-rose",
    count: "5",
    isNew: false,
    isPremium: false,
  },
]

function SidebarContent({ activeSection, onSectionChange, collapsed = false, className }: PremiumSidebarProps) {
  return (
    <div className={cn("h-full flex flex-col bg-transparent", className)}>
      {/* Premium Header */}
      <div className="p-8 border-b border-gray-200/30">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 bg-cosmic-gradient rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 animate-float-gentle glow-effect">
              <Sparkles className="h-8 w-8 text-white animate-pulse-glow" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-golden-gradient rounded-full border-4 border-white animate-pulse-glow flex items-center justify-center shadow-xl">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </div>
          {!collapsed && (
            <div className="animate-fade-scale">
              <h2 className="font-bold text-gray-900 text-3xl text-gradient">IMS Portal</h2>
              <p className="text-lg text-gray-600 font-bold">Premium Experience ✨</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Navigation */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="space-y-4">
          {sidebarSections.map((section, index) => (
            <div key={section.id} className="animate-slide-left" style={{ animationDelay: `${index * 0.1}s` }}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto rounded-3xl transition-all duration-700 group relative overflow-hidden glow-effect",
                  collapsed ? "p-5" : "p-6",
                  activeSection === section.id
                    ? `${section.gradient} text-white shadow-2xl transform scale-105 hover:scale-110`
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/90 hover:shadow-xl hover:scale-105 interactive-hover",
                )}
                onClick={() => onSectionChange(section.id)}
              >
                {/* Premium Background Animation */}
                {activeSection === section.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl animate-shimmer"></div>
                )}

                <div className="flex items-center gap-6 w-full relative z-10">
                  <div
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-3xl transition-all duration-500 relative shadow-lg",
                      activeSection === section.id
                        ? "bg-white/20 shadow-2xl backdrop-blur-sm"
                        : "bg-gray-100 group-hover:bg-white group-hover:shadow-xl",
                    )}
                  >
                    <section.icon
                      className={cn(
                        "h-7 w-7 transition-all duration-500",
                        activeSection === section.id
                          ? "text-white animate-bounce-in"
                          : `${section.iconColor} group-hover:text-gray-700 icon-glow hover-scale`,
                      )}
                    />
                    {section.isNew && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-green rounded-full animate-pulse shadow-lg"></div>
                    )}
                    {section.isPremium && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-golden-gradient rounded-full flex items-center justify-center shadow-lg">
                        <Diamond className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xl">{section.label}</span>
                        {section.count && (
                          <Badge
                            className={cn(
                              "text-sm px-4 py-2 font-bold shadow-lg",
                              activeSection === section.id
                                ? "bg-white/20 text-white border-white/30 backdrop-blur-sm"
                                : section.count.includes("New")
                                  ? "badge-electric animate-pulse-glow"
                                  : section.count.includes("Due") || section.count.includes("Pending")
                                    ? "badge-sunset animate-pulse"
                                    : section.count.includes("%")
                                      ? "badge-emerald"
                                      : "badge-royal",
                            )}
                          >
                            {section.count}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-lg mt-2 transition-colors duration-500",
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

      {/* Premium Footer */}
      {!collapsed && (
        <div className="p-8 border-t border-gray-200/30 space-y-8">
          {/* Premium Achievement Section */}
          <div className="premium-card bg-electric-gradient text-white rounded-3xl p-8 glow-effect">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-3xl backdrop-blur-sm shadow-xl">
                <Trophy className="h-7 w-7 text-white animate-bounce-in" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Achievement Unlocked!</p>
                <p className="text-sm text-white/80 font-medium">Consistent Performer 🏆</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-white/80 font-medium">Progress to Next Level</span>
                <span className="font-bold text-white">78%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-1500 ease-out shadow-lg"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/80">
                <span className="font-medium">Level 5</span>
                <span className="font-bold">+250 XP to Level 6</span>
              </div>
            </div>
          </div>

          {/* Premium Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="premium-card text-center p-6 hover-glow-premium interactive-hover">
              <div className="text-3xl font-bold text-gradient">8.5</div>
              <div className="text-sm text-gray-600 font-bold">CGPA</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-golden-yellow fill-current" />
                ))}
              </div>
            </div>
            <div className="premium-card text-center p-6 hover-glow-premium interactive-hover">
              <div className="text-3xl font-bold text-gradient">95%</div>
              <div className="text-sm text-gray-600 font-bold">Attendance</div>
              <div className="flex justify-center mt-2">
                <Badge className="badge-emerald text-xs">Excellent</Badge>
              </div>
            </div>
          </div>

          {/* Premium User Profile */}
          <div className="flex items-center gap-6 premium-card p-6 hover-lift-premium glow-effect">
            <div className="flex items-center justify-center w-14 h-14 bg-electric-gradient rounded-3xl shadow-2xl">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">D23it176</p>
              <p className="text-sm text-gray-600 font-medium">Computer Engineering</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="status-dot status-active"></div>
                <span className="text-sm text-gray-500 font-medium">Online</span>
                <Badge className="badge-electric text-xs">Premium</Badge>
              </div>
            </div>
          </div>

          {/* Premium Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button className="btn-electric h-14 p-3 text-sm hover-scale glow-effect">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button className="btn-emerald h-14 p-3 text-sm hover-scale glow-effect">
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button className="btn-sunset h-14 p-3 text-sm hover-scale glow-effect">
              <Target className="h-5 w-5" />
            </Button>
          </div>

          {/* Premium Motivational Card */}
          <div className="premium-card bg-cosmic-gradient text-white p-6 text-center glow-effect">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mx-auto mb-4 animate-float-gentle">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Keep Soaring! 🚀</h4>
            <p className="text-white/90 text-sm">You're destined for greatness!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function PremiumSidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
  onToggleCollapse,
}: Omit<PremiumSidebarProps, "className">) {
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
            className="lg:hidden premium-card hover:bg-electric-gradient hover:text-white transition-all duration-500 w-14 h-14 hover-scale glow-effect"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-96 glass-sidebar">
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
