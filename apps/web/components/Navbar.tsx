"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [_isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Don't hide navbar if menu is open
      if (isMenuOpen) {
        lastScrollY.current = currentScrollY;
        return;
      }

      // Show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsNavbarVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleEscape);

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      setIsNavbarVisible(true); // Always show navbar when menu is open
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 px-3 transition-transform duration-300 ease-out sm:px-4 md:px-6 lg:px-8 ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        } ${className}`}
        role="navigation"
      >
        <div
          className={`relative mx-auto mt-3 flex w-full max-w-[calc(100%-1rem)] items-center justify-between rounded-2xl bg-[#100C08]/95 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 ease-out sm:mt-4 sm:max-w-[calc(100%-1.5rem)] sm:rounded-3xl sm:px-5 sm:py-3.5 md:mt-5 md:max-w-[96%] md:rounded-[40px] md:px-7 md:py-4 md:h-20 lg:max-w-[94%] lg:rounded-[50px] lg:px-9 lg:py-5 lg:h-24 xl:max-w-[92%] xl:rounded-[60px] xl:px-12 xl:py-6 ${
            isMenuOpen
              ? "h-16 sm:h-18"
              : "h-auto"
          }`}
        >
          <Link
            className="z-20 flex flex-shrink-0 items-center gap-1.5 transition-all duration-300 hover:scale-105 sm:gap-2 md:gap-2.5 lg:gap-3"
            href="/"
          >
            <div
              className={`flex flex-shrink-0 items-center justify-center overflow-hidden transition-all duration-700 ${
                isMenuOpen
                  ? "h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20"
                  : "h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20"
              }`}
            >
              <Image
                alt="ACM MJCET Logo"
                className="h-full w-full object-contain"
                height={100}
                priority
                src="/logo_without_bg.png"
                width={100}
              />
            </div>
            <div
              className={`flex flex-col justify-center transition-all duration-500 ${
                isMenuOpen ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <span className="whitespace-nowrap text-[10px] font-bold leading-tight tracking-wide text-white sm:text-xs md:text-sm lg:text-base xl:text-lg">
                ACM MJCET
              </span>
              <span className="whitespace-nowrap text-[7px] leading-tight text-white/90 sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs">
                Student Chapter
              </span>
            </div>
          </Link>

          <div
            className={`flex flex-shrink-0 items-center gap-2 transition-opacity duration-300 sm:gap-2.5 md:gap-3 lg:gap-4 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              aria-controls="navigation-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="group relative z-20 flex flex-shrink-0 items-center gap-0.5 rounded-full bg-white/10 px-2 py-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 sm:gap-1 sm:px-2.5 sm:py-1.5 md:gap-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 xl:px-5 xl:py-3"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-[8px] font-bold leading-none tracking-widest sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm">
                MENU
              </span>
              <div className="relative h-2.5 w-3 sm:h-3 sm:w-3.5 md:h-3.5 md:w-4 lg:h-4 lg:w-5">
                <span className="absolute left-0 top-0 h-0.5 w-full bg-white transition-all duration-300" />
                <span className="absolute left-0 top-1 h-0.5 w-full bg-white transition-all duration-300 sm:top-1.5" />
                <span className="absolute left-0 top-2 h-0.5 w-full bg-white transition-all duration-300 sm:top-2.5 md:top-3" />
              </div>
            </button>

            <Link
              className="z-20 flex flex-shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-white px-2 py-1.5 text-[8px] font-bold leading-none tracking-wider text-[#100C08] transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 sm:gap-1 sm:px-2.5 sm:py-1.5 sm:text-[9px] md:gap-1.5 md:px-3 md:py-2 md:text-[10px] lg:px-4 lg:py-2.5 lg:text-xs xl:px-5 xl:py-3 xl:text-sm"
              href="/join"
            >
              <svg
                className="h-2 w-2 flex-shrink-0 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4"
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

          <button
            aria-label="Close menu"
            className={`group absolute right-2 top-1/2 z-20 flex h-7 w-7 flex-shrink-0 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-500 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 sm:h-8 sm:w-8 md:right-4 md:h-10 md:w-10 lg:right-6 lg:h-12 lg:w-12 xl:right-8 xl:h-14 xl:w-14 ${
              isMenuOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            type="button"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8"
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
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 overflow-hidden bg-[#0a0806]/90 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-24 sm:px-4 sm:py-20 md:px-6 md:py-24 lg:px-8">
          <div className="relative w-full max-w-5xl">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#100C08]/30 to-transparent blur-2xl sm:h-[260px] sm:w-[260px] md:h-[320px] md:w-[320px] lg:h-[380px] lg:w-[380px]" />

            <ul className="relative space-y-4 sm:space-y-2 md:space-y-3 lg:space-y-4 xl:space-y-6">
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
                    className="group relative block overflow-hidden py-2 sm:py-1 md:py-1.5 lg:py-2"
                    href={link.href}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center justify-center space-x-2 sm:justify-start sm:space-x-2 md:space-x-3 lg:justify-center lg:space-x-4">
                      <div className="flex items-center space-x-2 sm:space-x-1.5 md:space-x-2 lg:space-x-3">
                        <div className="relative flex flex-shrink-0 items-center">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-white/50 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 lg:h-2.5 lg:w-2.5" />
                          <div
                            className={`h-0.5 bg-gradient-to-r from-white/50 to-transparent transition-all duration-500 ${
                              isMenuOpen
                                ? "w-6 sm:w-4 md:w-6 lg:w-8 xl:w-12"
                                : "w-0"
                            }`}
                            style={{
                              transitionDelay: `${index * 100 + 500}ms`,
                            }}
                          />
                        </div>
                <span className="relative text-3xl font-black tracking-wider text-white transition-all duration-200 group-hover:tracking-widest group-hover:text-white/90 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                          {link.label}
                          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-white via-white/50 to-transparent transition-all duration-500 group-hover:w-full sm:-bottom-0.5 sm:h-0.5 md:h-1" />
                        </span>
                      </div>
                      <div
                        className={`hidden h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/20 transition-all duration-500 lg:block ${
                          isMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          transitionDelay: `${index * 100 + 600}ms`,
                        }}
                      />
                    </div>

                    <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center space-x-0.5 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:right-2 sm:flex sm:space-x-1 md:right-4">
                      <div className="h-px w-1.5 bg-white/50 sm:w-2 md:w-4 lg:w-6" />
                      <svg
                        className="h-2.5 w-2.5 flex-shrink-0 text-white/50 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <line x1="5" x2="19" y1="12" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className={`mt-8 flex justify-center transition-all duration-700 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 ${
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
                className="group relative flex items-center space-x-2 overflow-hidden rounded-full border-2 border-white/30 bg-white/5 px-8 py-4 text-base font-bold tracking-widest text-white backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-white hover:bg-white hover:text-[#100C08] focus:outline-none focus:ring-2 focus:ring-white/50 sm:px-6 sm:py-3 sm:text-sm md:space-x-2 md:px-8 md:py-3.5 md:text-base lg:px-10 lg:py-4 lg:text-lg xl:space-x-3 xl:px-12 xl:py-5 xl:text-xl"
                href="/join"
                onClick={handleLinkClick}
              >
                <span className="relative z-10 flex items-center space-x-2 md:space-x-2 xl:space-x-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7"
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

            <div className="pointer-events-none absolute -left-6 top-1/2 h-32 w-32 -translate-y-1/2 animate-pulse rounded-full bg-white/5 blur-2xl sm:h-24 sm:w-24 md:-left-8 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48" />
            <div className="pointer-events-none absolute -right-6 top-1/4 h-24 w-24 animate-pulse rounded-full bg-white/5 blur-2xl sm:h-20 sm:w-20 md:-right-8 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;