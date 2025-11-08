'use client';

import React from 'react';
import AnimationComponent from '@/components/animations/animejs-heart';

export default function Page() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff',
      }}
    >
      <h1 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '600' }}>
        Anime.js Animation Demo
      </h1>

      <AnimationComponent />

      <p style={{ marginTop: '40px', opacity: 0.8, fontSize: '1rem' }}>
        Resize or rotate your screen to see orientation-based animation changes.
      </p>
    </main>
  );
}
