import { useEffect, useRef, useState } from "react";

interface Phase11Props {
  onComplete: () => void;
}

export default function Phase11({ onComplete }: Phase11Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#c4b5fd";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasDrawn(true);
    }
    lastPos.current = pos;
  }

  function stopDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    drawing.current = false;
    lastPos.current = null;
  }

  function clearPad() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  function handleFinalizar() {
    if (!hasDrawn) return;
    setSigned(true);
    setTimeout(() => onComplete(), 700);
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-auto py-6"
      style={{ background: "radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0a 100%)" }}
    >
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 520, width: "90vw" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "0.4rem" }}>🎉</div>

        <h1 style={{
          fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 900,
          background: "linear-gradient(135deg,#a78bfa,#f472b6,#fbbf24)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "0.4rem", letterSpacing: "0.02em",
        }}>
          EBAAAA
        </h1>

        <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: "1.2rem", fontSize: "0.9rem" }}>
          assine abaixo para tirar print e mandar
        </p>

        {/* Signature pad */}
        <div style={{ position: "relative", marginBottom: "0.8rem" }}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: 160,
              display: "block",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(167,139,250,0.5)",
              borderRadius: 12,
              cursor: "crosshair",
              touchAction: "none",
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          {!hasDrawn && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
              color: "rgba(255,255,255,0.18)", fontSize: "0.9rem", fontStyle: "italic",
            }}>
              desenhe sua assinatura aqui
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <button onClick={clearPad} style={{
            background: "transparent", color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
            padding: "0.4rem 1rem", fontSize: "0.8rem", cursor: "pointer",
          }}>
            Limpar
          </button>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", alignSelf: "center" }}>
            mouse ou dedo
          </span>
        </div>

        <button
          onClick={handleFinalizar}
          disabled={!hasDrawn || signed}
          style={{
            background: hasDrawn && !signed
              ? "linear-gradient(135deg,#7c3aed,#db2777)"
              : "rgba(255,255,255,0.1)",
            color: hasDrawn && !signed ? "#fff" : "rgba(255,255,255,0.3)",
            border: "none", borderRadius: 12,
            padding: "0.9rem 3rem", fontSize: "1.1rem", fontWeight: 700,
            cursor: hasDrawn && !signed ? "pointer" : "not-allowed",
            boxShadow: hasDrawn && !signed ? "0 4px 20px rgba(124,58,237,0.5)" : "none",
            transition: "all 0.25s ease",
            width: "100%",
          }}
        >
          {signed ? "Assinado!" : "FINALIZAR"}
        </button>
      </div>
    </div>
  );
}
