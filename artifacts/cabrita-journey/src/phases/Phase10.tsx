import { useCallback, useState } from "react";

interface Phase10Props {
  onComplete: () => void;
  onRestart: () => void;
}

const IMG_URL = "https://i.pinimg.com/1200x/88/28/8d/88288d186a3980c653d7ee8e7a250242.jpg";
const N = 3;
const TILE_SIZE = 140;
const PUZZLE_SIZE = N * TILE_SIZE;

function buildSolved(): number[] {
  return Array.from({ length: N * N }, (_, i) => i);
}

function shuffle(tiles: number[]): number[] {
  const t = [...tiles];
  let blank = t.indexOf(0);
  for (let i = 0; i < 300; i++) {
    const row = Math.floor(blank / N), col = blank % N;
    const neighbors: number[] = [];
    if (row > 0) neighbors.push(blank - N);
    if (row < N - 1) neighbors.push(blank + N);
    if (col > 0) neighbors.push(blank - 1);
    if (col < N - 1) neighbors.push(blank + 1);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    [t[blank], t[pick]] = [t[pick], t[blank]];
    blank = pick;
  }
  if (t.every((v, i) => v === i)) { [t[0], t[1]] = [t[1], t[0]]; }
  return t;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((v, i) => v === i);
}

export default function Phase10({ onComplete, onRestart }: Phase10Props) {
  const [tiles, setTiles] = useState<number[]>(() => shuffle(buildSolved()));
  const [won, setWon] = useState(false);
  const [answer, setAnswer] = useState<null | "no">(null);

  const handleTile = useCallback((idx: number) => {
    if (won) return;
    setTiles((prev) => {
      const t = [...prev];
      const blank = t.indexOf(0);
      const bRow = Math.floor(blank / N), bCol = blank % N;
      const tRow = Math.floor(idx / N), tCol = idx % N;
      const adjacent = (bRow === tRow && Math.abs(bCol - tCol) === 1) ||
                       (bCol === tCol && Math.abs(bRow - tRow) === 1);
      if (!adjacent) return prev;
      [t[blank], t[idx]] = [t[idx], t[blank]];
      if (isSolved(t)) setTimeout(() => setWon(true), 120);
      return t;
    });
  }, [won]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-auto py-6"
      style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#1a0a2e 100%)" }}>

      {!won && (
        <>
          <h1 style={{
            fontSize: "clamp(1.1rem,3vw,1.6rem)", fontWeight: 900, color: "#f0f0f0",
            textAlign: "center", marginBottom: "1.2rem",
            textShadow: "0 0 16px rgba(124,58,237,0.5)",
          }}>
            🧩 Monte a imagem deslizando as peças
          </h1>

          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${N}, ${TILE_SIZE}px)`,
            gridTemplateRows: `repeat(${N}, ${TILE_SIZE}px)`,
            gap: 3,
            border: "3px solid rgba(124,58,237,0.5)",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(124,58,237,0.3)",
          }}>
            {tiles.map((tileVal, idx) => {
              const tileRow = Math.floor(tileVal / N);
              const tileCol = tileVal % N;
              const isEmpty = tileVal === 0;
              return (
                <div key={idx} onClick={() => handleTile(idx)}
                  style={{
                    width: TILE_SIZE, height: TILE_SIZE,
                    cursor: isEmpty ? "default" : "pointer",
                    background: isEmpty
                      ? "rgba(20,10,40,0.95)"
                      : `url(${IMG_URL}) no-repeat`,
                    backgroundSize: isEmpty ? undefined : `${PUZZLE_SIZE}px ${PUZZLE_SIZE}px`,
                    backgroundPosition: isEmpty ? undefined : `-${tileCol * TILE_SIZE}px -${tileRow * TILE_SIZE}px`,
                    border: isEmpty ? "2px dashed rgba(124,58,237,0.2)" : "1px solid rgba(0,0,0,0.3)",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => { if (!isEmpty) (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.15)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = "none"; }}
                />
              );
            })}
          </div>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", marginTop: "1rem" }}>
            clique nas peças adjacentes ao espaço vazio para mover
          </p>
        </>
      )}

      {won && answer === null && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 20,
        }}>
          {/* Completed puzzle */}
          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${N}, ${TILE_SIZE}px)`,
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 0 60px rgba(251,191,36,0.5)",
              border: "3px solid rgba(251,191,36,0.6)",
            }}>
              {buildSolved().map((tileVal, idx) => {
                const tileRow = Math.floor(tileVal / N), tileCol = tileVal % N;
                return (
                  <div key={idx} style={{
                    width: TILE_SIZE, height: TILE_SIZE,
                    background: `url(${IMG_URL}) no-repeat`,
                    backgroundSize: `${PUZZLE_SIZE}px ${PUZZLE_SIZE}px`,
                    backgroundPosition: `-${tileCol * TILE_SIZE}px -${tileRow * TILE_SIZE}px`,
                  }} />
                );
              })}
            </div>

            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.62)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              borderRadius: 10,
              animation: "triumph-open 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}>
              <p style={{
                fontSize: "clamp(1rem,3.2vw,1.55rem)", fontWeight: 900,
                color: "#fbbf24", textAlign: "center",
                textShadow: "0 0 20px rgba(251,191,36,0.8)",
                lineHeight: 1.35, padding: "0 1rem",
              }}>
                Você quer sair comigo<br />no fim de semana que vem?
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button onClick={onComplete} style={{
              background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff",
              border: "none", borderRadius: 14, padding: "1rem 3rem",
              fontSize: "1.3rem", fontWeight: 900, cursor: "pointer",
              boxShadow: "0 0 30px rgba(124,58,237,0.6)",
              animation: "shake-slow 1.2s ease-in-out infinite",
            }}>
              SIM
            </button>

            <button onClick={() => setAnswer("no")} style={{
              background: "rgba(60,60,60,0.6)", color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10,
              padding: "0.8rem 1.8rem", fontSize: "1rem", fontWeight: 600,
              cursor: "pointer",
            }}>
              Não, não posso
            </button>
          </div>
        </div>
      )}

      {won && answer === "no" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)", zIndex: 20,
          gap: "2rem",
        }}>
          <p style={{
            fontSize: "clamp(1.6rem,5vw,2.4rem)", fontWeight: 900,
            color: "#f0f0f0", textAlign: "center",
          }}>
            Tudo bem!
          </p>
          <button onClick={onRestart} style={{
            background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: 12,
            padding: "0.8rem 2.4rem", fontSize: "1rem", fontWeight: 600,
            cursor: "pointer",
          }}>
            Voltar ao início
          </button>
        </div>
      )}
    </div>
  );
}
