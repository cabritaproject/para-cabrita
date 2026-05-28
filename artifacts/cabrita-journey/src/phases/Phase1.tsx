import { useEffect, useRef, useState, useCallback } from "react";

interface Phase1Props {
  onComplete: () => void;
}

export default function Phase1({ onComplete }: Phase1Props) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [shakeState, setShakeState] = useState<"none" | "slow" | "fast">("none");
  const btnRef = useRef<HTMLButtonElement>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimers = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setShakeState("none");
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    if (fastTimerRef.current) clearTimeout(fastTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setShakeState("slow"), 3000);
    fastTimerRef.current = setTimeout(() => setShakeState("fast"), 6000);
  }, []);

  useEffect(() => {
    resetTimers();
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (fastTimerRef.current) clearTimeout(fastTimerRef.current);
    };
  }, [resetTimers]);

  const flee = useCallback((clientX: number, clientY: number) => {
    resetTimers();
    if (!btnRef.current) return;
    const btn = btnRef.current;
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const margin = 20;
    const maxX = window.innerWidth - bw - margin;
    const maxY = window.innerHeight - bh - margin;

    const cx = (pos.x / 100) * window.innerWidth + bw / 2;
    const cy = (pos.y / 100) * window.innerHeight + bh / 2;
    const dx = cx - clientX;
    const dy = cy - clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 200) return;

    let newX = cx + (dx / dist) * 220 + (Math.random() - 0.5) * 120;
    let newY = cy + (dy / dist) * 220 + (Math.random() - 0.5) * 120;
    newX = Math.max(margin, Math.min(maxX, newX));
    newY = Math.max(margin, Math.min(maxY, newY));

    setPos({
      x: (newX / window.innerWidth) * 100,
      y: (newY / window.innerHeight) * 100,
    });
  }, [pos, resetTimers]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    flee(e.clientX, e.clientY);
  }, [flee]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      flee(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [flee]);

  const handleClick = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const shakeClass =
    shakeState === "fast" ? "shake-fast" : shakeState === "slow" ? "shake-slow" : "";

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ cursor: "crosshair" }}
    >
      <div
        className="absolute"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.18s cubic-bezier(0.34,1.56,0.64,1), top 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <button
          ref={btnRef}
          onClick={handleClick}
          className={`${shakeClass} relative px-8 py-4 text-lg font-bold text-white rounded-2xl select-none`}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            boxShadow: "0 0 30px rgba(124,58,237,0.7), 0 0 60px rgba(219,39,119,0.4)",
            border: "2px solid rgba(255,255,255,0.3)",
            letterSpacing: "0.05em",
          }}
        >
          <span
            className="blink-anim inline-block"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
          >
            ✨
          </span>{" "}
          Aperte aqui
        </button>
      </div>

      <p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/20 tracking-widest uppercase"
        style={{ pointerEvents: "none" }}
      >
        Se você conseguir...
      </p>
    </div>
  );
}
