"use client";
import React, { useState, useEffect } from 'react';
import { Download, Mail, Linkedin, Github, Phone, MapPin, ArrowRight, Star } from 'lucide-react';

interface CompanyLogo {
  name: string;
  logo?: string;
}

interface HeroProps {
  name?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  profileImage?: string;
  companyLogos?: CompanyLogo[];
  yearsExperience?: number;
  projectsCompleted?: number;
  clientsSatisfied?: number;
}

export const Universal_corporate_themed_Hero: React.FC<HeroProps> = ({
  name = "Alexandra Morgan",
  title = "Senior Operations & HR Strategist",
  subtitle = "Transforming organizational efficiency through data-driven solutions and people-first leadership",
  location = "San Francisco, CA",
  email = "alexandra.morgan@example.com",
  phone = "+1 (555) 123-4567",
  linkedin = "https://linkedin.com/in/alexandramorgan",
  github = "",
  resumeUrl = "#",
  profileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  companyLogos = [
    { name: "Microsoft" },
    { name: "Amazon" },
    { name: "Google" },
    { name: "Salesforce" },
    { name: "Adobe" }
  ],
  yearsExperience = 12,
  projectsCompleted = 150,
  clientsSatisfied = 98
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-light text-slate-800">{name.split(' ')[0]}</div>
          <div className="flex gap-6 items-center">
            <a href="#services" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Services</a>
            <a href="#experience" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Experience</a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Available for consulting</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-light text-slate-900 mb-4 leading-tight">
                {name}
              </h1>
              <h2 className="text-2xl font-normal text-slate-700 mb-6">
                {title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-200">
              <div>
                <div className="text-3xl font-light text-slate-900">{yearsExperience}+</div>
                <div className="text-sm text-slate-600 mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-light text-slate-900">{projectsCompleted}+</div>
                <div className="text-sm text-slate-600 mt-1">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-light text-slate-900">{clientsSatisfied}%</div>
                <div className="text-sm text-slate-600 mt-1">Client Satisfaction</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href={resumeUrl}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg border border-slate-300 hover:border-slate-400 transition-all hover:shadow-md"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {location}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {phone}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
              )}
              <a href={`mailto:${email}`}
                 className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl transform rotate-3"></div>
              <img 
                src={profileImage}
                alt={name}
                className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <div className="text-sm text-slate-600">Top-rated professional</div>
              </div>
            </div>

          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-24 border-t border-slate-200 pt-12">
          <p className="text-center text-sm text-slate-600 mb-8 uppercase tracking-wider">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
            {companyLogos.map((company, idx) => (
              <div 
                key={idx}
                className="text-2xl font-light text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
