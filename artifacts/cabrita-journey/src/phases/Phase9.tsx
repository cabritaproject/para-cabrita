import { useEffect, useRef, useState } from "react";
import cartaImg from "@assets/carta_1779999812883.png";

interface Phase9Props { onComplete: () => void; }

const EMOJIS = ["🍦", "🍕", "🎈", "⭐", "🍎", "🐸", "🌸"];
const TARGET_EMOJI = "🍦";
const TARGET_COUNT = 10;
const BASKET_W = 90, BASKET_H = 32;
const ITEM_SIZE = 38;

interface FallingItem {
  id: number; x: number; y: number; speed: number;
  emoji: string; isCarta: boolean;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(i); i.src = src; });
}

export default function Phase9({ onComplete }: Phase9Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    items: [] as FallingItem[],
    nextId: 0,
    mouseX: 300,
    iceCreamCount: 0,
    cartaDropped: false,
    cartaImg: null as HTMLImageElement | null,
    done: false,
    spawnTimer: 0,
    phase: "collect" as "collect" | "catchCarta",
  });
  const [count, setCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let raf = 0, alive = true;
    let cartaImgEl: HTMLImageElement | null = null;

    loadImg(cartaImg).then((img) => { cartaImgEl = img; stateRef.current.cartaImg = img; });

    function resize() {
      canvas.width = Math.min(window.innerWidth, 800);
      canvas.height = Math.min(window.innerHeight - 80, 500);
    }
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * canvas.width;
      e.preventDefault();
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    function spawnItem(cw: number) {
      const s = stateRef.current;
      if (s.cartaDropped && s.phase === "catchCarta") return;
      if (s.phase === "catchCarta") {
        s.items.push({ id: s.nextId++, x: cw / 2 - 30, y: -60, speed: 2.5, emoji: "", isCarta: true });
        s.cartaDropped = true;
        return;
      }
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      s.items.push({ id: s.nextId++, x: Math.random() * (cw - ITEM_SIZE), y: -ITEM_SIZE, speed: 2 + Math.random() * 2, emoji, isCarta: false });
    }

    function dropCarta(cw: number) {
      const s = stateRef.current;
      if (s.cartaDropped) return;
      s.cartaDropped = true;
      s.items.push({ id: s.nextId++, x: cw / 2 - 28, y: -80, speed: 2.2, emoji: "", isCarta: true });
    }

    function loop() {
      if (!alive) return;
      const s = stateRef.current;
      const ctx = canvas.getContext("2d")!;
      const cw = canvas.width, ch = canvas.height;

      if (!s.done) {
        s.spawnTimer++;
        if (s.spawnTimer >= 55 && s.phase === "collect") {
          s.spawnTimer = 0;
          spawnItem(cw);
        }

        // Move items
        for (const item of s.items) { item.y += item.speed; }

        // Basket position
        const basketX = Math.max(0, Math.min(cw - BASKET_W, s.mouseX - BASKET_W / 2));
        const basketY = ch - BASKET_H - 10;

        // Collision
        const caught: number[] = [];
        for (const item of s.items) {
          const ix = item.x, iy = item.y;
          if (iy + ITEM_SIZE >= basketY && iy <= basketY + BASKET_H &&
              ix + ITEM_SIZE >= basketX && ix <= basketX + BASKET_W) {
            caught.push(item.id);
            if (item.isCarta) {
              s.done = true;
              setTimeout(() => setShowPanel(true), 300);
            } else if (item.emoji === TARGET_EMOJI) {
              s.iceCreamCount++;
              setCount(s.iceCreamCount);
              if (s.iceCreamCount >= TARGET_COUNT) {
                s.phase = "catchCarta";
                dropCarta(cw);
                setFlash("🍦 10 sorvetes! Pegue a carta que está caindo!");
                setTimeout(() => setFlash(null), 3500);
              } else {
                setFlash(`🍦 +1 sorvete! (${s.iceCreamCount}/10)`);
                setTimeout(() => setFlash(null), 800);
              }
            } else {
              s.iceCreamCount = 0;
              setCount(0);
              setFlash("❌ Errou! Contador zerado!");
              setTimeout(() => setFlash(null), 1200);
            }
          }
        }
        s.items = s.items.filter((it) => !caught.includes(it.id) && it.y < ch + 60);

        // Render
        const bg = ctx.createLinearGradient(0, 0, 0, ch);
        bg.addColorStop(0, "#060d18"); bg.addColorStop(1, "#0e1a24");
        ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);

        // Stars
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = `rgba(255,255,255,${0.05 + (i % 5) * 0.02})`;
          ctx.fillRect((i * 137.5) % cw, (i * 73.1) % ch, 1.5, 1.5);
        }

        // Items
        ctx.font = `${ITEM_SIZE}px serif`;
        ctx.textBaseline = "top";
        for (const item of s.items) {
          if (item.isCarta && cartaImgEl) {
            ctx.save();
            ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 16;
            ctx.drawImage(cartaImgEl, item.x, item.y, 56, 56);
            ctx.restore();
          } else {
            ctx.fillText(item.emoji, item.x, item.y);
          }
        }

        // Basket
        const bx = basketX, by = basketY;
        ctx.save();
        ctx.shadowColor = "#7c3aed"; ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(124,58,237,0.25)";
        ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx + 8, by);
        ctx.lineTo(bx + BASKET_W - 8, by);
        ctx.lineTo(bx + BASKET_W, by + BASKET_H);
        ctx.lineTo(bx, by + BASKET_H);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "rgba(167,139,250,0.15)";
        ctx.fillRect(bx + 3, by + 3, BASKET_W - 6, BASKET_H - 6);

        // Counter HUD
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(8, 8, 180, 36);
        ctx.strokeStyle = "rgba(124,58,237,0.5)"; ctx.lineWidth = 1; ctx.strokeRect(8, 8, 180, 36);
        ctx.fillStyle = "#f0f0f0"; ctx.font = "bold 14px sans-serif"; ctx.textBaseline = "middle";
        ctx.fillText(`🍦 Sorvetes: ${s.iceCreamCount} / ${TARGET_COUNT}`, 16, 26);

        // Instruction
        if (s.phase === "collect") {
          ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(8, ch - 26, 280, 20);
          ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "10px monospace"; ctx.textBaseline = "middle";
          ctx.fillText("Pegue sorvetes 🍦 • Outros emojis = zera!", 12, ch - 16);
        } else {
          ctx.fillStyle = "rgba(251,191,36,0.9)"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("🎉 Pegue a carta caindo!", cw / 2, ch - 16);
          ctx.textAlign = "left";
        }
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "#040810" }}>
      <div style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "1rem" }}>🍦 Jogo da Cesta</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>mova o mouse para controlar a cesta</span>
      </div>

      <canvas ref={canvasRef}
        style={{ border: "2px solid rgba(124,58,237,0.4)", borderRadius: 8, boxShadow: "0 0 40px rgba(124,58,237,0.25)", maxWidth: "100vw" }} />

      {flash && (
        <div style={{
          position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.9)", border: "2px solid #a78bfa", borderRadius: 12,
          padding: "0.8rem 2rem", color: "#fff", fontWeight: 700, fontSize: "1rem",
          zIndex: 50, textAlign: "center", pointerEvents: "none",
          boxShadow: "0 0 20px rgba(124,58,237,0.4)",
        }}>
          {flash}
        </div>
      )}

      {showPanel && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          backdropFilter: "blur(6px)",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#fdf6e3,#f5e6c8)",
            borderRadius: 16, padding: "2.5rem 3rem", maxWidth: 520, width: "90vw",
            boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
            color: "#3a2a10", fontFamily: "'Georgia',serif", lineHeight: 1.8,
            animation: "triumph-open 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "1rem", opacity: 0.6 }}>📜</div>
            <p style={{ fontSize: "1.05rem", marginBottom: "1.8rem" }}>
              Ebaa conseguiu! Por último vou deixar um puzzle pra você fazer que demorei bastante pra fazer, bastante mesmo.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={onComplete} style={{
                background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
                border: "none", borderRadius: 12, padding: "0.9rem 2.5rem",
                fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>
                Vamos ao Puzzle! 🧩
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
