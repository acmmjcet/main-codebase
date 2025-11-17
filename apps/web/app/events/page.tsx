'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React, { useRef } from 'react'
import { useRouter } from "next/navigation";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SpotlightBackground from '@/components/animations/mesh-background'
gsap.registerPlugin(ScrollTrigger)

export interface Event {
    id: number;
    upcoming: boolean;
    title: string;
    date: string;
    location?: string;
    description?: string;
    imageUrl?: string;
    About: {
        introduction?: string;
        proceeding?: string;
        rounds?: string;
        highlights?: string;
        closing?: string;
        impactAndBenefits?: string;
        conclusion?: string;
}

  }

export const upcomingEvents: Event[] = [
  {
    id: 1,
    upcoming: true,
    title: "Huntopia",
    description: "The Ultimate Treasure Hunt",
    date: "November 17th",
    location: "Ghulam Ahmed Hall",
    imageUrl: "/assets/Events/Huntopia.png",
    About: {
      introduction:
        "Huntopia is a thrilling treasure hunt event organized by ACM MJCET, offering participants an adventurous experience through puzzles, clues, and campus-wide exploration.",
      rounds:
        "Round 1: Head Rush — guessing actions and clues.\nRound 2: Wrong It Up — wrong answers only challenge.\nRound 3: Decode and Discover — treasure hunt across campus.",
      proceeding:
        "Teams of two to four members competed through three fun and fast-paced rounds testing quick thinking, creativity, and teamwork.",
      highlights:
        "Exciting prizes, engaging gameplay, and high energy throughout the event created a competitive yet enjoyable environment.",
      closing:
        "Participants concluded the event with laughter, prizes, and memorable moments celebrating teamwork and intellect.",
      impactAndBenefits:
        "Enhanced collaboration, communication, and logical reasoning through interactive rounds and strategic clue-solving.",
      conclusion:
        "Huntopia continues to be a student-favorite challenge blending intellect, energy, and excitement into one grand experience.",
    },
  },
  {
    id: 2,
    upcoming: true,
    title: "Speaker's Session",
    description: "Career Guidance Session by Thomas Hill",
    date: "November 6, 2025",
    location: "Seminar Hall, Block 4",
    imageUrl: "/assets/Events/SpeakerSession25.png",
    About: {
      introduction:
        "A special guest session by Thomas Hill, Higher Education Professional from Rutgers University, USA, organized at MJCET for final-year students.",
      proceeding:
        "The talk covered global career opportunities, U.S. master's programs, and essential skillsets shaping the future workforce. Thomas Hill shared personal insights from Rutgers Business School.",
      highlights:
        "Focused on emerging global trends, postgraduate pathways in analytics and finance, and guidance for international education aspirants.",
      closing:
        "Students interacted directly with the speaker, gaining clarity on academic decisions and professional advancement.",
      impactAndBenefits:
        "Provided practical knowledge of career planning, study abroad preparation, and understanding international academic systems.",
      conclusion:
        "The Speaker's Session left students motivated and well-informed about global career opportunities and lifelong learning.",
    },
  },
];

export const pastEvents: Event[] = [
  {
    id: 1,
    upcoming: false,
    title: "HELLO WORLD 4.0",
    date: "September 23rd",
    location: "Seminar Hall, Block 4",
    description: "Flagship Tech Exploration Event",
    imageUrl: "/assets/Events/HelloWorld25.jpg",
    About: {
      introduction:
        "Hello World 4.0 was ACM MJCET's signature event designed to help students explore modern technologies, career paths, and real-world applications.",
      proceeding:
        "Sessions covered diverse domains including Web Development, AI/ML, Cybersecurity, Game Development, AR/VR, Blockchain, Cloud, and DevOps.",
      highlights:
        "Featured hands-on Gemini Workshop led by Google Student Ambassador, giving students real exposure to AI tools and chatbot creation.",
      closing:
        "Participants received certificates, Google swags, and GitHub cheat sheets. Organizers expressed gratitude for active participation.",
      impactAndBenefits:
        "Empowered students through multi-domain exposure, practical workshops, and career mentorship. Encouraged exploration beyond traditional tech boundaries.",
      conclusion:
        "Hello World 4.0 successfully inspired a new wave of learners to innovate, collaborate, and stand out in technology.",
    },
  },
  {
    id: 2,
    upcoming: false,
    title: "DESIGNVERSE",
    date: "June 24, 2025",
    location: "Seminar Hall",
    description: "Creative Design & Deploy Challenge",
    imageUrl: "/assets/Events/DesignVerse.png",
    About: {
      introduction:
        "DesignVerse was a creative competition by ACM MJCET focusing on innovation in design and deployment across multiple domains. It encouraged participants to blend aesthetics and functionality using modern tools.",
      proceeding:
        "The event featured categories like poster design, animation, and web design. Participants showcased their creative vision and technical execution under time constraints.",
      highlights:
        "Teams demonstrated strong visual storytelling and design thinking. Judges evaluated originality, usability, and creativity, celebrating outstanding innovation.",
      closing:
        "Certificates and appreciation were given to winners and participants, promoting design as a vital aspect of tech innovation.",
      impactAndBenefits:
        "Helped students enhance UI/UX understanding, teamwork, and real-world design presentation skills.",
      conclusion:
        "DesignVerse successfully fostered creativity and inspired young developers to merge art with technology.",
    },
  },
  {
    id: 3,
    upcoming: false,
    title: "AI UNLOCKED",
    date: "December 23rd",
    location: "Seminar Hall & Caci/AI Labs",
    description: "Hands-On AI Workshop",
    imageUrl: "/assets/Events/AI_Unlocked.png",
    About: {
      introduction:
        "AI Unlocked was a hands-on workshop and competition organized by ACM MJCET, focusing on simplifying Artificial Intelligence for students.",
      proceeding:
        "The event consisted of a morning workshop followed by a practical competition, guiding participants through AI tool usage and implementation.",
      highlights:
        "Students explored real-world AI tools, automation, and creative AI use cases to enhance productivity.",
      closing:
        "Top performers were rewarded and recognized for their innovative AI-driven solutions.",
      impactAndBenefits:
        "Provided practical exposure to AI concepts, problem-solving using automation, and collaboration through learning.",
      conclusion:
        "AI Unlocked successfully demystified AI and encouraged participants to apply it in everyday tasks and academic projects.",
    },
  },
  {
    id: 4,
    upcoming: false,
    title: "Trials of Triumph",
    date: "November 19, 2024",
    location: "IT Seminar Hall (Room No. 5606)",
    description: "The Ultimate Tech Challenge",
    imageUrl: "/assets/Events/TrialsOfTriump.png",
    About: {
      introduction:
        "Trials of Triumph was a thrilling multi-round competition organized by ACM MJCET designed to test wit, teamwork, and problem-solving under pressure.",
      rounds:
        "Round 1: Trivia Toss — fun quiz round.\nRound 2: Mystic Minds — identity guessing challenge.\nRound 3: Cypher Hunt — on-campus treasure chase.",
      proceeding:
        "Teams competed in sequential elimination rounds involving general tech trivia, logical puzzles, and clue-based hunts.",
      highlights:
        "Excitement, teamwork, and campus-wide engagement made the event lively and memorable. Winners received attractive cash prizes.",
      closing:
        "The event concluded with recognition of top-performing teams and celebration of collaborative spirit.",
      impactAndBenefits:
        "Enhanced participants' critical thinking, communication, and teamwork through gamified learning.",
      conclusion:
        "Trials of Triumph delivered an unforgettable mix of fun, competition, and intellect at MJCET.",
    },
  },
  {
    id: 5,
    upcoming: false,
    title: "HELLO WORLD",
    date: "October 5th, 2024",
    location: "MSS Lab",
    description: "Exploring Tech Career Paths",
    imageUrl: "/assets/Events/HelloWorld24.png",
    About: {
      introduction:
        "Hello World! was a flagship ACM MJCET event introducing students to diverse technology domains and industry experts.",
      proceeding:
        "Guest Speaker Mohammed Saif ul Hasan from ServiceNow discussed multiple domains such as Web Development, Game Development, Robotics, and AI.",
      highlights:
        "Interactive Q&A sessions, domain insights, and personal guidance from an experienced software engineer.",
      closing:
        "Participants gained career clarity and practical understanding of trending tech fields.",
      impactAndBenefits:
        "Motivated students to explore niche domains and guided them toward focused career paths.",
      conclusion:
        "The event bridged the gap between curiosity and action, empowering future technologists.",
    },
  },
  {
    id: 6,
    upcoming: false,
    title: "SOFIVERSE",
    date: "December 28, 2023",
    location: "Seminar Hall",
    description: "Inspiring Entrepreneurial Tech Session",
    imageUrl: "/assets/Events/SofiVerse.png",
    About: {
      introduction:
        "SoFiVerse was an inspiring knowledge-sharing event by ACM MJCET focused on innovation and entrepreneurship in the tech world.",
      proceeding:
        "Speakers shared their startup journeys, product-building experiences, and lessons from failures and successes in the evolving digital market.",
      highlights:
        "Students learned about idea validation, fundraising, and scaling through real entrepreneurial case studies.",
      impactAndBenefits:
        "Encouraged students to pursue entrepreneurship and apply problem-solving in real-world scenarios.",
      conclusion:
        "SoFiVerse empowered participants with motivation and direction to turn tech ideas into impactful ventures.",
    },
  },
];

const EventsLandingPage = () => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const upcomingEventsTitle = useRef<HTMLHeadingElement>(null);
    const pastEventsTitle = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

useGSAP(() => {
  const UpcomingEventGridItems = gsap.utils.toArray<HTMLDivElement>(".upcomingEventsGridItems");
  const pastEventsGridItems = gsap.utils.toArray<HTMLDivElement>(".pastEventsGridItems");
  const allEventCards = [...UpcomingEventGridItems, ...pastEventsGridItems];

  // ===== Scroll Animations =====
  // Master timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom 90%',
        scrub: true,
        }
        })

  // Image Animation
  masterTl.to(imageRef.current, {
    scale: 0.8,
    duration: 1,
    ease: "none",
  });

  // Upcoming Events Title Animation
  masterTl.fromTo(upcomingEventsTitle.current, {
    y: 100,
    ease: "none",
  }, {y: 0, opacity: 1, ease: "none"}, '0');

  // Events Cards Animation
  masterTl.fromTo(UpcomingEventGridItems, {
    y: 100,
    ease: "none"
  }, {y: 0, opacity: 1, ease: "none", stagger: 0.2}, '0.1');

  masterTl.addLabel('upcomingEventsEnd', '>');

  // Upcoming Events Title Animation
  masterTl.fromTo(pastEventsTitle.current, {
    y: 100,
    ease: "none",
  }, {y: 0, opacity: 1, ease: "none"}, 'upcomingEventsEnd');

    // Events Cards Animation
  masterTl.fromTo(pastEventsGridItems, {
    y: 100,
    opacity: 0,
    ease: "none",
  }, {y: 0, opacity: 1, ease: "none", stagger: 0.2}, 'upcomingEventsEnd');

  // ===== Hover Animations =====

  const handleMouseEnter = (item: HTMLDivElement) => {
    gsap.to(item, {
      scale: 1.1,
      y: -10,
      boxShadow: "0 0 60px rgba(96, 165, 250, 0.6)",
      duration: 0.05,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (item: HTMLDivElement) => {
    gsap.to(item, {
      scale: 1,
      y: 0,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      duration: 0.05,
      ease: "power2.inOut",
    });
  };

  allEventCards.forEach((item) => {
    const el = item as HTMLDivElement;
    el.addEventListener("mouseenter", () => handleMouseEnter(el));
    el.addEventListener("mouseleave", () => handleMouseLeave(el));
  });

  // ===== Cleanup on Unmount =====
  return () => {
    // Remove hover listeners
    allEventCards.forEach((item) => {
      const el = item as HTMLDivElement;
      el.removeEventListener("mouseenter", () => handleMouseEnter(el));
      el.removeEventListener("mouseleave", () => handleMouseLeave(el));
    });

    // Kill ScrollTriggers (prevents memory leaks)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}, []);

    
  return (
    <>
    <SpotlightBackground>
    <Navbar />
    
      <div ref={containerRef} className="min-h-screen w-full overflow-hidden bg-gradient-to-br text-white">
        <section className="h-[80vh] my-12 p-2 flex justify-center">
        <div ref={imageRef} className="relative w-full h-full overflow-hidden rounded-lg shadow-lg shadow-blue-400/20">
            <img id='coverImage' className='object-cover blur-sm w-full h-full' src="assets/Events/Team.png" alt="Cover Image" />
            <div className='absolute bottom-0 top-0 left-0 right-0 flex flex-col justify-center items-center text-center text-white bg-opacity-60'>
          <h1 className="mb-8 text-5xl font-black uppercase tracking-tight text-white text-8xl">
            <span
              className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 60px rgba(255, 255, 255, 0.1)",
              }}
            >
              Tech &
            </span>
            <br />
            <span className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent">Fun</span>
          </h1>
            </div>
          </div>
        </section>
    <section className="text-center flex flex-col items-center justify-center px-6 mb-16">
      <div>
        <h1 ref={upcomingEventsTitle} className="opacity-0 text-4xl font-bold mb-12 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent">Upcoming Events</h1>

        {/* ✅ Upcoming Event Cards Grid */}
        <div className="grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-3">

          {upcomingEvents.map((event) => (
              <div
                className="upcomingEventsGridItems opacity-0 relative h-96 w-80 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm cursor-pointer duration-300 border border-gray-700 bg-black/60 hover:border-blue-400 hover:shadow-blue-400/30"
                onClick={() => router.push(`/events/${event.id}?upcoming=${event.upcoming}`)}
                key={event.id}
              >
                <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 object-cover h-full w-full"
              />
              <div className='absolute bottom-0 flex flex-col w-full p-4' style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 50%, transparent 100%)'
              }}>
                <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
        {/* Past Events */}
            <section className="text-center flex flex-col items-center justify-center px-6 mb-16">
      <div>
        <h1 ref={pastEventsTitle} className="opacity-0 text-4xl font-bold mb-12 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent">Past Events</h1>

        {/* ✅ Event Cards Grid */}
        <div className="grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-3">

          {pastEvents.map((event) => (
            <div
                className="pastEventsGridItems opacity-0 relative h-96 w-80 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm cursor-pointer duration-300 border border-gray-700 bg-black/60 hover:border-blue-400 hover:shadow-blue-400/30"
                onClick={() => router.push(`/events/${event.id}?upcoming=${event.upcoming}`)}
                key={event.id}
              >
                <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 object-cover h-full w-full"
              />
              <div className='absolute bottom-0 h-[20%] flex flex-col w-full p-4' style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 50%, transparent 100%)'
              }}>
                <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


    </div>
    
    </SpotlightBackground>
    <Footer />

    </>
  );
};

export default EventsLandingPage;