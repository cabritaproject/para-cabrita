import { useState } from "react";

interface Phase8Props { onComplete: () => void; }

const IMAGES = [
  "https://i.pinimg.com/736x/d7/9b/f6/d79bf693273560a683d6c406dd884bd9.jpg",
  "https://i.pinimg.com/736x/51/3e/b4/513eb4ad6294f6e749c34296fc7cc003.jpg",
  "https://i.pinimg.com/736x/9a/0a/1e/9a0a1ea3bbf6a88ddce905fb7487b043.jpg",
  "https://i.pinimg.com/1200x/56/e1/2b/56e12b6014e55a93c06a2453b8b0c7f5.jpg",
  "https://i.pinimg.com/736x/1d/2a/f6/1d2af67976f2cf3fb6c4deee3d77b5dc.jpg",
];

export default function Phase8({ onComplete }: Phase8Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start overflow-auto py-8"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}>

      <div style={{ maxWidth: 760, width: "92vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
          <h1 style={{
            fontSize: "clamp(1.3rem,4vw,2rem)", fontWeight: 900, color: "#f0f0f0",
            letterSpacing: "0.03em", textShadow: "0 0 20px rgba(124,58,237,0.5)",
          }}>
            Como você tá com eu hoje?
          </h1>
          <img src="https://i.pinimg.com/736x/30/7a/c3/307ac3ce6d297a2c16c42485d63dc402.jpg"
            alt="referência"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(124,58,237,0.4)", flexShrink: 0 }} />
        </div>

        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: "1.8rem", lineHeight: 1.6 }}>
          seleciona abaixo e print pra eu usar no meu tcc. obrigado pela resposta, não precisa manda print agora, termina tudo depois você manda.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: "0.9rem", marginBottom: "2rem",
        }}>
          {IMAGES.map((src, i) => (
            <div key={i} onClick={() => setSelected(i)}
              style={{
                cursor: "pointer", borderRadius: 12, overflow: "hidden",
                border: selected === i ? "3px solid #a78bfa" : "3px solid transparent",
                boxShadow: selected === i
                  ? "0 0 0 4px rgba(124,58,237,0.4),0 8px 30px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0,0,0,0.4)",
                transform: selected === i ? "scale(1.04)" : "scale(1)",
                transition: "all 0.2s ease",
                aspectRatio: "1",
                position: "relative",
              }}>
              <img src={src} alt={`opção ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {selected === i && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(124,58,237,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", color: "#fff",
                }}>✓</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
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
            Continue ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
