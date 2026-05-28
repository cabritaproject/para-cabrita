import { useState } from "react";

interface Phase4Props {
  onComplete: () => void;
}

export default function Phase4({ onComplete }: Phase4Props) {
  const [closing, setClosing] = useState(false);

  const handleAaaa = () => {
    setClosing(true);
    setTimeout(() => onComplete(), 600);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)",
          borderRadius: "16px",
          padding: "2.5rem 3rem",
          maxWidth: "540px",
          width: "90vw",
          boxShadow: "0 20px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,160,80,0.4)",
          color: "#3a2a10",
          fontFamily: "'Georgia', serif",
          lineHeight: 1.8,
          fontSize: "1.05rem",
          opacity: closing ? 0 : 1,
          transform: closing ? "scale(0.9) translateY(30px)" : "scale(1) translateY(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          animation: "envelope-open 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <div style={{ marginBottom: "1rem", fontSize: "1.4rem", opacity: 0.6 }}>
          ⚠️ &nbsp;<em style={{ fontSize: "0.8rem" }}>Aviso importante</em>
        </div>

        <p style={{ marginBottom: "1.5rem" }}>
          Nessa fase você vai ter que jogar esse jogo aqui e tentar buscar a próxima carta, confio em você mas é um pouco difícil.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button
            onClick={handleAaaa}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "0.9rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
              fontFamily: "inherit",
              letterSpacing: "0.1em",
            }}
          >
            AAAA 😱
          </button>
        </div>
      </div>
    </div>
  );
}
