import { useEffect, useState } from "react";
import cartaImg from "@assets/carta_1779999812883.png";

interface PhaseTriumphProps {
  onComplete?: () => void;
}

const CARTA_TEXT = `Parabéns, cabrita! 🎉

Você chegou até o fim da jornada. Enfrentou cada fase, cada desafio, cada pegadinha que coloquei no seu caminho.

Isso só prova o que eu já sabia: você é incrível, persistente e determinada.

Espero que você tenha curtido cada parte disso, do jeito que eu curti fazer pra você.

Com carinho 💜`;

export default function PhaseTriumph({ onComplete }: PhaseTriumphProps) {
  const [showLetter, setShowLetter] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShowLetter(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showLetter) return;
    if (idx >= CARTA_TEXT.length) return;
    const t = setTimeout(() => {
      setDisplayed(CARTA_TEXT.slice(0, idx + 1));
      setIdx((i) => i + 1);
    }, 30);
    return () => clearTimeout(t);
  }, [showLetter, idx]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-auto py-8"
      style={{ background: "linear-gradient(135deg, #0d0520 0%, #1a0a2e 50%, #0a1a10 100%)" }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#db2777" : "#fbbf24",
              opacity: 0.3 + (i % 5) * 0.1,
              animation: `float ${2 + (i % 3)}s ease-in-out ${(i * 0.3)}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          maxWidth: "640px",
          width: "92vw",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #a78bfa, #f472b6, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
              animation: "triumph-open 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            🏆 Jornada Completa!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
            Você completou todas as fases
          </p>
        </div>

        <img
          src={cartaImg}
          alt="carta"
          style={{
            width: "140px",
            height: "140px",
            objectFit: "contain",
            imageRendering: "pixelated",
            filter: "drop-shadow(0 0 20px rgba(251,191,36,0.6))",
            animation: "float 2s ease-in-out infinite",
          }}
        />

        {showLetter && (
          <div
            style={{
              background: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)",
              borderRadius: "16px",
              padding: "2rem 2.5rem",
              width: "100%",
              boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,160,80,0.4)",
              color: "#3a2a10",
              fontFamily: "'Georgia', serif",
              lineHeight: 1.9,
              fontSize: "1rem",
              animation: "letter-unfold-anim 0.5s ease-out forwards",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayed}
            {idx < CARTA_TEXT.length && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.1em",
                  background: "#7c3aed",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  animation: "blink 0.7s step-end infinite",
                }}
              />
            )}
          </div>
        )}

        {idx >= CARTA_TEXT.length && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "rgba(124,58,237,0.2)",
                color: "#a78bfa",
                border: "2px solid rgba(124,58,237,0.4)",
                borderRadius: "12px",
                padding: "0.8rem 1.8rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Jogar de novo 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
