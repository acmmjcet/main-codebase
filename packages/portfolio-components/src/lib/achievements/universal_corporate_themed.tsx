import React, { useState, useEffect, useRef } from 'react';
import { Award, TrendingUp, Users, Target, Briefcase, Star, CheckCircle, ArrowUpRight } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  metric?: string;
  impact?: string;
  year?: string;
  icon?: 'award' | 'trending' | 'users' | 'target' | 'briefcase' | 'star' | 'check';
  category?: string;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface AchievementsProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  achievements?: Achievement[];
  stats?: Stat[];
  showTimeline?: boolean;
  accentColor?: 'slate' | 'blue' | 'emerald' | 'violet' | 'amber';
}

export const universal_corporate_themed_Achievements: React.FC<AchievementsProps> = ({
  sectionTitle = "Notable Achievements",
  sectionSubtitle = "Proven track record of delivering measurable results and driving organizational excellence",
  achievements = [
    {
      title: "Reduced Employee Turnover by 45%",
      description: "Implemented comprehensive retention strategy including mentorship programs, career development pathways, and competitive compensation reviews.",
      metric: "45%",
      impact: "Saved $2.3M in recruitment costs",
      year: "2024",
      icon: "users",
      category: "HR Strategy"
    },
    {
      title: "Streamlined Operations Across 5 Departments",
      description: "Led cross-functional initiative to eliminate redundancies, automate workflows, and improve interdepartmental communication.",
      metric: "60%",
      impact: "Increased operational efficiency",
      year: "2023",
      icon: "trending",
      category: "Operations"
    },
    {
      title: "Launched Company-Wide Training Program",
      description: "Designed and executed comprehensive L&D initiative reaching 500+ employees with 95% completion rate.",
      metric: "500+",
      impact: "Employees upskilled",
      year: "2023",
      icon: "award",
      category: "Learning & Development"
    },
    {
      title: "Executed Annual Conference for 1,200 Attendees",
      description: "Managed end-to-end logistics, vendor coordination, and program development for flagship corporate event.",
      metric: "4.8/5",
      impact: "Attendee satisfaction score",
      year: "2024",
      icon: "star",
      category: "Event Management"
    },
    {
      title: "Implemented Digital Documentation System",
      description: "Digitized 10,000+ documents and created standardized templates, reducing document retrieval time by 80%.",
      metric: "80%",
      impact: "Faster document access",
      year: "2023",
      icon: "check",
      category: "Process Improvement"
    },
    {
      title: "Built High-Performance Team of 25",
      description: "Recruited, trained, and mentored diverse team that exceeded KPIs by average of 120% for three consecutive quarters.",
      metric: "120%",
      impact: "KPI performance",
      year: "2022-2024",
      icon: "target",
      category: "Team Building"
    }
  ],
  stats = [
    { value: "45", label: "Major Projects", suffix: "+" },
    { value: "2.3", label: "Cost Savings", prefix: "$", suffix: "M" },
    { value: "98", label: "Client Satisfaction", suffix: "%" },
    { value: "15", label: "Awards & Recognition", suffix: "+" }
  ],
  showTimeline = true,
  accentColor = 'slate'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const accentColors = {
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      border: 'border-slate-300',
      hover: 'hover:bg-slate-900',
      gradient: 'from-slate-500 to-slate-700'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-300',
      hover: 'hover:bg-blue-900',
      gradient: 'from-blue-500 to-blue-700'
    },
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      hover: 'hover:bg-emerald-900',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    violet: {
      bg: 'bg-violet-100',
      text: 'text-violet-900',
      border: 'border-violet-300',
      hover: 'hover:bg-violet-900',
      gradient: 'from-violet-500 to-violet-700'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-300',
      hover: 'hover:bg-amber-900',
      gradient: 'from-amber-500 to-amber-700'
    }
  };

  const colors = accentColors[accentColor];

  const iconMap = {
    award: Award,
    trending: TrendingUp,
    users: Users,
    target: Target,
    briefcase: Briefcase,
    star: Star,
    check: CheckCircle
  };

  useEffect(() => {
    if (typeof (globalThis as any).window === 'undefined') return;

    // Guard for environments where IntersectionObserver type/implementation is not available
    const IntersectionObserverCtor = (globalThis as any).IntersectionObserver;
    if (!IntersectionObserverCtor) return;

    const observer = new IntersectionObserverCtor(
      (entries: any) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          // Animate stats
          stats.forEach((_, index) => {
            setTimeout(() => {
              setAnimatedStats(prev => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [stats]);

  return (
    <div ref={sectionRef} className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
            <Award className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600 font-medium">Achievements & Impact</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`bg-white rounded-2xl p-8 border border-slate-200 transform transition-all duration-700 hover:shadow-xl hover:scale-105 ${
                animatedStats.includes(idx) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-center">
                <div className={`text-4xl lg:text-5xl font-light ${colors.text} mb-2`}>
                  {stat.prefix}{stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-slate-600 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
              <div className={`mt-4 h-1 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, idx) => {
            const Icon = iconMap[achievement.icon || 'award'];
            return (
              <div 
                key={idx}
                className={`group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Icon & Year */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  {showTimeline && achievement.year && (
                    <div className="text-sm text-slate-500 font-medium">{achievement.year}</div>
                  )}
                </div>

                {/* Category Badge */}
                {achievement.category && (
                  <div className={`inline-block px-3 py-1 ${colors.bg} rounded-full text-xs ${colors.text} font-medium mb-4`}>
                    {achievement.category}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-medium text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {achievement.description}
                </p>

                {/* Metrics */}
                {(achievement.metric || achievement.impact) && (
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    {achievement.metric && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Key Metric:</span>
                        <span className={`text-2xl font-light ${colors.text}`}>{achievement.metric}</span>
                      </div>
                    )}
                    {achievement.impact && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        <span>{achievement.impact}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hover Effect Line */}
                <div className={`mt-6 h-1 bg-gradient-to-r ${colors.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
              </div>
            );
          })}
        </div>

        {/* Timeline View (Optional) */}
        {showTimeline && (
          <div className="mt-20">
            <h3 className="text-2xl font-light text-slate-900 mb-12 text-center">Career Timeline</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200"></div>
              
              <div className="space-y-12">
                {achievements
                  .filter(a => a.year)
                  .sort((a, b) => (b.year || '').localeCompare(a.year || ''))
                  .map((achievement, idx) => {
                    const Icon = iconMap[achievement.icon || 'award'];
                    const isLeft = idx % 2 === 0;
                    return (
                      <div key={idx} className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block bg-white rounded-xl p-6 border border-slate-200 shadow-md transform transition-all duration-500 hover:shadow-xl ${
                            isVisible ? 'translate-x-0 opacity-100' : isLeft ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'
                          }`}
                          style={{ transitionDelay: `${idx * 150}ms` }}>
                            <div className={`text-sm font-medium ${colors.text} mb-2`}>{achievement.year}</div>
                            <h4 className="text-lg font-medium text-slate-900 mb-2">{achievement.title}</h4>
                            <p className="text-sm text-slate-600">{achievement.impact}</p>
                          </div>
                        </div>
                        
                        {/* Center Icon */}
                        <div className={`relative z-10 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        
                        <div className="flex-1"></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-white rounded-2xl p-12 border border-slate-200 shadow-lg">
            <div className="text-3xl font-light text-slate-900">Ready to drive similar results?</div>
            <p className="text-slate-600 max-w-2xl">
              Let's discuss how these proven strategies can be tailored to your organization's unique challenges and goals.
            </p>
            <button className={`mt-4 px-8 py-4 bg-slate-900 text-white rounded-lg ${colors.hover} hover:text-white transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2 group`}>
              <span>Schedule a Consultation</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
