"use client";

import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  className?: string;
  color?: string;
  fontSize?: number;
  density?: number;
}

export function MatrixBackground({
  className = '',
  color = '#3dd6c6',
  fontSize = 22,
  density = 3,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let columns = Math.floor(width / fontSize);
    let dropsPerColumn = density;
    let drops: number[][] = new Array(columns)
      .fill(0)
      .map(() => Array.from({ length: dropsPerColumn }, () => Math.floor(Math.random() * height / fontSize)));

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        for (let j = 0; j < drops[i].length; j++) {
          const text = Math.random() < 0.5 ? '0' : '1';
          ctx.fillText(text, i * fontSize, drops[i][j] * fontSize);

          if (drops[i][j] * fontSize > height && Math.random() > 0.975) {
            drops[i][j] = 0;
          }
          drops[i][j]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns)
        .fill(0)
        .map(() => Array.from({ length: dropsPerColumn }, () => Math.floor(Math.random() * height / fontSize)));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, fontSize, density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
      }}
    />
  );
}

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlowText({ children, className = '', intensity = 'medium' }: GlowTextProps) {
  const shadowIntensity = {
    low: '0 0 8px rgba(61,214,198,0.35)',
    medium: '0 0 12px rgba(61,214,198,0.4)',
    high: '0 0 16px rgba(61,214,198,0.5)',
  };

  return (
    <span
      className={className}
      style={{
        textShadow: shadowIntensity[intensity],
        color: '#3dd6c6',
      }}
    >
      {children}
    </span>
  );
}

