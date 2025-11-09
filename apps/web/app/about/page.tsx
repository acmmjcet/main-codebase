'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React, { useRef, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
gsap.registerPlugin(ScrollTrigger)

// Define spacing constants (in pixels) for the timeline layout
const CHECKPOINT_SPACING = 300; // Vertical space between checkpoints
const HEADER_OFFSET = 180;      // Space for the title/padding at the top

// Component for a single checkpoint item
const CheckpointItem = ({ title, description, side, index }: { title: string, description: string, side: 'left' | 'right', index: number }) => {
    // Calculate the top position dynamically
    const topPosition = HEADER_OFFSET + index * CHECKPOINT_SPACING;

    return (
        <div 
            className={`timeline-item absolute w-1/2 will-change-transform ${side === 'left' ? 'left-0 pr-12 text-right' : 'right-0 pl-12 text-left'}`}
            style={{ top: `${topPosition}px` }} // Apply calculated vertical position
            data-index={index}
        >
            <div className={`timeline-circle absolute w-6 h-6 bg-gray-200 rounded-full border-4 border-gray-700 z-10 top-1/2 -mt-3 transform ${side === 'left' ? 'right-[-12px]' : 'left-[-12px]'}`}></div>
            <div className="timeline-box p-4 rounded-lg bg-gray-900/60 border border-gray-700 shadow-lg transition-transform duration-300 ease-out transform-gpu will-change-transform cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:bg-gray-800/70 motion-safe:transition-transform">
                <h2 className="text-xl font-bold mb-1 text-white">{title}</h2>
                <p className="text-sm text-gray-200">{description}</p>
            </div>
        </div>
    );
};

const HISTORY_DATA = [
  {
    title: "The Beginning",
    description: "The Association for Computing Machinery (ACM) was founded — setting the foundation for the global computing revolution."
  },
  {
    title: "The MJCET Chapter",
    description: "ACM@MJCET was established in 2014, bringing the world’s largest computing society to campus and igniting a culture of innovation."
  },
  {
    title: "ACM Garage",
    description: "Our annual cohort program — a creative hub where students collaborate, explore new technologies, and build impactful projects together."
  },
  {
    title: "Hello World Legacy",
    description: "The flagship event for first-year students — a fun, hands-on introduction to coding, teamwork, and the ACM community spirit."
  },
  {
    title: "The Present",
    description: "ACM@MJCET thrives as a leading student tech community, hosting hackathons, research projects, and innovation-driven events year-round."
  },
  {
    title: "The Future Ahead",
    description: "With a vision for global collaboration and cutting-edge research, ACM@MJCET continues to shape the next generation of innovators."
  }
];

const ACHIEVEMENTS = [
  { key: "Events", value: "50+" },
  { key: "Followers", value: "2,000+" },
  { key: "Years", value: "10+" }
];

const COLLABORATIONS = [
  { id: 1, name: "GitHub", icon: "https://cdn.simpleicons.org/github/ffffff" },
  { id: 2, name: "Google", icon: "https://cdn.simpleicons.org/google" },
  { id: 3, name: "Red Bull", icon: "https://cdn.simpleicons.org/redbull" },
  { id: 4, name: "Monster", icon: "https://cdn.simpleicons.org/monster" }
];

const infiniteItems = [...COLLABORATIONS, ...COLLABORATIONS, ...COLLABORATIONS, ...COLLABORATIONS]

export default function About() {
    const containerRef = useRef(null)
    const [historyHeight, setHistoryHeight] = useState(0)

    // ... (Refs)
    const heroRef = useRef<HTMLDivElement | null>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)
    const whoRef = useRef<HTMLDivElement | null>(null)
    const descRef = useRef<HTMLDivElement | null>(null)
    const weRef = useRef<HTMLDivElement | null>(null)

    // History refs
    const historyRef = useRef<HTMLDivElement | null>(null)
    const historyTitleRef = useRef<HTMLDivElement | null>(null)
    const historyContentRef = useRef<HTMLDivElement | null>(null) 
    const timelineLineRef = useRef<HTMLDivElement | null>(null)

    // Achievements & Collaborations refs
    const achievementsAndCollaborationsRef = useRef<HTMLDivElement | null>(null)
    const achievementsRef = useRef<HTMLDivElement | null>(null)
    const achievementsTitleRef = useRef<HTMLDivElement | null>(null)
    const collaborationsRef = useRef<HTMLDivElement | null>(null)
    
    // Calculate history content height
    useEffect(() => {
        let observer: ResizeObserver | null = null;

        const calculateHeight = () => {
            // The required scroll height is the position of the last checkpoint plus its height/padding.
            // Total timeline height needed: (Number of items * Spacing) + Header Offset
            const neededHeight = HEADER_OFFSET + (HISTORY_DATA.length * CHECKPOINT_SPACING) + 500; // Extra padding at the bottom
            setHistoryHeight(neededHeight);
        };

        // Try to set up observer if the element is available
        if (historyContentRef.current) {
            calculateHeight();
            observer = new ResizeObserver(calculateHeight);
            observer.observe(historyContentRef.current);
            window.addEventListener('load', calculateHeight);
        } else {
            // If ref isn't set yet, still attempt an initial calculation and ensure load listener is attached.
            calculateHeight();
            window.addEventListener('load', calculateHeight);
        }

        // Always return a cleanup function so all code paths return a value.
        return () => {
            if (observer) {
                observer.disconnect();
            }
            window.removeEventListener('load', calculateHeight);
        };
    }, [])

    useGSAP(() => {
        if (!historyHeight) return

        const viewportHeight = window.innerHeight

        // Utility function to handle the count-up animation
        const countUp = ({element, endValue, duration}: {element: HTMLElement, endValue: string, duration: number}) => {
            const initialValue = 0;
            // Remove non-numeric characters (like commas and '+') for calculation
            const numericEndValue = parseFloat(endValue.replace(/[^0-9.]/g, ''));
            
            // Create a temporary object to tween a "value" property
            const obj = { value: initialValue };

            gsap.to(obj, {
                value: numericEndValue,
                duration: duration,
                ease: "power2.out",
                onUpdate: () => {
                    // Update the element text on every frame of the tween
                    let text = Math.ceil(obj.value).toLocaleString();
                    
                    // Re-append the original suffix if present
                    if (endValue.includes('+')) {
                        text += '+';
                    }
                    if (endValue.includes('Years')) {
                        text += ' Years';
                    }
                    
                    element.innerHTML = text;
                }
            });
        };
        
        // Calculate the static vertical space (pt-24 pb-24 = 6rem top, 6rem bottom)
        const staticVerticalPadding = 96 * 2; 
        const visibleContentHeight = viewportHeight - staticVerticalPadding;
        
        // The distance the content needs to travel to show the last line at the bottom.
        // We use Math.max(0, ...) to ensure positive scroll only if content overflows.
        const effectiveScrollHeight = Math.max(historyHeight - visibleContentHeight, 0); 

        
        // Calculate scroll distances in pixels
        const heroScrollDuration = 2000
        const historySlideInDuration = 1500
        // Ensure a minimum scroll duration for the animation to be visible
        const historyInternalScrollDuration = effectiveScrollHeight > 0 ? effectiveScrollHeight + 1000 : 1500;
        const workSlideDuration = 1500
        const achievementsAndCollaborationsScrollDuration = 1500
        const totalScrollDistance = heroScrollDuration + historySlideInDuration + historyInternalScrollDuration + workSlideDuration + achievementsAndCollaborationsScrollDuration

        // Master timeline
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${totalScrollDistance}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
            }
        })

        // --- INITIAL STATE SETUP ---
        gsap.set(historyRef.current, { yPercent: 100 })
        gsap.set(historyContentRef.current, { opacity: 0, y: 0 }) 
        gsap.set(timelineLineRef.current, { scaleY: 0, transformOrigin: 'top center' }); 
        gsap.set(achievementsAndCollaborationsRef.current, { yPercent: 100 })
        
        // Set initial state for checkpoint items
        gsap.set(".timeline-box", { opacity: 0, y: 50 });
        gsap.set(".timeline-circle", { opacity: 0, scale: 0 });

        // ============ HERO SECTION ============

        masterTl.add('heroStart', 0)
        masterTl.addLabel('heroEnd', `+=${heroScrollDuration / totalScrollDistance}`) 
        masterTl
            .to(imgRef.current, { scale: 1.08, y: -4, filter: 'blur(8px)', ease: 'none' }, 'heroStart')
            .to(overlayRef.current, { backgroundColor: 'rgba(0,0,0,1)', opacity: 0.42, ease: 'none' }, 'heroStart')
            .to(weRef.current, { y: -20, opacity: 0, scale: 0.98, duration: 0.1, ease: 'power1.out' }, 'heroStart')
            // reveal main heading and description with a gentle stagger and nicer easing
            .fromTo(whoRef.current, { y: 48, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.45 }, 'heroStart')
            .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.45 }, 'heroStart')

        // Parallax 
            .to(heroRef.current, {y: viewportHeight, ease: 'power2.inOut', duration: historySlideInDuration / totalScrollDistance}, 'heroEnd')

        // ============ HISTORY SECTION - SLIDE IN & SCROLL ============
        
        // 1. Slide In the History Container
        masterTl.fromTo(historyRef.current,
            {yPercent: -100},{ yPercent: 0, ease: 'power2.inOut', duration: historySlideInDuration / totalScrollDistance, },
            'heroEnd' 
        )

        // 2. Fade In Content
        masterTl.to(historyContentRef.current,
            { opacity: 1, ease: 'power3.out', duration: 0.1, },
            '<0.1' // Slight overlap with slide-in completion
        )
        
        masterTl.addLabel('historySlideEnd', '>')

        masterTl.fromTo(historyTitleRef.current, { y: 30, opacity: 0 }, { y: 0, scale: 2, opacity: 1, ease: 'power3.out', duration: 0.1, }, 'historySlideEnd-=0.1')
        
        // 3. LINE ANIMATION - Draw the full line over the whole scroll duration
        .to(timelineLineRef.current, {
            scaleY: 1,
            ease: 'none', 
            duration: historyInternalScrollDuration / totalScrollDistance,
        }, 'historySlideEnd')

        // 4. CHECKPOINT ANIMATIONS - Staggered reveal
        // Get all checkpoint elements dynamically
        const checkpointItems = gsap.utils.toArray('.timeline-item');
        
        // Calculate the stagger amount relative to the internal scroll duration
        // We want the items to reveal sequentially throughout the scroll.
        const staggerDuration = historyInternalScrollDuration / totalScrollDistance;
        const staggerEach = staggerDuration / (checkpointItems.length + 1);

        // Reveal Boxes
        masterTl.fromTo(".timeline-box", {
            opacity: 0,
            x: (i) => i % 2 === 0 ? -100 : 100, // Even index (left side) gets -100, Odd index (right side) gets +100
            y: 0
        }, {
            opacity: 1, 
            x: 0,
            y: 0, 
            stagger: {
                each: staggerEach, // Stagger over the entire duration
                from: 'start', 
            },
            ease: 'power3.out',
            duration: 0.1, 
        }, 'historySlideEnd') // Start shortly after the line starts drawing

        // Reveal Circles (Checkpoints)
        masterTl.to(".timeline-circle", {
            opacity: 1,
            scale: 1,
            stagger: {
                each: staggerEach,
                from: 'start',
            },
            ease: 'back.out(1.7)',
            duration: 0.1,
        }, '<') // Start at the same time as the boxes

        // 5. DIRECT CONTENT SCROLL ON MASTER TIMELINE 
        if (effectiveScrollHeight > 0) {
            masterTl.to(historyContentRef.current, {
                y: -effectiveScrollHeight, 
                ease: 'none',
                duration: historyInternalScrollDuration / totalScrollDistance,
            }, 'historySlideEnd') // Starts exactly after the slide-in is complete
        } else {
            masterTl.to({}, { 
                duration: historyInternalScrollDuration / totalScrollDistance, 
                ease: 'none' 
            }, 'historySlideEnd') // Dummy tween to occupy time
        }
        
        masterTl.addLabel('historyScrollEnd', '>')
        

// ============ ACHIEVEMENTS & COLLABORATION SECTION - SLIDE IN & ANIMATE ============
        masterTl.add('achievementsStart', 'historyScrollEnd')

        const achievementCards = gsap.utils.toArray('.achievement-card');
        
        const achievementDurationNormalized = achievementsAndCollaborationsScrollDuration / totalScrollDistance;
        const staggerAchievementCards = achievementDurationNormalized / (achievementCards.length + 1); // Calculate stagger based on section duration

        masterTl
            // Slide in the Achievements section container
            .fromTo(achievementsAndCollaborationsRef.current, 
                {yPercent: 100}, // Corrected initial state to 100% since it's sliding *up* from below
                { yPercent: 0, ease: 'power2.inOut', duration: workSlideDuration / totalScrollDistance, }, 
                'achievementsStart'
            )
            // Parallax 
            .to(historyRef.current, {y: -viewportHeight, ease: 'power2.inOut', duration: workSlideDuration / totalScrollDistance}, '<') // 

            // Fade in Titles
            .fromTo(achievementsTitleRef.current, { y: 30, opacity: 0 }, { y: 0, scale: 2, opacity: 1, ease: 'power3.out', duration: 0.1, }, 'achievementsStart+=0.05')
            
            // Staggered reveal of achievement cards
            .fromTo(
            achievementCards,
            {
                y: () => Math.random() * 1000 - 750, // random Y offset
                x: () => Math.random() * 500 - 250,  // random X offset
                opacity: 0,
            },
            {
                y: 0,
                x: 0,
                opacity: 1,
                stagger: {
                each: staggerAchievementCards,
                from: 'start',
                },
                ease: 'power3.out',
                duration: achievementDurationNormalized,
            },
            'achievementsStart+=0.1'
            );

                    // Trigger countUp for all achievement numbers reliably when the achievements section begins
        masterTl.add(() => {
                const els = achievementsRef.current?.querySelectorAll('.achievement-number') ?? [];
                els.forEach((node) => {
                    const el = node as HTMLElement;
                    const text = el.textContent || '';
                    // prevent multiple count-ups
                    if (!el.dataset.counted) {
                    el.dataset.counted = 'true';
                    countUp({ element: el, endValue: text, duration: 1.5 });
                    }
                });

        }, 'achievementsStart+=0.15')

        masterTl.from( collaborationsRef.current, {
            opacity: 0,
            duration: 0.1,
        }, 'achievementsStart')

            
        return () => {
            masterTl.scrollTrigger?.kill()
            masterTl.kill()
            ScrollTrigger.getAll().forEach(st => st.kill())
        }
    }, [historyHeight])

    return (
        <>
        <Navbar/>
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            
            {/* HERO SECTION */}
            <section ref={heroRef} className="absolute inset-0 w-full h-screen overflow-hidden">
                <img ref={imgRef} src="/GB.jpeg" alt="Hero" className="blur-sm absolute inset-0 w-full h-full object-cover will-change-transform" />
                <div ref={overlayRef} className="absolute inset-0 bg-gray-950/30 will-change-background"></div>
                <div className="relative z-0 flex items-center justify-center h-full">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 ref={weRef} className="text-5xl md:text-7xl font-bold leading-tight text-white opacity-1">We Create the Future</h1>
                        <h1 ref={whoRef} className="text-5xl md:text-7xl font-bold leading-tight text-white opacity-0">Who we are</h1>
                        <p ref={descRef} className="mt-6 text-gray-200 max-w-3xl mx-auto text-lg md:text-xl opacity-0">ACM@MJCET is MJCET's student chapter of the Association for Computing Machinery — we promote interdisciplinary computing and professional development on campus.</p>
                    </div>
                </div>
            </section>

            {/* HISTORY SECTION - Pinned and animated */}
            <section 
                ref={historyRef} 
                className="absolute inset-0 w-full h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 z-10"
            >
                <div 
                    ref={historyContentRef} 
                    className="relative z-10 w-full text-gray-200 pt-24 pb-24 px-6 opacity-0 will-change-transform"
                >
                    <div className="max-w-4xl mx-auto space-y-16">
                        <h2 ref={historyTitleRef} className="text-4xl md:text-6xl font-bold text-center mb-20">Our History</h2>
                        
                        {/* Timeline Container - Relative for absolute children positioning */}
                        <div className="relative mx-auto w-full md:w-3/4" style={{ height: `${historyHeight - HEADER_OFFSET}px` }}>
                            
                            {/* Central Line */}
                            <div 
                                ref={timelineLineRef} 
                                className="absolute left-1/2 top-0 w-1 bg-gray-700 transform -translate-x-1/2" 
                                style={{ height: '100%' }} // Initial height to calculate scaleY
                            ></div>
                            
                            {/* Checkpoints */}
                            {HISTORY_DATA.map((item, index) => (
                                <CheckpointItem 
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                    index={index}
                                    side={index % 2 === 0 ? 'left' : 'right'} // Alternating sides
                                />
                            ))}
                        </div>
                    </div>
                    <div className="pt-24 text-center text-gray-400">--- End ---</div>
                </div>
            </section>

            {/* ACHIEVEMENTS & COLLABORATION SECTION */}
            <section 
                ref={achievementsAndCollaborationsRef} 
                className="absolute inset-0 w-full h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 z-20 flex flex-col items-center justify-center"
            >
                <div className="relative z-20 flex flex-col items-center justify-center text-gray-200 w-full h-full px-6 gap-12">
                    
                {/* ACHIEVEMENTS */}
                <div className="w-full max-w-6xl mx-auto px-4" ref={achievementsRef}>
                <h2 ref={achievementsTitleRef} className="text-4xl md:text-6xl font-bold text-center mb-12 opacity-0">Achievements</h2>

                {/* Use grid that adapts to screen sizes */}
                <div className="grid sm:grid-cols-3 md:grid-cols-3 gap-6 justify-items-center">
                    {ACHIEVEMENTS.map(({ key, value }, index) => (
                        <div
                            key={index}
                            className="achievement-card flex flex-col gap-4 items-center justify-center w-48 h-48  bg-gray-900/60 border border-gray-700 rounded-full shadow-xl opacity-0 transition-transform duration-300 ease-out transform-gpu will-change-transform cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:bg-gray-800/70 motion-safe:transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                        >
                            <h3 className="achievement-number text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-200">
                                {value}
                            </h3>
                            <p>{key}</p>
                        </div>
                    ))}
                </div>
                </div>

                <div ref={collaborationsRef} className="w-full max-w-6xl mx-auto px-4">
                <div className='w-full max-w-6xl overflow-hidden border-white/10 border-y-2 rounded-md py-2' >
                <div className="flex animate-scroll">
                    {infiniteItems.map((items, i) => (
                    <div 
                        key={i} 
                        className='flex-shrink-0 flex items-center gap-2 bg-gray-950 px-6 py-4 mx-2 rounded-md whitespace-nowrap'
                    >
                        <img src={items.icon} alt={items.name} className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg text-gray-400">{items.name}</span>
                    </div>
                    ))}
                </div>
                </div>
                    <span className="block mt-6 text-center text-gray-400 text-sm tracking-wide uppercase">Community Partners</span>                
                </div>
            </div>
            </section>

            {/* <section>
                <CallToAction />
            </section>
            <section>
                <Footer />
            </section> */}

        </div>
        <style jsx>{`
            @keyframes scroll { 
            from { transform: translateX(0); } 
            to { transform: translateX(-50%); } 
            } 
            .animate-scroll { display: flex; animation: scroll 10s linear infinite; width: max-content; }
            .animate-scroll:hover {animation-play-state: paused; cursor: pointer; will-change: transform;}
            
        `}</style>
        </>
    )
}