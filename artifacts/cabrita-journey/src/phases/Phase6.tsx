interface Phase6Props { onComplete: () => void; }

export default function Phase6({ onComplete }: Phase6Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}>
      <div style={{
        background: "linear-gradient(135deg,#fdf6e3 0%,#f5e6c8 100%)",
        borderRadius: 16, padding: "2.5rem 3rem",
        maxWidth: 560, width: "90vw",
        boxShadow: "0 20px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(200,160,80,0.4)",
        color: "#3a2a10", fontFamily: "'Georgia',serif", lineHeight: 1.85,
        animation: "envelope-open 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}>
        <div style={{ marginBottom: "1rem", fontSize: "1.4rem", opacity: 0.6 }}>
          🏆 &nbsp;<em style={{ fontSize: "0.8rem" }}>Carta do Portal</em>
        </div>
        <p style={{ marginBottom: "1.8rem", fontSize: "1.05rem" }}>
          Conseguiuu! Eu sinceramente não sei o nível de dificuldade que ficou esse jogo anterior, mas sei que deve ter terminado rapidinho. Eu demorei uns 5 minutos eu acho kkkkk. Queria te falar que você é incrível, blz? Quero que na próxima fase você apenas escolha algumas imagens.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onComplete} style={{
            background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
            border: "none", borderRadius: 12, padding: "0.9rem 2.5rem",
            fontSize: "1.1rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(124,58,237,0.5)", fontFamily: "inherit",
          }}>
            Próximo ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
