"use client";
import React, { useEffect } from 'react';
import { animate } from 'animejs';

const AnimationComponent: React.FC = () => {
  useEffect(() => {
    // Function to create scope and trigger animation
    const createScope = ({ mediaQueries }: { mediaQueries: { portrait: string } }) => {
      const query = window.matchMedia(mediaQueries.portrait);
      const matches = { portrait: query.matches };

      query.addEventListener('change', () => {
        matches.portrait = query.matches;
        runAnimation(matches);
      });

      runAnimation(matches);
    };

    const runAnimation = ({ portrait }: { portrait: boolean }) => {
      // anime.js v4 syntax: animate(targets, parameters)
      animate('.circle', {
        translateY: portrait ? 0 : [-50, 50, -50],
        translateX: portrait ? [-50, 50, -50] : 0,
        easing: 'easeInOutSine',
        duration: 1000,
        delay: (el, index) => index * 100, // stagger effect
      });
    };

    createScope({
      mediaQueries: {
        portrait: '(orientation: portrait)',
      }
    });

    // Cleanup on unmount
    return () => {
      // No explicit cleanup API in anime.js v4, but this prevents stale animations
      document.querySelectorAll('.circle').forEach((el) => {
        el.getAnimations().forEach((anim) => anim.cancel());
      });
    };
  }, []);

  return (
    <div className="animation-wrapper" style={wrapperStyle}>
      <div className="circle" style={circleStyle}></div>
      <div className="circle" style={circleStyle}></div>
      <div className="circle" style={circleStyle}></div>
    </div>
  );
};

// Optional inline styles
const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  height: '100vh',
};

const circleStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'skyblue',
};

export default AnimationComponent;
