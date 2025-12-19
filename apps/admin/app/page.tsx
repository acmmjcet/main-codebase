"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  Bell, 
  LayoutDashboard, 
  Users, 
  User, 
  Search,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
  Globe,
  Moon,
  FileCheck,
  LogOut,
  Menu,
  ChevronRight,
  Plus,
  HelpCircle as HelpIcon
} from 'lucide-react';

const AdminDashboard = () => {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
        main::-webkit-scrollbar {
          width: 8px;
        }
        main::-webkit-scrollbar-track {
          background: transparent;
        }
        main::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }
        main::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-black border-r border-[#1a1a1a]
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#1a1a1a]">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-white-600 rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">$</span>
          </div>
          <span className="text-white font-semibold text-lg">ACM MJCET</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <Link 
            href="/home" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl bg-[#1a2332] border border-[#2a3a4a] text-white mb-1.5 hover:bg-[#1f2938] transition-colors"
          >
            <Home size={18} />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <Link 
            href="/discover" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <Compass size={18} />
            <span className="text-sm font-medium">Discover</span>
          </Link>

          <Link 
            href="/messages" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <MessageSquare size={18} />
            <span className="text-sm font-medium">Messages</span>
          </Link>

          <Link 
            href="/notifications" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <Bell size={18} />
            <span className="text-sm font-medium">Notifications</span>
          </Link>

          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link 
            href="/affiliates" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <Users size={18} />
            <span className="text-sm font-medium">Affiliates</span>
          </Link>

          <Link 
            href="/profile" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <User size={18} />
            <span className="text-sm font-medium">Profile</span>
          </Link>

          {/* Your FANs Section */}
          <div className="mt-6 mb-2">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                YOUR Fans
              </span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* FANS List */}
          <Link 
            href="/cloudy-jean" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-300 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <div className="w-5 h-5 bg-teal-600 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-medium">Cloudy bro</span>
          </Link>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-3 hover:bg-[#0f0f0f] hover:text-white transition-colors">
            <Plus size={18} />
            <span className="text-sm font-medium">Invite new FAN</span>
          </button>

          <Link 
            href="/orders" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <FileText size={18} />
            <span className="text-sm font-medium">Service Orders</span>
          </Link>

          <Link 
            href="/balance" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <DollarSign size={18} />
            <span className="text-sm font-medium">Your earnigns</span>
          </Link>

          <Link 
            href="/account-settings" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Account settings</span>
          </Link>

          <Link 
            href="/help" 
            className="flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Help and Support</span>
          </Link>

          <button 
            onClick={() => setIsLegalOpen(!isLegalOpen)}
            className="w-full flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-gray-400 mb-1.5 hover:bg-[#0f0f0f] hover:text-white transition-colors"
          >
            <FileCheck size={18} />
            <span className="text-sm font-medium">Legal</span>
            <ChevronRight size={16} className={`ml-auto transition-transform ${isLegalOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Legal Submenu */}
          {isLegalOpen && (
            <div className="ml-6 border-l border-[#1a1a1a] pl-3 space-y-1 mb-1.5">
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#0f0f0f] hover:text-white transition-colors"
              >
                About
              </Link>
              <Link 
                href="/privacy" 
                className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#0f0f0f] hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#0f0f0f] hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/docs" 
                className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#0f0f0f] hover:text-white transition-colors"
              >
                Docs
              </Link>
            </div>
          )}
        </nav>

        {/* Menu Button at Bottom */}
        <div className="border-t border-[#1a1a1a] p-3">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-[#0f0f0f] hover:text-white transition-colors">
            <Menu size={18} />
            <span className="text-sm font-medium">Menu</span>
            <HelpIcon size={18} className="ml-auto" />
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content with Rounded Container */}
      <main className="flex-1 overflow-hidden bg-black p-2 lg:p-3">
        <div className="h-full bg-[#0a0a0a] rounded-2xl lg:rounded-3xl overflow-y-auto border border-[#1a1a1a]">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-10">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-white font-semibold text-lg">ACM</span>
            </div>
            <div className="w-6" />
          </div>

          {/* Content Area */}
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] lg:min-h-full p-6 lg:p-8">
            <div className="max-w-2xl w-full">
              {/* Empty State Card */}
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-3xl p-12 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl mx-auto flex items-center justify-center">
                    <FileText size={32} className="text-gray-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Looks like there aren't any posts yet.
                </h2>
                <p className="text-gray-500 text-base">
                  Be the first one to make a post!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;