"use client";

import React from "react";

// Local utility to avoid touching shared libs
function cn(...classes: Array<string | undefined | false>) {
    return classes.filter(Boolean).join(" ");
}

// Self-contained Spotlight background (mouse-follow radial + subtle grid)
function SpotlightBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const targetPos = React.useRef({ x: 0, y: 0 });
  const [spotPos, setSpotPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove, { passive: true });
    // Smoothly follow the cursor
    let raf = 0;
    function animate() {
      setSpotPos((prev) => {
        const dx = targetPos.current.x - prev.x;
        const dy = targetPos.current.y - prev.y;
        const easedX = prev.x + dx * 0.08;
        const easedY = prev.y + dy * 0.08;
        return { x: easedX, y: easedY };
      });
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => {
      el?.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const spotlightStyle: React.CSSProperties = {
    background: `radial-gradient(720px circle at ${spotPos.x}px ${spotPos.y}px, rgba(168, 85, 247, 0.18), transparent 45%)`,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-screen w-full flex-col overflow-hidden bg-black antialiased",
        className
      )}
    >
      {/* Grid background */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 select-none opacity-100",
          "[background-size:44px_44px]",
          "[background-image:linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)]"
        )}
      />
      {/* Soft color wash */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(900px_600px_at_10%_-10%,rgba(99,102,241,0.18),transparent_60%)]",
          "before:absolute before:inset-0 before:bg-[radial-gradient(900px_600px_at_90%_-10%,rgba(236,72,153,0.16),transparent_60%)]",
          "before:content-['']"
        )}
      />
      {/* Mouse spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-150 ease-out"
        style={spotlightStyle}
      />
      {/* Content */}
      <div className="relative z-10 mx-auto w-full px-4 py-0">
        {children}
      </div>
    </div>
  );
}

export default SpotlightBackground;