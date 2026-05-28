import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number;
}

interface Balloon {
  x: number; y: number; vy: number; sway: number; swaySpeed: number; swayT: number;
}

export default function FireworksOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let raf = 0, alive = true;
    const particles: Particle[] = [];
    const balloons: Balloon[] = [];
    let frameCount = 0;

    const COLORS = [
      "#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff6bde",
      "#a78bfa","#f472b6","#fbbf24","#34d399","#60a5fa",
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed initial balloons
    for (let i = 0; i < 8; i++) {
      balloons.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 300,
        vy: -(0.6 + Math.random() * 0.8),
        sway: 30 + Math.random() * 40,
        swaySpeed: 0.01 + Math.random() * 0.015,
        swayT: Math.random() * Math.PI * 2,
      });
    }

    function burst(cx: number, cy: number) {
      const count = 28 + Math.floor(Math.random() * 18);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const spd = 2.5 + Math.random() * 4;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1, maxLife: 1,
          color: i % 2 === 0 ? color : color2,
          size: 3 + Math.random() * 4,
        });
      }
    }

    function loop() {
      if (!alive) return;
      const ctx = canvas.getContext("2d")!;
      const cw = canvas.width, ch = canvas.height;

      // Fade trail
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, cw, ch);

      frameCount++;

      // Auto-burst periodically
      if (frameCount % 55 === 0) {
        burst(
          0.1 * cw + Math.random() * 0.8 * cw,
          0.1 * ch + Math.random() * 0.5 * ch,
        );
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.07;  // gravity
        p.vx *= 0.97;
        p.life -= 0.018;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life * p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color; ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Balloons
      ctx.font = "32px serif";
      ctx.textBaseline = "middle";
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.y += b.vy;
        b.swayT += b.swaySpeed;
        const drawX = b.x + Math.sin(b.swayT) * b.sway;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillText("🎈", drawX, b.y);
        ctx.restore();
        if (b.y < -60) {
          b.y = ch + 20;
          b.x = Math.random() * cw;
        }
      }

      // Spawn new balloons occasionally
      if (frameCount % 120 === 0 && balloons.length < 18) {
        balloons.push({
          x: Math.random() * cw,
          y: ch + 20,
          vy: -(0.6 + Math.random() * 0.8),
          sway: 30 + Math.random() * 40,
          swaySpeed: 0.01 + Math.random() * 0.015,
          swayT: Math.random() * Math.PI * 2,
        });
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
