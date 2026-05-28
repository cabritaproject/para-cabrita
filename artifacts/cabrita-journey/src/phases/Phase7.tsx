import { useState } from "react";

interface Phase7Props { onComplete: () => void; }

const IMAGES = [
  "https://i.pinimg.com/736x/be/01/1d/be011d665687e714f02f71c1c66ce01e.jpg",
  "https://i.pinimg.com/736x/41/e3/9b/41e39b97d1639f21428105d126317405.jpg",
  "https://i.pinimg.com/736x/e0/9e/a7/e09ea7d837d4a7ba75037ac7fbb517c5.jpg",
  "https://i.pinimg.com/736x/f3/57/ca/f357ca72c3cc781742cdc7c881d4057f.jpg",
];

export default function Phase7({ onComplete }: Phase7Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-auto py-8"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}>

      <h1 style={{
        fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 900, color: "#f0f0f0",
        textAlign: "center", marginBottom: "2rem", letterSpacing: "0.03em",
        textShadow: "0 0 20px rgba(124,58,237,0.5)",
      }}>
        Como você está hoje? <span style={{ color: "#a78bfa" }}>selecione abaixo</span>
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: "1rem", maxWidth: 720, width: "92vw", marginBottom: "2rem",
      }}>
        {IMAGES.map((src, i) => (
          <div key={i} onClick={() => setSelected(i)}
            style={{
              cursor: "pointer", borderRadius: 14, overflow: "hidden",
              border: selected === i ? "3px solid #a78bfa" : "3px solid transparent",
              boxShadow: selected === i
                ? "0 0 0 4px rgba(124,58,237,0.4), 0 8px 30px rgba(0,0,0,0.5)"
                : "0 4px 20px rgba(0,0,0,0.4)",
              transform: selected === i ? "scale(1.04)" : "scale(1)",
              transition: "all 0.2s ease",
              aspectRatio: "1",
            }}>
            <img src={src} alt={`opção ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {selected === i && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(124,58,237,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
              }}>✓</div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onComplete} disabled={selected === null}
        style={{
          background: selected !== null
            ? "linear-gradient(135deg,#7c3aed,#db2777)"
            : "rgba(255,255,255,0.1)",
          color: selected !== null ? "#fff" : "rgba(255,255,255,0.3)",
          border: "none", borderRadius: 12,
          padding: "0.9rem 3rem", fontSize: "1.1rem", fontWeight: 700,
          cursor: selected !== null ? "pointer" : "not-allowed",
          boxShadow: selected !== null ? "0 4px 20px rgba(124,58,237,0.5)" : "none",
          transition: "all 0.25s ease",
        }}>
        Avançar ➡️
      </button>
    </div>
  );
}
