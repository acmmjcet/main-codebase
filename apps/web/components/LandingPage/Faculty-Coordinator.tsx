import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { connect } from 'http2';
// import { $ } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

const FacultyCoordinator = () => {
  const containerRef = useRef(null);
  const faculty1Ref = useRef(null);
  const faculty2Ref = useRef(null);
  const info1Ref = useRef(null);
  const info2Ref = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const headerRef = useRef(null);
  const grid1Ref = useRef(null);
  const grid2Ref = useRef(null);

  const facultyData = [
    {
      name: "Mohammed Afroze",
      role: "Technical Advisor",
      department: "Assistant Professor",
      email: "mdafroze@mjcollege.ac.in",
      expertise: "Java Programming, Web Technologies, Software Engineering",
      image: "assets/Faculty_coordinator_1.jpg",
      social: "https://www.linkedin.com/in/afroze-mohammed-32643515"
    },
    {
      name: "Dr. Gouri R Patil",
      role: "Faculty Coordinator",
      department: "Associate Professor & HOD",
      email: "gouripatil@mjcollege.ac.in",
      expertise: "Computer networks, Network security, cyber security",
      image: "assets/Faculty_coordinator_2.jpg",
      social: "https://www.linkedin.com/in/dr-gouri-r-patil-b710971a7"
    }
  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.from((headerRef.current as any).children, {
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

      // Faculty Animations
      if (!isMobile) {
        // Faculty 1 Animations
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: faculty1Ref.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1.5,
          }
        });

        tl1.fromTo(img1Ref.current,
          {
            opacity: 0,
            x: isTablet ? 60 : 100,
            scale: 0.8
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            ease: "power3.out"
          }
        );

        gsap.fromTo(info1Ref.current,
          {
            opacity: 0,
            x: isTablet ? -60 : -100,
            scale: 0.85
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faculty1Ref.current,
              start: "top 65%",
              end: "top 25%",
              scrub: 1.5,
            }
          }
        );

        // Faculty 2 Animations
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: faculty2Ref.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1.5,
          }
        });

        tl2.fromTo(img2Ref.current,
          {
            opacity: 0,
            x: isTablet ? -60 : -100,
            scale: 0.8
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            ease: "power3.out"
          }
        );

        gsap.fromTo(info2Ref.current,
          {
            opacity: 0,
            x: isTablet ? 60 : 100,
            scale: 0.85
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faculty2Ref.current,
              start: "top 65%",
              end: "top 25%",
              scrub: 1.5,
            }
          }
        );
      } else {
        // Simple fade-in for mobile
        gsap.from([img1Ref.current, info1Ref.current], {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faculty1Ref.current,
            start: "top 80%",
          }
        });

        gsap.from([img2Ref.current, info2Ref.current], {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faculty2Ref.current,
            start: "top 80%",
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const FacultyCard = ({ data, index, imgRef, infoRef, cardRef }:any) => {
    const isFirst = index === 0;

    return (
      <div ref={cardRef} className="w-full max-w-7xl mx-auto mb-16 md:mb-24 lg:mb-32 px-4 sm:px-6 lg:px-8">
        <div className={`relative flex flex-col ${isFirst ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-between gap-8 md:gap-10 lg:gap-16 xl:gap-20`}>
          
          {/* Tech decoration lines - Hidden on mobile */}
          <div className={`hidden lg:block absolute ${isFirst ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-0`}>
            <div className={`flex flex-col gap-2 ${!isFirst && 'items-end'}`}>
              <div className={`h-px ${isFirst ? 'w-10' : 'w-10'} bg-gradient-to-${isFirst ? 'r' : 'l'} from-blue-500/60 to-transparent`}></div>
              <div className={`h-px ${isFirst ? 'w-16' : 'w-16'} bg-gradient-to-${isFirst ? 'r' : 'l'} from-blue-500/40 to-transparent`}></div>
              <div className={`h-px ${isFirst ? 'w-12' : 'w-12'} bg-gradient-to-${isFirst ? 'r' : 'l'} from-blue-500/20 to-transparent`}></div>
            </div>
          </div>

          {/* Image Container */}
          <div 
            ref={imgRef} 
            className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px] aspect-[3/4] flex-shrink-0 z-10"
            style={{perspective: '1200px'}}
          >
            {/* Holographic glow */}
            <div className={`absolute -inset-3 md:-inset-4 bg-gradient-to-br ${isFirst ? 'from-blue-500/20 via-blue-600/10' : 'from-blue-600/20 via-blue-500/10'} to-transparent rounded-2xl md:rounded-3xl blur-2xl opacity-60`}></div>
            
            {/* Corner brackets */}
            <div className={`absolute -top-3 -left-3 w-10 h-10 md:w-12 md:h-12 border-t-[3px] border-l-[3px] ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>
            <div className={`absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 border-t-[3px] border-r-[3px] ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>
            <div className={`absolute -bottom-3 -left-3 w-10 h-10 md:w-12 md:h-12 border-b-[3px] border-l-[3px] ${isFirst ? 'border-blue-600' : 'border-blue-500'}`}></div>
            <div className={`absolute -bottom-3 -right-3 w-10 h-10 md:w-12 md:h-12 border-b-[3px] border-r-[3px] ${isFirst ? 'border-blue-600' : 'border-blue-500'}`}></div>
            
            {/* Image frame */}
            <div className={`relative h-full overflow-hidden rounded-xl md:rounded-2xl border-2 ${isFirst ? 'border-blue-500/50' : 'border-blue-600/50'} shadow-[0_0_40px_rgba(59,130,246,0.25)]`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isFirst ? 'from-blue-500/5 to-blue-600/5' : 'from-blue-600/5 to-blue-500/5'}`}></div>
              <img 
                src={data.image} 
                alt={data.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Scan line effect */}
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-pulse pointer-events-none`}></div>
            </div>
          </div>

          {/* Info Card */}
          <div 
            ref={infoRef}
            className={`relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] bg-black/95 backdrop-blur-2xl rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 border-2 ${isFirst ? 'border-blue-500/40' : 'border-blue-600/40'} shadow-[0_0_40px_rgba(59,130,246,0.2)] z-20 flex-shrink-0`}
          >
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-5 h-5 md:w-6 md:h-6 border-t-2 border-l-2 ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>
            <div className={`absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 border-t-2 border-r-2 ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>
            <div className={`absolute bottom-0 left-0 w-5 h-5 md:w-6 md:h-6 border-b-2 border-l-2 ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>
            <div className={`absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 border-b-2 border-r-2 ${isFirst ? 'border-blue-500' : 'border-blue-600'}`}></div>

            <div className="relative">
              {/* Status indicators */}
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="flex gap-1.5">
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isFirst ? 'bg-blue-500' : 'bg-blue-600'} animate-pulse`}></div>
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isFirst ? 'bg-blue-600' : 'bg-blue-500'} animate-pulse`} style={{animationDelay: '0.2s'}}></div>
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isFirst ? 'bg-blue-500' : 'bg-blue-600'} animate-pulse`} style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className={`${isFirst ? 'text-blue-500' : 'text-blue-600'} text-[10px] md:text-xs tracking-widest font-mono uppercase`}>
                  {data.role}
                </span>
              </div>

              {/* Name and title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">
                {data.name}
              </h2>
              <p className={`${isFirst ? 'text-blue-500' : 'text-blue-600'} text-sm md:text-base mb-6 md:mb-7 font-light tracking-wide`}>
                {data.department}
              </p>
              
              {/* Contact info */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-7">
                <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-3.5 ${isFirst ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-600/5 border-blue-600/20'} rounded-lg border transition-all duration-300 hover:bg-opacity-10`}>
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg ${isFirst ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-600/10 border-blue-600/30'} flex items-center justify-center border flex-shrink-0`}>
                    <span className="text-xl">📧</span>
                  </div>
                  <span className="text-gray-300 text-xs md:text-sm font-mono break-all leading-relaxed">
                    {data.email}
                  </span>
                </div>
                
                <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-3.5 ${isFirst ? 'bg-blue-600/5 border-blue-600/20' : 'bg-blue-500/5 border-blue-500/20'} rounded-lg border transition-all duration-300 hover:bg-opacity-10`}>
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg ${isFirst ? 'bg-blue-600/10 border-blue-600/30' : 'bg-blue-500/10 border-blue-500/30'} flex items-center justify-center border flex-shrink-0`}>
                    <span className="text-xl">💡</span>
                  </div>
                  <span className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    {data.expertise}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className={`flex gap-3 pt-4 md:pt-5 border-t ${isFirst ? 'border-blue-500/20' : 'border-blue-600/20'}`}>
                <button onClick={() => window.location.href = `${data.social}`} className={`flex-1 py-2.5 md:py-3 ${isFirst ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/40 text-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/40 text-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'} border rounded-lg text-sm font-semibold tracking-wider transition-all duration-300`}>
                  CONNECT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        ref={grid1Ref}
        className="fixed inset-0 opacity-[0.08] md:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0'
        }}
      />
      
      <div 
        ref={grid2Ref}
        className="fixed inset-0 opacity-[0.05] md:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0'
        }}
      />

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/8 rounded-full blur-[100px] md:blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-[450px] md:w-[700px] h-[450px] md:h-[700px] bg-blue-600/8 rounded-full blur-[120px] md:blur-[160px] pointer-events-none animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-12 md:py-16 lg:py-20">
        {/* Header Section */}
        <div ref={headerRef} className="max-w-7xl mx-auto mb-16 md:mb-24 lg:mb-32 text-center px-4">
          <div className="relative inline-block mb-8 md:mb-10">
            {/* Vertical accent lines */}
            <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 w-px h-8 md:h-10 bg-gradient-to-b from-transparent to-blue-500"></div>
            <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 w-px h-8 md:h-10 bg-gradient-to-t from-transparent to-blue-500"></div>
            
            {/* Corner frames */}
            <div className="absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute -bottom-2 -left-2 w-7 h-7 md:w-8 md:h-8 border-b-2 border-l-2 border-blue-600"></div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 border-b-2 border-r-2 border-blue-600"></div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-wide relative px-2 md:px-4">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                Faculty Coordinators
              </span>
              {/* Glitch overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent opacity-20 blur-[2px]">
                Faculty Coordinators
              </span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-6">
            <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-blue-500"></div>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.2em] md:tracking-[0.3em] font-light uppercase">
              ACM MJCET Student Chapter
            </p>
            <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
          
          <p className="text-blue-500/60 text-[11px] sm:text-xs md:text-sm tracking-widest uppercase font-semibold">
            People who guide us and light the path
          </p>
        </div>

        {/* Faculty Cards */}
        <FacultyCard 
          data={facultyData[0]} 
          index={0} 
          imgRef={img1Ref} 
          infoRef={info1Ref} 
          cardRef={faculty1Ref}
        />
        
        <FacultyCard 
          data={facultyData[1]} 
          index={1} 
          imgRef={img2Ref} 
          infoRef={info2Ref} 
          cardRef={faculty2Ref}
        />
      </div>

      {/* Bottom accent bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </div>
  );
};

export default FacultyCoordinator;