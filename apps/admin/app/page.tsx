"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Compass,
  Bell,
  LayoutDashboard,
  Users,
  User,
  Search,
  FileText,
  Menu,
  Plus,
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  Award,
  Briefcase,
  FolderKanban,
  Code2,
  Quote,
  UserCircle,
  Wrench,
  Heart,
  Mail,
  Calendar,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  Loader2,
} from "lucide-react";
import Auth from "@/components/Auth";
import SettingsComponent from "@/components/Settings";
import { supabase } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";

// ACM Logo Icon
const ACMLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* A */}
    <path
      d="M6 20V4L12 2L18 4V20"
      stroke="#FF6B35"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 20H18"
      stroke="#FF6B35"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11H15"
      stroke="#FF6B35"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Profile Section Keys
type ProfileSection =
  | "hero"
  | "achievements"
  | "specializations"
  | "projects"
  | "skills"
  | "testimonials"
  | "about"
  | "services"
  | "support"
  | "contact";

// Navigation Keys
type NavKey =
  | "home"
  | "discover"
  | "events"
  | "notifications"
  | "dashboard"
  | "members"
  | "blogs"
  | "settings"
  | ProfileSection;

// Profile Sections Config
const profileSections: {
  key: ProfileSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "hero", label: "Hero Section", icon: Sparkles },
  { key: "achievements", label: "Achievements", icon: Award },
  { key: "specializations", label: "Specializations", icon: Briefcase },
  { key: "projects", label: "Featured Projects", icon: FolderKanban },
  { key: "skills", label: "Skills & Tech Stack", icon: Code2 },
  { key: "testimonials", label: "Testimonials", icon: Quote },
  { key: "about", label: "About Me", icon: UserCircle },
  { key: "services", label: "Services", icon: Wrench },
  { key: "support", label: "Support My Work", icon: Heart },
  { key: "contact", label: "Contact CTA", icon: Mail },
];

// Navigation Item Component
const NavItem = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
      ${
        isActive
          ? "bg-[#1c2333] text-white"
          : "text-[#8b8b8b] hover:text-white hover:bg-[#141414]"
      }
    `}
  >
    <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
    <span className="text-[14px] font-medium truncate">{label}</span>
  </button>
);

// Dropdown Navigation Item
const DropdownNavItem = ({
  icon: Icon,
  label,
  isOpen,
  isActive,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="space-y-0.5">
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left
        ${
          isActive
            ? "bg-[#1c2333] text-white"
            : "text-[#8b8b8b] hover:text-white hover:bg-[#141414]"
        }
      `}
    >
      <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
      <span className="text-[14px] font-medium truncate flex-1">{label}</span>
      {isOpen ? (
        <ChevronDown size={16} className="flex-shrink-0" />
      ) : (
        <ChevronRight size={16} className="flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="ml-4 pl-3 border-l border-[#1f1f1f] space-y-0.5">
        {children}
      </div>
    )}
  </div>
);

// Sub Navigation Item
const SubNavItem = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left
      ${
        isActive
          ? "bg-[#1c2333]/70 text-white"
          : "text-[#6b6b6b] hover:text-white hover:bg-[#141414]"
      }
    `}
  >
    <Icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
    <span className="text-[13px] font-medium truncate">{label}</span>
  </button>
);

// Content Section Component
const ContentSection = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) => (
  <div className="bg-[#161616] border border-[#222222] rounded-2xl p-8 sm:p-10">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 bg-[#1c2333] rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={24} className="text-[#FF6B35]" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {title}
        </h2>
        <p className="text-[#6b6b6b] text-sm sm:text-base">{description}</p>
      </div>
    </div>
    <div className="bg-[#111111] rounded-xl p-6 border border-[#1f1f1f]">
      <p className="text-[#8b8b8b] text-sm">
        Configure and manage the <span className="text-white">{title}</span>{" "}
        section of your portfolio from here. Add content, update settings, and
        preview changes in real-time.
      </p>
      <button className="mt-4 px-4 py-2 bg-[#1c2333] hover:bg-[#243044] text-white text-sm font-medium rounded-lg transition-colors">
        Edit Section
      </button>
    </div>
  </div>
);

// Content configurations
const contentConfig: Record<
  NavKey,
  { title: string; description: string; icon: React.ElementType }
> = {
  home: {
    title: "Welcome to ACM MJCET Admin",
    description:
      "Manage your ACM chapter's digital presence. Access all administrative tools, analytics, and content management features from this central dashboard.",
    icon: Home,
  },
  discover: {
    title: "Discover",
    description:
      "Explore trending topics, popular content, and discover new opportunities within the ACM community.",
    icon: Compass,
  },
  events: {
    title: "Events Management",
    description:
      "Create, schedule, and manage ACM MJCET events. Track registrations, send notifications, and analyze event performance.",
    icon: Calendar,
  },
  notifications: {
    title: "Notifications Center",
    description:
      "Manage push notifications, email alerts, and in-app messages for ACM members and subscribers.",
    icon: Bell,
  },
  dashboard: {
    title: "Analytics Dashboard",
    description:
      "View comprehensive analytics, member growth metrics, engagement statistics, and performance insights.",
    icon: TrendingUp,
  },
  members: {
    title: "Members Management",
    description:
      "Manage ACM MJCET members, roles, permissions, and membership tiers. View member activity and engagement.",
    icon: Users,
  },
  blogs: {
    title: "Blogs Management",
    description:
      "Create, edit, and publish blog posts. Manage categories, tags, and featured articles for the ACM MJCET blog.",
    icon: BookOpen,
  },
  hero: {
    title: "Hero Section",
    description:
      "Configure the hero banner with name, profession, value statement, CTAs, and visual elements.",
    icon: Sparkles,
  },
  achievements: {
    title: "Achievements & Social Proof",
    description:
      "Showcase company logos, publications, achievements metrics, and social proof elements.",
    icon: Award,
  },
  specializations: {
    title: "Specializations",
    description:
      "Define your business-oriented skill categories and expertise areas.",
    icon: Briefcase,
  },
  projects: {
    title: "Featured Projects",
    description:
      "Manage your portfolio projects with case studies, tech stacks, and outcomes.",
    icon: FolderKanban,
  },
  skills: {
    title: "Skills & Tech Stack",
    description:
      "Organize your technical skills across Frontend, Backend, Tools, and other categories.",
    icon: Code2,
  },
  testimonials: {
    title: "Testimonials",
    description:
      "Manage client reviews, quotes, and testimonials to build trust.",
    icon: Quote,
  },
  about: {
    title: "About Me",
    description:
      "Share your story, motivation, mission, and add a personal touch to your portfolio.",
    icon: UserCircle,
  },
  services: {
    title: "Services",
    description:
      "Define your service offerings, deliverables, pricing tiers, and target audience.",
    icon: Wrench,
  },
  support: {
    title: "Support My Work",
    description:
      "Set up donation links, sponsorship options, and ways for people to support your work.",
    icon: Heart,
  },
  contact: {
    title: "Contact CTA",
    description:
      "Configure contact forms, social links, email, and booking integrations.",
    icon: Mail,
  },
  settings: {
    title: "Profile Settings",
    description:
      "Manage your profile information, preferences, and account settings.",
    icon: SettingsIcon,
  },
};

const AdminDashboard = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Allowed email domain
  const ALLOWED_EMAIL_DOMAIN = "@mjcollege.ac.in";

  // Validate email domain
  const isValidEmailDomain = (email: string | undefined): boolean => {
    if (!email) return false;
    return email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase());
  };

  // Handle unauthorized email - sign out and show error
  const handleUnauthorizedEmail = async (email: string) => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(
      `Access denied. Only ${ALLOWED_EMAIL_DOMAIN} emails are allowed. You signed in with: ${email}`
    );
    setIsLoading(false);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setAuthError(error.message);
          setIsAuthenticated(false);
        } else if (session?.user) {
          // Validate email domain
          if (!isValidEmailDomain(session.user.email)) {
            await handleUnauthorizedEmail(session.user.email || "unknown");
            return;
          }
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setAuthError(message);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          if (!isValidEmailDomain(session.user.email)) {
            await handleUnauthorizedEmail(session.user.email || "unknown");
            return;
          }
          setUser(session.user);
          setIsAuthenticated(true);
          setAuthError(null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setUser(null);
    } catch (err: unknown) {
      console.error("Sign out error:", err);
      const message = err instanceof Error ? err.message : "Failed to sign out";
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth callbacks
  const handleAuthSuccess = () => {
    setAuthError(null);
  };

  const handleAuthError = (error: string) => {
    setAuthError(error);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavClick = (nav: NavKey) => {
    setActiveNav(nav);
    closeSidebar();
  };

  const isProfileSection = (nav: NavKey): nav is ProfileSection => {
    return profileSections.some((s) => s.key === nav);
  };

  const currentContent = contentConfig[activeNav];

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#161616] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
          </div>
          <p className="text-[#6b6b6b] text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not Authenticated - Show Auth Screen
  if (!isAuthenticated) {
    return (
      <Auth 
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        initialError={authError}
      />
    );
  }

  // Authenticated - Show Dashboard
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Sleek Scrollbar for Sidebar */
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }

        /* Main Content Scrollbar */
        .main-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .main-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .main-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .main-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .main-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] bg-[#0a0a0a] 
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-full overflow-hidden
      `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ACMLogo />
            <span className="text-white font-semibold text-lg tracking-tight">
              ACM MJCET
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#141414] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            <NavItem
              icon={Home}
              label="Home"
              isActive={activeNav === "home"}
              onClick={() => handleNavClick("home")}
            />
            <NavItem
              icon={Compass}
              label="Discover"
              isActive={activeNav === "discover"}
              onClick={() => handleNavClick("discover")}
            />
            <NavItem
              icon={Calendar}
              label="Events"
              isActive={activeNav === "events"}
              onClick={() => handleNavClick("events")}
            />
            <NavItem
              icon={Bell}
              label="Notifications"
              isActive={activeNav === "notifications"}
              onClick={() => handleNavClick("notifications")}
            />
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={activeNav === "dashboard"}
              onClick={() => handleNavClick("dashboard")}
            />
            <NavItem
              icon={Users}
              label="Members"
              isActive={activeNav === "members"}
              onClick={() => handleNavClick("members")}
            />
            <NavItem
              icon={BookOpen}
              label="Blogs"
              isActive={activeNav === "blogs"}
              onClick={() => handleNavClick("blogs")}
            />
          </div>

          {/* Divider */}
          <div className="my-4 mx-1 h-px bg-[#1f1f1f]" />

          {/* Profile Portfolio Section */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">
                Portfolio Sections
              </span>
            </div>
          </div>

          {/* Profile Dropdown */}
          <DropdownNavItem
            icon={User}
            label="Profile Portfolio"
            isOpen={isProfileOpen}
            isActive={isProfileSection(activeNav)}
            onToggle={() => setIsProfileOpen(!isProfileOpen)}
          >
            {profileSections.map((section) => (
              <SubNavItem
                key={section.key}
                icon={section.icon}
                label={section.label}
                isActive={activeNav === section.key}
                onClick={() => handleNavClick(section.key)}
              />
            ))}
          </DropdownNavItem>

          {/* Divider */}
          <div className="my-4 mx-1 h-px bg-[#1f1f1f]" />

          {/* Quick Actions */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider">
                Quick Actions
              </span>
              <button className="p-1 rounded-md text-[#6b6b6b] hover:text-white hover:bg-[#141414] transition-colors">
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-0.5">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6b6b6b] hover:text-white hover:bg-[#141414] transition-all duration-200 w-full">
              <div className="w-6 h-6 rounded-lg border border-[#2a2a2a] border-dashed flex items-center justify-center flex-shrink-0">
                <Plus size={14} className="text-[#6b6b6b]" />
              </div>
              <span className="text-[14px] font-medium">New Blog Post</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6b6b6b] hover:text-white hover:bg-[#141414] transition-all duration-200 w-full">
              <div className="w-6 h-6 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-white" />
              </div>
              <span className="text-[14px] font-medium">Create Event</span>
            </button>
          </div>
        </nav>

        {/* Bottom Menu Bar */}
        <div className="px-3 py-3 flex-shrink-0 border-t border-[#1a1a1a]">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-[#1c2333] rounded-lg flex items-center justify-center">
                  <User size={16} className="text-[#6b6b6b]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[#6b6b6b] text-xs truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between px-3 py-2">
            <button 
              onClick={() => {
                setActiveNav("settings");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-2 transition-colors ${activeNav === "settings" ? "text-[#FF6B35]" : "text-[#8b8b8b] hover:text-white"}`}
            >
              <SettingsIcon size={18} strokeWidth={1.5} />
              <span className="text-[14px] font-medium">Settings</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-[#6b6b6b] hover:text-white hover:bg-[#141414] transition-colors">
                <HelpCircle size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-[#6b6b6b] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-[#0a0a0a] lg:p-2">
        <div className="h-full bg-[#111111] lg:rounded-2xl overflow-y-auto main-scroll lg:border lg:border-[#1a1a1a]">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-[#111111] sticky top-0 z-10 border-b border-[#1a1a1a]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <ACMLogo />
              <span className="text-white font-semibold text-lg">
                ACM MJCET
              </span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Content Area - Switch Based Rendering */}
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-6">
                <span>Admin</span>
                <ChevronRight size={14} />
                <span className="text-white">{currentContent.title}</span>
              </div>

              {/* Dynamic Content - Skip for settings page */}
              {activeNav !== "settings" && (
                <ContentSection
                  title={currentContent.title}
                  description={currentContent.description}
                  icon={currentContent.icon}
                />
              )}

              {/* Additional Quick Stats for Home */}
              {activeNav === "home" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-blue-400" />
                      </div>
                      <span className="text-[#6b6b6b] text-sm">
                        Total Members
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">1,234</p>
                  </div>
                  <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen size={20} className="text-green-400" />
                      </div>
                      <span className="text-[#6b6b6b] text-sm">Blog Posts</span>
                    </div>
                    <p className="text-2xl font-bold text-white">48</p>
                  </div>
                  <div className="bg-[#161616] border border-[#222222] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Calendar size={20} className="text-purple-400" />
                      </div>
                      <span className="text-[#6b6b6b] text-sm">
                        Upcoming Events
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">5</p>
                  </div>
                </div>
              )}

              {/* Blogs specific content */}
              {activeNav === "blogs" && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Recent Posts
                    </h3>
                    <button className="px-4 py-2 bg-[#FF6B35] hover:bg-[#e55a2a] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                      <Plus size={16} />
                      New Post
                    </button>
                  </div>
                  <div className="bg-[#161616] border border-[#222222] rounded-xl divide-y divide-[#222222]">
                    {[
                      "Getting Started with React 19",
                      "ACM Code Sprint Results",
                      "Web Dev Workshop Recap",
                    ].map((post, i) => (
                      <div
                        key={i}
                        className="p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1c2333] rounded-lg flex items-center justify-center">
                            <FileText size={18} className="text-[#6b6b6b]" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{post}</p>
                            <p className="text-[#6b6b6b] text-sm">
                              Draft • Updated 2 days ago
                            </p>
                          </div>
                        </div>
                        <button className="text-[#6b6b6b] hover:text-white transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Component */}
              {activeNav === "settings" && <SettingsComponent />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;