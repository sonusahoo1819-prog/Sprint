import React, { useEffect, useRef } from 'react';

export default function Celebration() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 3;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8 - 4; // upward bias
        this.gravity = 0.15;
        // Bright gradient palette matching our accents
        const colors = ['#6366F1', '#A855F7', '#10B981', '#06B6D4', '#F97316', '#EC4899', '#8B5CF6'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
      }

      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Draw little squares/rectangles (confetti style)
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const triggerExplosion = (e) => {
      const { x, y } = e.detail;
      // Add 40 particles per explosion
      for (let i = 0; i < 45; i++) {
        particlesRef.current.push(new Particle(x, y));
      }
    };

    window.addEventListener('sprint-celebrate', triggerExplosion);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('sprint-celebrate', triggerExplosion);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  );
}

// Helper to fire the event
export function fireCelebration(clientX, clientY) {
  const event = new CustomEvent('sprint-celebrate', {
    detail: { x: clientX, y: clientY }
  });
  window.dispatchEvent(event);
}
