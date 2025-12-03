import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutSectionProps {
  className?: string;
}

const milestones: Milestone[] = [
  {
    year: "2020",
    title: "Chapter Founded",
    description: "ACM MJCET Student Chapter established with a vision to empower tech enthusiasts"
  },
  {
    year: "2021",
    title: "First Tech Fest",
    description: "Successfully organized our flagship technical symposium with 500+ participants"
  },
  {
    year: "2022",
    title: "National Recognition",
    description: "Received ACM India Outstanding Chapter Award for innovation and impact"
  },
  {
    year: "2023",
    title: "Global Collaboration",
    description: "Partnered with international tech communities and hosted global speakers"
  },
  {
    year: "2024",
    title: "Innovation Hub",
    description: "Launched dedicated innovation lab for cutting-edge research projects"
  }
];

const containerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const AboutSection = ({ className = "" }: AboutSectionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Avoid re-renders on hover; use pure CSS for hover effects instead of state

  useEffect(() => {
    if (shouldReduceMotion || !sectionRef.current || !contentRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPosition: "100% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
          }
        });
      }

      // Batch animations to reduce ScrollTrigger instances
      ScrollTrigger.batch('[data-animate]', {
        start: 'top 85%',
        end: 'top 60%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
          );
        },
        once: true
      });

      ScrollTrigger.batch('[data-milestone]', {
        start: 'top 90%',
        end: 'top 65%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 80, rotateX: -10 },
            { opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }
          );
        },
        once: true
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  const fadeInVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-[#0f0d0a] ${className}`}
    >
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(55, 65, 81, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(55, 65, 81, 0.15) 1px, transparent 1px),
            radial-gradient(ellipse at top, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.6) 0%, transparent 50%)
          `,
          backgroundSize: "80px 80px, 80px 80px, 100% 100%, 100% 100%",
          backgroundPosition: "0 0, 0 0, center top, center bottom",
          transform: "perspective(1000px) rotateX(60deg) scale(1.5)",
          transformOrigin: "center top"
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-slate-700/5 blur-[100px]" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-gray-600/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-800/10 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#0f0d0a]" />
      <div ref={contentRef} className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div data-animate className="mb-20 text-center sm:mb-24 lg:mb-28">
          <motion.div
            animate={shouldReduceMotion ? {} : "visible"}
            className="mb-5"
            initial="hidden"
            variants={fadeInVariants}
          >
            <span className="inline-block border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 sm:text-sm">
              Discover Our Journey
            </span>
          </motion.div>
          <motion.h2
            animate={shouldReduceMotion ? {} : "visible"}
            className="mb-4 text-5xl font-black leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            initial="hidden"
            style={{
              textShadow: "0 0 40px rgba(255, 255, 255, 0.1)"
            }}
            variants={fadeInVariants}
          >
            About ACM MJCET
          </motion.h2>
          <motion.div
            animate={shouldReduceMotion ? {} : "visible"}
            className="mx-auto mt-4 h-1 w-32 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
            initial="hidden"
            variants={fadeInVariants}
          />
        </div>
        <div className="mb-20 grid gap-10 sm:mb-24 lg:mb-28 lg:grid-cols-2 lg:gap-16">
          <div data-animate className="flex items-center justify-center lg:justify-end">
            <div className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-800/20 via-slate-800/20 to-gray-900/20 blur-2xl" />
              <div 
                className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-br from-gray-950 via-slate-950 to-black shadow-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(75, 85, 99, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(75, 85, 99, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <svg
                  className="relative z-10 h-36 w-36 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    animate={{ pathLength: 1, opacity: 1 }}
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    initial={{ pathLength: 0, opacity: 0 }}
                    stroke="url(#grad1)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                  <motion.path
                    animate={{ pathLength: 1, opacity: 1 }}
                    d="M2 17L12 22L22 17"
                    initial={{ pathLength: 0, opacity: 0 }}
                    stroke="url(#grad2)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
                  />
                  <motion.path
                    animate={{ pathLength: 1, opacity: 1 }}
                    d="M2 12L12 17L22 12"
                    initial={{ pathLength: 0, opacity: 0 }}
                    stroke="url(#grad3)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    transition={{ duration: 2.5, delay: 1.2, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="grad1" x1="2" x2="22" y1="2" y2="12">
                      <stop offset="0%" stopColor="#9CA3AF" />
                      <stop offset="100%" stopColor="#D1D5DB" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="2" x2="22" y1="17" y2="22">
                      <stop offset="0%" stopColor="#D1D5DB" />
                      <stop offset="100%" stopColor="#6B7280" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="2" x2="22" y1="12" y2="17">
                      <stop offset="0%" stopColor="#9CA3AF" />
                      <stop offset="100%" stopColor="#6B7280" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              </div>
            </div>
          </div>
          <div data-animate className="flex flex-col justify-center space-y-6">
            <motion.div
              animate={shouldReduceMotion ? {} : "visible"}
              className="space-y-6"
              initial="hidden"
              variants={containerVariants}
            >
              <motion.p
                className="border-l-2 border-gray-700 pl-4 text-base leading-relaxed text-gray-300 sm:text-lg"
                variants={itemVariants}
              >
                The ACM MJCET Student Chapter is a vibrant community of technology enthusiasts, innovators, and future leaders. We are dedicated to fostering a culture of learning, collaboration, and excellence in computing.
              </motion.p>
              <motion.p
                className="border-l-2 border-gray-700 pl-4 text-base leading-relaxed text-gray-300 sm:text-lg"
                variants={itemVariants}
              >
                Our mission is to empower students with cutting-edge technical knowledge, industry insights, and hands-on experience through workshops, hackathons, seminars, and collaborative projects.
              </motion.p>
              <motion.p
                className="border-l-2 border-gray-700 pl-4 text-base leading-relaxed text-gray-300 sm:text-lg"
                variants={itemVariants}
              >
                As part of the global ACM network, we provide our members with access to world-class resources, mentorship opportunities, and a platform to showcase their talents internationally.
              </motion.p>
              <motion.div className="pt-4" variants={itemVariants}>
                <motion.button
                  className="group relative overflow-hidden border border-gray-700 bg-gradient-to-r from-gray-900 to-black px-8 py-4 font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:border-gray-500 hover:shadow-gray-800/50"
                  type="button"
                  onClick={() => window.location.href = "/join"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join Our Community
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"
                    initial={{ x: "-100%" }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ x: 0 }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* <div data-animate className="mb-12 text-center">
          <h3 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Our{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Journey</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-gray-700 to-gray-600 opacity-30" />
            </span>
          </h3>
        </div> */}

        {/* <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-5 will-change-transform">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className="group relative"
              data-milestone
              style={{ perspective: "1000px" }}
            >
              <div 
                className="relative h-full overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-br from-gray-950 via-slate-950 to-black p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:border-gray-600 hover:shadow-gray-800/40"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(75, 85, 99, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(75, 85, 99, 0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px"
                }}
              >
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div
                  className="mb-4 inline-block border border-gray-700 bg-gradient-to-br from-gray-900 to-black px-4 py-2 transition-transform duration-300 group-hover:scale-105"
                >
                  <span className="text-2xl font-black text-white">
                    {milestone.year}
                  </span>
                </div>
                <h4 className="mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-gray-300">
                  {milestone.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-400">
                  {milestone.description}
                </p>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-gray-800/20 to-transparent blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div> */}

        <motion.div
          data-animate
          className="mt-20 overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-br from-gray-950 via-slate-950 to-black p-8 text-center shadow-2xl sm:mt-24 md:p-12 lg:mt-28"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(75, 85, 99, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(75, 85, 99, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <h3 className="mb-4 text-3xl font-black text-white sm:text-4xl md:text-5xl">
            Ready to Shape the Future?
          </h3>
          <p className="mb-8 text-base text-gray-400 sm:text-lg">
            Join hundreds of students who are building, learning, and growing together at ACM MJCET.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              className="w-full border border-white bg-white px-8 py-4 font-bold uppercase tracking-wider text-black shadow-lg transition-all hover:bg-gray-100 sm:w-auto"
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="w-full border border-gray-700 bg-gradient-to-r from-gray-900 to-black px-8 py-4 font-bold uppercase tracking-wider text-white transition-all hover:border-gray-600 hover:from-gray-800 hover:to-gray-900 sm:w-auto"
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;