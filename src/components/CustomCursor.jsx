import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const snapBoundsRef = useRef(null);

  useEffect(() => {
    const checkMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (checkMobile) return;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Magnetic snap check
      const interactiveEl = e.target.closest(
        'button, a, input, select, .glass-panel, [data-magnetic], .perspective-container > div, nav.glass-panel div'
      );

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        snapBoundsRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width + 12,
          height: rect.height + 12,
          radius: window.getComputedStyle(interactiveEl).borderRadius
        };
      } else {
        snapBoundsRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // High performance animation loop (120fps hardware-accelerated direct DOM manipulation)
    let frameId;
    const animate = () => {
      const targetX = snapBoundsRef.current ? snapBoundsRef.current.x : mouseRef.current.x;
      const targetY = snapBoundsRef.current ? snapBoundsRef.current.y : mouseRef.current.y;

      // Spring physics math
      const speed = snapBoundsRef.current ? 0.35 : 0.18;
      ringPosRef.current.x += (targetX - ringPosRef.current.x) * speed;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * speed;

      // Direct styles injection (bypasses React virtual DOM updates completely)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseRef.current.x - 3}px, ${mouseRef.current.y - 3}px, 0)`;
      }

      if (ringRef.current) {
        const r = ringRef.current;
        if (snapBoundsRef.current) {
          r.style.width = `${snapBoundsRef.current.width}px`;
          r.style.height = `${snapBoundsRef.current.height}px`;
          r.style.borderRadius = snapBoundsRef.current.radius;
          r.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
          r.style.boxShadow = '0 0 16px rgba(59, 130, 246, 0.25)';
          r.style.transform = `translate3d(${ringPosRef.current.x - snapBoundsRef.current.width / 2}px, ${ringPosRef.current.y - snapBoundsRef.current.height / 2}px, 0)`;
        } else {
          r.style.width = '26px';
          r.style.height = '26px';
          r.style.borderRadius = '50%';
          r.style.backgroundColor = 'transparent';
          r.style.boxShadow = 'none';
          r.style.transform = `translate3d(${ringPosRef.current.x - 13}px, ${ringPosRef.current.y - 13}px, 0)`;
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
  if (isMobile) return null;

  return (
    <>
      {/* 1. Core Pointer Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--color-blue)',
          borderRadius: '50%',
          transform: 'translate3d(-100px, -100px, 0)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform'
        }}
      />

      {/* 2. Magnetic Lagging Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          border: '1.5px solid var(--color-blue)',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'width 0.2s ease-out, height 0.2s ease-out, border-radius 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out',
          willChange: 'transform, width, height, border-radius'
        }}
      />
    </>
  );
}
