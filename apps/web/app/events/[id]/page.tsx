'use client'
import { gsap } from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { upcomingEvents, pastEvents } from '../page';
import React, { useEffect, useState } from 'react';
import type { Event } from '../page';
import { useSearchParams } from 'next/navigation'
import SpotlightBackground from '@/components/animations/mesh-background'

const EventPage = ({params}: {params: Promise<{id: string}>}) => {

  const searchParams = useSearchParams()
  const [event, setEvent] = React.useState<Event | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } =  React.use(params);
  const eventCardRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = eventCardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.1,
        y: -10,
        boxShadow: "0px 0px 50px rgba(110, 120, 140, 1)",
        duration: 0.05, // smoother transition
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
        duration: 0.05,
        ease: "power2.inOut",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup on unmount to prevent duplicate listeners
    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [event]);

  useEffect(() => {
      const eventId = Number(id);
      const upcoming = searchParams.get('upcoming');
      if (upcoming === 'true') {
        const event = upcomingEvents.find((e) => e.id === eventId );
        setEvent(event);
      } else {
        const event = pastEvents.find((e) => e.id === eventId);
        setEvent(event);
      }
      setLoading(false);
  }, [id, searchParams]);


  return (
    <>
    <SpotlightBackground>
    <Navbar />
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-gray-200 py-12 md:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          event ? (
        <div className='flex flex-col items-center justify-center py-6 md:py-10 md:my-12'>
          {/* Event Image Card - This has been moved inside the report below */}

          {/* Event Details Documentation */}
          <div className="w-full max-w-7xl rounded-xl shadow-2xl bg-gray-900/80 overflow-hidden border border-gray-700">
            {/* Header Section */}
            <div className="p-4 md:p-6 text-white border-b border-gray-700 bg-black/70">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">EVENT REPORT</h1>
              <p className="text-gray-300 text-sm">ACM MJCET - Muffakham Jah College of Engineering and Technology</p>
            </div>

            {/* Event Details Section */}
            <div className="p-6 md:p-8 space-y-6">

              {/* --- NEW RESPONSIVE CONTAINER --- */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                {/* --- MOVED: Event Image Card (Left Side on LG) --- */}
                <div ref={eventCardRef} className="relative h-96 w-full md:w-80 rounded-2xl shadow-lg bg-black overflow-hidden backdrop-blur-sm cursor-pointer duration-300 flex-shrink-0 mx-auto md:mx-0">
                  <a href={event.imageUrl}>
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="absolute inset-0 object-cover h-full w-full"
                    />
                  </a>
                  <div className='absolute bottom-0 flex flex-col bg-gradient-to-t from-black/100 via-black/90 to-black/10 w-full p-3 md:p-4'>
                    <h2 className="text-xl md:text-3xl font-bold mb-2">{event.title}</h2>
                  </div>
                </div>

                {/* --- MOVED: Basic Details (Right Side on LG) --- */}
                <div className="w-full lg:flex-1 bg-black/50 p-4 rounded-lg md:rounded-r-lg border-l-4 border-blue-500 md:pl-4">
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3">EVENT DETAILS</h2>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="font-semibold text-blue-400">Event Name:</span> {event.title}</p>
                    <p><span className="font-semibold text-blue-400">Date:</span> {event.date}</p>
                    <p><span className="font-semibold text-blue-400">Venue:</span> {event.location}</p>
                    <p><span className="font-semibold text-blue-400">Description:</span> {event.description}</p>
                  </div>
                </div>
              </div>
              {/* --- END NEW RESPONSIVE CONTAINER --- */}


              {/* Introduction */}
              {event.About.introduction && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Introduction
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.introduction}</p>

                </div>
              )}

              {/* Proceedings */}
              {event.About.proceeding && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Proceedings
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.About.proceeding}</p>
                </div>
              )}

              {/* Rounds (if applicable) */}
              {event.About.rounds && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Event Rounds
                  </h2>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-lg border border-gray-700">
                    {event.About.rounds}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {event.About.highlights && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Highlights
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.highlights}</p>
                </div>
              )}

              {/* Closing */}
              {event.About.closing && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Closing and Recognition
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.closing}</p>
                </div>
              )}

              {/* Impact and Benefits */}
              {event.About.impactAndBenefits && (
                <div className="bg-black/50 p-5 rounded-lg border-l-4 border-blue-400">
                  <h2 className="text-xl font-bold text-white mb-3 uppercase">
                    Impact and Benefits
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.impactAndBenefits}</p>
                </div>
              )}

              {/* Conclusion */}
              {event.About.conclusion && (
                <div className="bg-black/50 p-5 rounded-lg border-l-4 border-blue-400">
                  <h2 className="text-xl font-bold text-white mb-3 uppercase">
                    Conclusion
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.conclusion}</p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-6 mt-6 border-t-2 border-gray-700 text-center">
                <p className="text-sm text-gray-400 italic">
                  Organized by ACM MJCET Student Chapter
                </p>
              </div>
            </div>
          </div>
        </div>
        
      ) : (

      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Brain Storming Events</h1>
        <div className="relative h-64 md:h-96 w-full md:w-80 rounded-2xl shadow-lg bg-gray-950 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <img src="/assets/Events/logo.png" alt="logo" className="absolute inset-0 object-cover h-full w-full"/>
          <div className='absolute bottom-0 flex flex-col bg-gradient-to-t from-black/80 to-transparent w-full p-4'>
            <h2 className="text-xl font-semibold mb-2">On it...</h2>
          </div>
        </div>
      </div>
      )
      )
      }
      </div>
    </div>
    </SpotlightBackground>
    <Footer />
    </>
  );
};

export default EventPage;