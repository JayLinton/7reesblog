import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;
      friction: number;
      gravity: number;

      constructor(x: number, y: number, color: string, velocity: { x: number; y: number }) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.95;
        this.gravity = 0.04;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.008;
      }
    }

    const createFirework = (x: number, y: number) => {
      const particleCount = 80 + Math.random() * 40;
      const hue = Math.random() * 360;
      const color = `hsla(${hue}, 80%, 60%, 1)`;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2) / particleCount * i;
        const power = 3 + Math.random() * 5;
        particles.push(
          new Particle(x, y, color, {
            x: Math.cos(angle) * power * Math.random(),
            y: Math.sin(angle) * power * Math.random(),
          })
        );
      }
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        createFirework(
          Math.random() * canvas.width,
          canvas.height * (0.2 + Math.random() * 0.4)
        );
      }

      particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
          particle.update();
          particle.draw();
        } else {
          particles.splice(index, 1);
        }
      });
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] pointer-events-none"
    />
  );
};