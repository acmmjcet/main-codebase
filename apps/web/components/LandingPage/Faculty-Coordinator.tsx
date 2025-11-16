import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FacultyCoordinator = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const faculty1Ref = useRef<HTMLDivElement | null>(null);
  const faculty2Ref = useRef<HTMLDivElement | null>(null);
  const info1Ref = useRef<HTMLDivElement | null>(null);
  const info2Ref = useRef<HTMLDivElement | null>(null);
  const img1Ref = useRef<HTMLDivElement | null>(null);
  const img2Ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const grid1Ref = useRef<HTMLDivElement | null>(null);
  const grid2Ref = useRef<HTMLDivElement | null>(null);

  const facultyData = [
    {
      name: "Mohammed Afroze",
      role: "Technical Advisor",
      department: "Assistant Professor",
      email: "mdafroze@mjcollege.ac.in",
      expertise: "Java Programming, Web Technologies, Software Engineering",
      image: "assets/Faculty_coordinator_1.jpg"
    },
    {
      name: "Dr. Gouri R Patil",
      role: "Faculty Coordinator",
      department: "Associate Professor & HOD",
      email: "gouripatil@mjcollege.ac.in",
      expertise: "Computer networks, Network security, cyber security",
      image: "assets/Faculty_coordinator_2.jpg"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.from(headerRef.current!.children, {
          opacity: 0,
          y: -50,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        });
      }

      // Grid Background Animation
      gsap.to(grid1Ref.current, {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to(grid2Ref.current, {
        backgroundPosition: "-100% -100%",
        duration: 15,
        repeat: -1,
        ease: "none"
      });

      // Faculty 1 Animations
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: faculty1Ref.current,
          start: "top 75%",
          end: "top 20%",
          scrub: 2,
        }
      });

      tl1.fromTo(img1Ref.current,
        {
          opacity: 0,
          x: 100,
          rotateY: 25,
          scale: 0.7
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          ease: "power4.out"
        }
      );

      gsap.fromTo(info1Ref.current,
        {
          y: 150,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faculty1Ref.current,
            start: "top 60%",
            end: "top 15%",
            scrub: 2.5,
          }
        }
      );

      // Faculty 2 Animations
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: faculty2Ref.current,
          start: "top 75%",
          end: "top 20%",
          scrub: 2,
        }
      });

      tl2.fromTo(img2Ref.current,
        {
          opacity: 0,
          x: -100,
          rotateY: -25,
          scale: 0.7
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          ease: "power4.out"
        }
      );

      gsap.fromTo(info2Ref.current,
        {
          y: 150,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faculty2Ref.current,
            start: "top 60%",
            end: "top 15%",
            scrub: 2.5,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        ref={grid1Ref}
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0'
        }}
      />
      
      <div 
        ref={grid2Ref}
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 100, 255, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(0, 100, 255, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0'
        }}
      />

      {/* Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 py-20 px-4">
        {/* Header */}
        <div ref={headerRef} className="max-w-7xl mx-auto mb-32 text-center">
          <div className="relative inline-block mb-8">
            {/* Glowing lines */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-transparent to-cyan-400"></div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-t from-transparent to-cyan-400"></div>
            
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>
            
            <h1 className="text-7xl font-black tracking-wider relative">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                Faculty Coordinators
              </span>
              {/* Glitch effect overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent opacity-30 blur-sm">
                Faculty Coordinators
              </span>
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400"></div>
            <p className="text-gray-400 text-xl tracking-[0.3em] font-light uppercase">
              ACM MJCET Student Chapter
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400"></div>
          </div>
          
          <p className="text-cyan-400/60 text-sm tracking-widest uppercase font-semibold mb-8">
            People who guide us and light the path
          </p>
        </div>

        {/* Faculty 1 */}
        <div ref={faculty1Ref} className="max-w-7xl mx-auto mb-40 relative">
          <div className="relative flex items-center justify-end min-h-[600px]">
            {/* Tech decoration left side */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
              <div className="w-20 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
              <div className="w-8 h-px bg-gradient-to-r from-cyan-400/30 to-transparent"></div>
            </div>

            {/* Image Container */}
            <div ref={img1Ref} className="relative w-[480px] h-[600px] mr-16" style={{perspective: '1000px'}}>
              {/* Holographic frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 rounded-3xl transform rotate-2 blur-2xl"></div>
              
              {/* Corner brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-cyan-400"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-cyan-400"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-blue-400"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-blue-400"></div>
              
              <div className="relative h-full overflow-hidden rounded-2xl border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(0,255,255,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
                <img 
                  src={facultyData[0].image} 
                  alt={facultyData[0].name}
                  className="w-full h-full object-cover"
                />
                {/* Scan lines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Info Card */}
            <div 
              ref={info1Ref}
              className="absolute bottom-12 left-8 w-[480px] bg-black/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(0,255,255,0.2)]"
            >
              {/* Tech corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-300 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-cyan-400 text-xs tracking-widest font-mono uppercase">{facultyData[0].role}</span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{facultyData[0].name}</h2>
                <p className="text-cyan-400 text-sm mb-6 font-light tracking-wide">{facultyData[0].department}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 p-3 bg-cyan-400/5 rounded-lg border border-cyan-400/20">
                    <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/30">
                      <span className="text-cyan-400">📧</span>
                    </div>
                    <span className="text-gray-300 text-sm font-mono">{facultyData[0].email}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-blue-400/5 rounded-lg border border-blue-400/20">
                    <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center border border-blue-400/30">
                      <span className="text-blue-400">💡</span>
                    </div>
                    <span className="text-gray-300 text-sm">{facultyData[0].expertise}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-cyan-400/20">
                  <button className="flex-1 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/40 rounded-lg text-cyan-400 text-sm font-semibold tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                    CONNECT
                  </button>
                  <button className="px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/40 rounded-lg text-blue-400 transition-all duration-300">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty 2 */}
        <div ref={faculty2Ref} className="max-w-7xl mx-auto mb-20 relative">
          <div className="relative flex items-center justify-start min-h-[600px]">
            {/* Tech decoration right side */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-end">
              <div className="w-12 h-px bg-gradient-to-l from-blue-400 to-transparent"></div>
              <div className="w-20 h-px bg-gradient-to-l from-blue-400/50 to-transparent"></div>
              <div className="w-8 h-px bg-gradient-to-l from-blue-400/30 to-transparent"></div>
            </div>

            {/* Image Container */}
            <div ref={img2Ref} className="relative w-[480px] h-[600px] ml-16" style={{perspective: '1000px'}}>
              {/* Holographic frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl transform -rotate-2 blur-2xl"></div>
              
              {/* Corner brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-blue-400"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-blue-400"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-purple-400"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-purple-400"></div>
              
              <div className="relative h-full overflow-hidden rounded-2xl border-2 border-blue-400/40 shadow-[0_0_50px_rgba(0,100,255,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <img 
                  src={facultyData[1].image} 
                  alt={facultyData[1].name}
                  className="w-full h-full object-cover"
                />
                {/* Scan lines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Info Card */}
            <div 
              ref={info2Ref}
              className="absolute bottom-12 right-8 w-[480px] bg-black/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-400/40 shadow-[0_0_40px_rgba(0,100,255,0.2)]"
            >
              {/* Tech corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 rounded-full bg-blue-300 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-blue-400 text-xs tracking-widest font-mono uppercase">{facultyData[1].role}</span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{facultyData[1].name}</h2>
                <p className="text-blue-400 text-sm mb-6 font-light tracking-wide">{facultyData[1].department}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 p-3 bg-blue-400/5 rounded-lg border border-blue-400/20">
                    <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center border border-blue-400/30">
                      <span className="text-blue-400">📧</span>
                    </div>
                    <span className="text-gray-300 text-sm font-mono">{facultyData[1].email}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-purple-400/5 rounded-lg border border-purple-400/20">
                    <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center border border-purple-400/30">
                      <span className="text-purple-400">💡</span>
                    </div>
                    <span className="text-gray-300 text-sm">{facultyData[1].expertise}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-blue-400/20">
                  <button className="flex-1 py-2 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/40 rounded-lg text-blue-400 text-sm font-semibold tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,100,255,0.3)]">
                    CONNECT
                  </button>
                  <button className="px-4 py-2 bg-purple-400/10 hover:bg-purple-400/20 border border-purple-400/40 rounded-lg text-purple-400 transition-all duration-300">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tech bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    </div>
  );
};

export default FacultyCoordinator;