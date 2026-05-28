import { useEffect, useRef, useState } from "react";

interface Phase3Props {
  onComplete: () => void;
}

export default function Phase3({ onComplete }: Phase3Props) {
  const [popup, setPopup] = useState<string | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [falling, setFalling] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => setShowArrow(true), 120_000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDecoy = () => {
    setPopup("Não é esse não 😏");
  };

  const handleTitle = () => {
    if (won) return;
    setWon(true);
    const elapsed = Date.now() - startRef.current;
    const usedHint = showArrow;
    if (!usedHint && elapsed < 120_000) {
      setPopup("Caralho você foi rápido demais, eu já sabia que ia conseguir de primeira! 🎉");
    } else {
      setPopup("De primeira, cabrita muito foda! 🏆");
    }
  };

  const closePopup = () => {
    if (won) {
      setPopup(null);
      setFalling(true);
      setTimeout(() => setShowBtn(true), 1200);
    } else {
      setPopup(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-start pt-8"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}
    >
      <h1
        className="text-4xl font-black mb-6 select-none"
        style={{ color: "#f0f0f0", letterSpacing: "0.05em", textShadow: "0 0 20px rgba(124,58,237,0.6)" }}
      >
        Ache o emoji{" "}
        <span
          onClick={handleTitle}
          style={{
            cursor: "pointer",
            display: "inline-block",
            transition: "transform 0.15s",
            filter: showArrow ? "drop-shadow(0 0 12px #fbbf24)" : "none",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.transform = "scale(1.3)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.transform = "scale(1)")}
          title="🤔"
        >
          🐥
        </span>
      </h1>

      {showArrow && (
        <div
          className="blink-anim mb-3 text-2xl font-black"
          style={{ color: "#fbbf24", filter: "drop-shadow(0 0 8px #fbbf24)" }}
        >
          ↑ clica aqui em cima!
        </div>
      )}

      <div
        className={`relative rounded-xl overflow-hidden ${falling ? "fall-away-anim" : ""}`}
        style={{
          width: "min(560px, 94vw)",
          height: "min(420px, 55vh)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
          border: "2px solid rgba(80,60,120,0.3)",
        }}
      >
        <img
          src="https://i.pinimg.com/1200x/b4/bc/9c/b4bc9ce527d4a95020e9c134ca195cc1.jpg"
          alt="fundo"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            objectPosition: "center",
            display: "block",
          }}
        />

        <span
          onClick={handleDecoy}
          style={{
            position: "absolute",
            top: "61%",
            left: "41%",
            transform: "translate(-50%,-50%)",
            fontSize: "0.65rem",
            cursor: "pointer",
            userSelect: "none",
            lineHeight: 1,
            zIndex: 5,
            opacity: 0.9,
          }}
        >
          🐥
        </span>
      </div>

      {showBtn && (
        <div style={{ marginTop: "2.5rem" }}>
          <button
            onClick={onComplete}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "1rem 3rem",
              fontSize: "1.2rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 30px rgba(124,58,237,0.5)",
              animation: "triumph-open 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            Continue 🚀
          </button>
        </div>
      )}

      {popup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={closePopup}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e1040, #2d1060)",
              border: "2px solid rgba(124,58,237,0.6)",
              borderRadius: "20px",
              padding: "2.5rem 3rem",
              maxWidth: "420px",
              textAlign: "center",
              boxShadow: "0 20px 80px rgba(124,58,237,0.4)",
              animation: "triumph-open 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#f0f0f0", marginBottom: "1.5rem" }}>
              {popup}
            </p>
            <button
              onClick={closePopup}
              style={{
                background: "rgba(124,58,237,0.3)",
                color: "white",
                border: "1px solid rgba(124,58,237,0.5)",
                borderRadius: "10px",
                padding: "0.6rem 2rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              OK!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
