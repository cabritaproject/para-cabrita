import { useEffect, useRef, useState } from "react";

interface Phase2Props {
  onComplete: () => void;
}

const TEXT =
  "Olá cabrita, aqui tá o site que falei ontem que estava fazendo. É uma série de jogos bestas e cartas pra você ler, talvez você se canse e ache um tédio, mas vou fazer de tudo pra você gostar de cada parte.";

export default function Phase2({ onComplete }: Phase2Props) {
  const [stage, setStage] = useState<"envelope" | "letter" | "expanding">("envelope");
  const [displayed, setDisplayed] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    if (stage === "envelope") {
      const t = setTimeout(() => setStage("letter"), 900);
      return () => clearTimeout(t);
    }
    if (stage === "letter") {
      idxRef.current = 0;
      setDisplayed("");
      setShowImage(false);
      setShowBtn(false);
      intervalRef.current = setInterval(() => {
        idxRef.current += 1;
        setDisplayed(TEXT.slice(0, idxRef.current));
        if (idxRef.current >= TEXT.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setShowImage(true), 200);
          setTimeout(() => setShowBtn(true), 600);
        }
      }, 38);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [stage]);

  const handleVamos = () => {
    setExpanding(true);
    setTimeout(() => onComplete(), 5800);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {stage === "envelope" && (
        <div
          className="envelope-open-anim flex flex-col items-center"
          style={{ fontSize: "6rem" }}
        >
          💌
        </div>
      )}

      {(stage === "letter" || stage === "expanding") && (
        <div
          className="letter-unfold-anim relative"
          style={{
            background: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%)",
            borderRadius: "16px",
            padding: "2.5rem 3rem",
            maxWidth: "600px",
            width: "90vw",
            boxShadow: "0 20px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,160,80,0.4)",
            color: "#3a2a10",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.8,
            fontSize: "1.05rem",
          }}
        >
          <div style={{ marginBottom: "1rem", fontSize: "1.4rem", opacity: 0.6 }}>
            ✉️ &nbsp;<em style={{ fontSize: "0.8rem" }}>Para você</em>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", flexWrap: "wrap" }}>
            <p style={{ flex: 1, minWidth: 0 }}>
              {displayed}
              {displayed.length < TEXT.length && (
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
            </p>

            {showImage && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src="https://i.pinimg.com/736x/d6/ef/00/d6ef0088d582a783148afbd1dc95d043.jpg"
                  alt="ilustração"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "3px solid rgba(124,58,237,0.5)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    animation: "triumph-open 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }}
                />
              </div>
            )}
          </div>

          {showBtn && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button
                onClick={handleVamos}
                disabled={expanding}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.8rem 2.5rem",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  cursor: expanding ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!expanding) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Vamos 🚀
              </button>
            </div>
          )}
        </div>
      )}

      {expanding && (
        <img
          src="https://i.pinimg.com/736x/d6/ef/00/d6ef0088d582a783148afbd1dc95d043.jpg"
          alt="expanding"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 100,
            animation: "triumph-open 0.8s ease-out forwards",
            animationFillMode: "forwards",
          }}
        />
      )}

      {expanding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "black",
            zIndex: 200,
            animation: "none",
            opacity: 0,
            animationName: "blink",
            animationDelay: "1.5s",
            animationDuration: "0.5s",
            animationFillMode: "forwards",
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === "blink") {
              (e.currentTarget as HTMLDivElement).style.opacity = "1";
            }
          }}
        />
      )}

      {expanding && (
        <BlackOverlay />
      )}
    </div>
  );
}

function BlackOverlay() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        zIndex: 300,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }}
    />
  );
}
