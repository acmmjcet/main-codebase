'use client'
import { gsap } from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { upcomingEvents, pastEvents } from '../page';
import React, { useEffect, useState } from 'react';
import type { Event } from '../page';
import { useSearchParams } from 'next/navigation'

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
    <Navbar />
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-20">
      <div className="mx-auto px-6">
            {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          event ? (
        <div className='flex flex-col items-center justify-center gap-10 py-10'>
          {/* Event Image Card */}
          <div ref={eventCardRef} className="relative h-96 w-80 rounded-2xl shadow-lg bg-gray-950 overflow-hidden backdrop-blur-sm cursor-pointer">
            <a href={event.imageUrl}>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 object-cover h-full w-full"
              />
            </a>
            <div className='absolute bottom-0 flex flex-col bg-gradient-to-t from-black/100 via-black/90 to-black/10 w-full p-4'>
              <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
            </div>
          </div>

          {/* Event Details Documentation */}
          <div className="w-full max-w-7xl rounded-xl shadow-2xl bg-gray-900 overflow-hidden border border-gray-700">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 p-6 text-white border-b border-gray-700">
              <h1 className="text-3xl font-bold mb-2">EVENT REPORT</h1>
              <p className="text-gray-400 text-sm">ACM MJCET - Muffakham Jah College of Engineering and Technology</p>
            </div>

            {/* Event Details Section */}
            <div className="p-8 space-y-6">
              {/* Basic Details */}
              <div className="border-l-4 border-cyan-500 pl-4 bg-slate-800/50 p-4 rounded-r-lg">
                <h2 className="text-xl font-bold text-white mb-3">EVENT DETAILS</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-semibold text-cyan-400">Event Name:</span> {event.title}</p>
                  <p><span className="font-semibold text-cyan-400">Date:</span> {event.date}</p>
                  <p><span className="font-semibold text-cyan-400">Venue:</span> {event.location}</p>
                  <p><span className="font-semibold text-cyan-400">Description:</span> {event.description}</p>
                </div>
              </div>

              {/* Introduction */}
              {event.About.introduction && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Introduction
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.introduction}</p>
                </div>
              )}

              {/* Proceedings */}
              {event.About.proceeding && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Proceedings
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.About.proceeding}</p>
                </div>
              )}

              {/* Rounds (if applicable) */}
              {event.About.rounds && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Event Rounds
                  </h2>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-slate-800/30 p-4 rounded-lg border border-gray-700">
                    {event.About.rounds}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {event.About.highlights && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Highlights
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.highlights}</p>
                </div>
              )}

              {/* Closing */}
              {event.About.closing && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 uppercase border-b-2 border-gray-700 pb-2">
                    Closing and Recognition
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.closing}</p>
                </div>
              )}

              {/* Impact and Benefits */}
              {event.About.impactAndBenefits && (
                <div className="bg-slate-800/50 p-5 rounded-lg border-l-4 border-emerald-500">
                  <h2 className="text-xl font-bold text-white mb-3 uppercase">
                    Impact and Benefits
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{event.About.impactAndBenefits}</p>
                </div>
              )}

              {/* Conclusion */}
              {event.About.conclusion && (
                <div className="bg-slate-800/50 p-5 rounded-lg border-l-4 border-purple-500">
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
          <h1 className="text-4xl font-bold mb-8">Brain Storming Events</h1>
          <div className="relative h-96 w-80 rounded-2xl shadow-lg bg-gray-950 overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
    <Footer />

    </>
  );
};

export default EventPage;