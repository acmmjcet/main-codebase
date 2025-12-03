"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const BlogHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
    { href: "/team", label: "TEAMS" },
    { href: "/events", label: "EVENTS" },
    { href: "/blogs", label: "BLOGS" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Handle menu body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* ACM Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
              ACM
            </div>
            <div>
              <div className="text-lg font-bold leading-tight text-slate-900">ACM MJCET</div>
              <div className="text-xs text-slate-600">Student Chapter</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Open menu"
              className="group flex items-center gap-1 sm:gap-1.5 rounded-full bg-slate-900/90 px-3 py-2 sm:px-4 sm:py-2.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-800"
              type="button"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="text-[10px] sm:text-xs font-bold tracking-widest">MENU</span>
              <div className="relative h-3 w-4">
                <span className="absolute left-0 top-0 h-0.5 w-full bg-white transition-all duration-300" />
                <span className="absolute left-0 top-1.5 h-0.5 w-full bg-white transition-all duration-300" />
                <span className="absolute left-0 top-3 h-0.5 w-full bg-white transition-all duration-300" />
              </div>
            </button>
            <Link
              className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-full bg-slate-900 px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-wider text-white transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
              href="/join"
            >
              <svg
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M8 12h8M12 8v8" />
              </svg>
              <span>JOIN US</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden bg-slate-900/95 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Close Button */}
        <button
          aria-label="Close menu"
          className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          type="button"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6 transition-transform duration-300 hover:rotate-90 sm:h-7 sm:w-7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>

        <div className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-24">
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-slate-800/30 to-transparent blur-2xl" />

            <ul className="relative space-y-4 sm:space-y-6">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={`transition-all duration-700 ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : index % 2 === 0
                        ? "-translate-x-full opacity-0"
                        : "translate-x-full opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen
                      ? `${index * 100 + 300}ms`
                      : "0ms",
                  }}
                >
                  <Link
                    className="group relative block overflow-hidden py-2"
                    href={link.href}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="relative flex flex-shrink-0 items-center">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
                          <div
                            className={`h-0.5 bg-gradient-to-r from-white/50 to-transparent transition-all duration-500 ${
                              isMenuOpen ? "w-8" : "w-0"
                            }`}
                            style={{
                              transitionDelay: `${index * 100 + 500}ms`,
                            }}
                          />
                        </div>
                        <span className="relative text-3xl font-black tracking-wider text-white transition-all duration-200 group-hover:tracking-widest group-hover:text-white/90 sm:text-4xl md:text-5xl">
                          {link.label}
                          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-white via-white/50 to-transparent transition-all duration-500 group-hover:w-full" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Join Button in Menu */}
            <div
              className={`mt-10 flex justify-center transition-all duration-700 ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{
                transitionDelay: isMenuOpen
                  ? `${navLinks.length * 100 + 400}ms`
                  : "0ms",
              }}
            >
              <Link
                className="group relative flex items-center space-x-2 overflow-hidden rounded-full border-2 border-white/30 bg-white/5 px-8 py-4 text-base font-bold tracking-widest text-white backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-white hover:bg-white hover:text-slate-900 sm:px-10 sm:py-4 sm:text-lg"
                href="/join"
                onClick={handleLinkClick}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                  <span>JOIN US</span>
                </span>
                <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-full" />
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="pointer-events-none absolute -left-6 top-1/2 h-32 w-32 -translate-y-1/2 animate-pulse rounded-full bg-white/5 blur-2xl" />
            <div className="pointer-events-none absolute -right-6 top-1/4 h-24 w-24 animate-pulse rounded-full bg-white/5 blur-2xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogHeader;
