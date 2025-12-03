"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, GitCommit, Users } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [showContributions, setShowContributions] = useState(false);
  
  // On about page, always show contributions. On other pages, use toggle state
  const isAboutPage = pathname === '/about';
  const shouldShowContributions = isAboutPage || showContributions;

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/acmmjcet/main-codebase/contributors');
        const data = await response.json();
        setContributors(data);
        const total = data.reduce((sum: number, contributor: Contributor) => sum + contributor.contributions, 0);
        setTotalContributions(total);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContributors();
  }, []);

  const handleNewsletterSubmit = async () => {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Thanks for subscribing!');
    setEmail('');
    setIsSubmitting(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNewsletterSubmit();
    }
  };

  const quickLinks: FooterLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Teams', href: '/team' },
    { label: 'Events', href: '/events' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ];

  const legalLinks: FooterLink[] = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Use', href: '#terms' },
  ];

  const socialLinks: SocialLink[] = [
    { icon: <FaXTwitter className="h-5 w-5" />, href: 'https://x.com/AcmMjcet', label: 'X (Twitter)' },
    { icon: <Instagram className="h-5 w-5" />, href: 'https://www.instagram.com/mjcet_acm', label: 'Instagram' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://www.linkedin.com/company/acmmjcet', label: 'LinkedIn' },
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/acmmjcet', label: 'GitHub' },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[#0f0d0a] to-[#100C08] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-center md:items-start lg:col-span-4">
            <div className="mb-5 w-full max-w-[160px] sm:max-w-[180px]">
              <Image
                priority
                alt="ACM MJCET Logo"
                className="h-auto w-full object-contain"
                height={60}
                src="/logo_without_bg.png"
                width={180}
              />
            </div>
            <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-white/70 md:text-left lg:text-base">
              Empowering students through technology, innovation, and collaboration. Join us in shaping the future of computing.
            </p>
            <Link
              aria-label="Join ACM MJCET Chapter"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              href="/join"
            >
              <span className="relative z-10 bg-gradient-to-r from-white via-white to-white bg-[length:200%_100%] bg-clip-text text-transparent transition-all duration-300 group-hover:animate-shine">
                Join the Chapter
              </span>
            </Link>
          </div>
          <div className="flex flex-col items-center md:items-start lg:col-span-2">
            <h3 className="mb-4 text-base font-bold tracking-wide lg:text-lg">Quick Links</h3>
            <ul className="flex flex-col space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="group relative inline-block text-sm text-white/75 transition-all duration-300 hover:text-white lg:text-base"
                    href={link.href}
                  >
                    <span className="relative bg-gradient-to-r from-white via-white to-white bg-[length:200%_100%] bg-clip-text transition-all duration-300 group-hover:animate-shine">
                      {link.label}
                    </span>
                    <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-white/80 to-transparent transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center md:col-span-2 md:items-start lg:col-span-6">
            <h3 className="mb-4 text-base font-bold tracking-wide lg:text-lg">Connect With Us</h3>
            <div className="mb-5 w-full max-w-md space-y-2.5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-4 backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                <Link
                  className="group break-all text-sm text-white/80 transition-colors duration-300 hover:text-white"
                  href="mailto:acm@mjcollege.ac.in"
                >
                  <span className="bg-gradient-to-r from-white via-white to-white bg-[length:200%_100%] bg-clip-text transition-all duration-300 group-hover:animate-shine">
                    acm@mjcollege.ac.in
                  </span>
                </Link>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                <Link
                  className="group text-sm text-white/80 transition-colors duration-300 hover:text-white"
                  href="tel:+917799005866"
                >
                  <span className="bg-gradient-to-r from-white via-white to-white bg-[length:200%_100%] bg-clip-text transition-all duration-300 group-hover:animate-shine">
                    +91 779 900 5866
                  </span>
                </Link>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                <p className="text-sm leading-relaxed text-white/80">
                  Muffakham Jah College of Engineering & Technology, Hyderabad
                </p>
              </div>
            </div>
            <div className="mb-5 w-full max-w-md">
              <h4 className="mb-3 text-center text-sm font-semibold md:text-left">Newsletter</h4>
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <input
                  className="w-full flex-1 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  type="button"
                  onClick={handleNewsletterSubmit}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <p className="mt-2 text-center text-xs text-green-400/90 sm:text-left">
                  {message}
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 md:justify-start">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  aria-label={social.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-white/70 transition-colors duration-300 group-hover:text-white">
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#0a0f1e] via-[#0d1020] to-[#0f1224]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-center text-xs text-white/50 md:text-left md:text-sm">
              © {new Date().getFullYear()} ACM MJCET Student Chapter. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <Link
                    className="group text-xs text-white/50 transition-colors duration-300 hover:text-white/90 md:text-sm"
                    href={link.href}
                  >
                    <span className="bg-gradient-to-r from-white via-white to-white bg-[length:200%_100%] bg-clip-text transition-all duration-300 group-hover:animate-shine">
                      {link.label}
                    </span>
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-white/20">|</span>
                  )}
                </React.Fragment>
              ))}
              {/* Contributions toggle - inline with legal links */}
              {!isAboutPage && (
                <>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 md:text-sm">Contributions</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showContributions}
                      onClick={() => setShowContributions(!showContributions)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                        showContributions ? 'bg-white/20' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          showContributions ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-white/[0.05] bg-gradient-to-b from-[#070b14] via-[#090d18] to-[#0a0e1a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-sm font-semibold text-white/80 sm:text-base">Developed By</h3>
            <p className="text-xs text-white/50">ACM Tech Team</p>
          </div>

          {shouldShowContributions && (
            <>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                      <Users className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/80">
                        <span className="font-semibold text-white">{contributors.length}</span> Contributors
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                      <GitCommit className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/80">
                        <span className="font-semibold text-white">{totalContributions}</span> Commits
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {contributors.map((contributor) => (
                      <a
                        key={contributor.login}
                        className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105"
                        href={contributor.html_url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-white/5 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                          <img
                            alt={contributor.login}
                            className="relative h-14 w-14 rounded-full border-2 border-white/20 object-cover transition-all duration-300 group-hover:border-white/40 sm:h-16 sm:w-16"
                            src={contributor.avatar_url}
                          />
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <p className="text-xs font-medium text-white/90 transition-colors duration-300 group-hover:text-white sm:text-sm">
                            {contributor.login}
                          </p>
                          <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
                            <GitCommit className="h-3 w-3 text-white/50" />
                            <span className="text-xs text-white/60">{contributor.contributions}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shine {
          animation: shine 2s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;