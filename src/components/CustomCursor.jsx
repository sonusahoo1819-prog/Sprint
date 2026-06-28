import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [snapBounds, setSnapBounds] = useState(null);
  
  const trailRef = useRef({ x: -100, y: -100 });
  const requestRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });

      // Check if we are hovering over an interactive element
      const interactiveEl = e.target.closest(
        'button, a, input, select, .glass-panel, [data-magnetic], .perspective-container > div, nav.glass-panel div'
      );

      if (interactiveEl) {
        setIsHovered(true);
        // Magnetic snap effect: snap outer circle to target element's center and bounds
        const rect = interactiveEl.getBoundingClientRect();
        setSnapBounds({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 12,
          height: rect.height + 12,
          radius: window.getComputedStyle(interactiveEl).borderRadius
        });
      } else {
        setIsHovered(false);
        setSnapBounds(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smooth trail spring physics animation loop
  useEffect(() => {
    const updateTrail = () => {
      const targetX = snapBounds ? snapBounds.x : position.x;
      const targetY = snapBounds ? snapBounds.y : position.y;

      // Interpolation logic for smooth trailing
      const speed = snapBounds ? 0.35 : 0.18; // Snap faster, wander slower
      trailRef.current.x += (targetX - trailRef.current.x) * speed;
      trailRef.current.y += (targetY - trailRef.current.y) * speed;

      setTrail({ x: trailRef.current.x, y: trailRef.current.y });
      requestRef.current = requestAnimationFrame(updateTrail);
    };

    requestRef.current = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position, snapBounds]);

  // Hide the custom cursor on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* 1. Core Pointer Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--color-blue)',
          borderRadius: '50%',
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          transition: 'transform 0.05s linear, background-color 0.3s ease'
        }}
      />

      {/* 2. Magnetic Lagging Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          border: '1.5px solid var(--color-blue)',
          borderRadius: snapBounds ? snapBounds.radius : '50%',
          width: snapBounds ? `${snapBounds.width}px` : '26px',
          height: snapBounds ? `${snapBounds.height}px` : '26px',
          transform: `translate3d(${trail.x - (snapBounds ? snapBounds.width / 2 : 13)}px, ${trail.y - (snapBounds ? snapBounds.height / 2 : 13)}px, 0)`,
          backgroundColor: snapBounds ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
          boxShadow: snapBounds ? '0 0 16px rgba(59, 130, 246, 0.25)' : 'none',
          transition: 'width 0.25s ease-out, height 0.25s ease-out, border-radius 0.25s ease-out, background-color 0.25s ease-out, box-shadow 0.25s ease-out',
          willChange: 'transform, width, height, border-radius'
        }}
      />
    </>
  );
}
