import { useState } from "react";
import Phase1 from "./phases/Phase1";
import Phase2 from "./phases/Phase2";
import Phase3 from "./phases/Phase3";
import Phase4 from "./phases/Phase4";
import Phase5 from "./phases/Phase5";
import Phase6 from "./phases/Phase6";
import Phase7 from "./phases/Phase7";
import Phase8 from "./phases/Phase8";
import Phase9 from "./phases/Phase9";
import Phase10 from "./phases/Phase10";
import Phase11 from "./phases/Phase11";
import FireworksOverlay from "./phases/FireworksOverlay";

type Phase = "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" | "p9" | "p10" | "p11";

export default function App() {
  const [phase, setPhase] = useState<Phase>("p1");
  const [celebrando, setCelebrando] = useState(false);

  const go = (p: Phase) => () => setPhase(p);

  const handleFinalizar = () => {
    setCelebrando(true);
    setPhase("p1");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      {phase === "p1"  && <Phase1  onComplete={go("p2")} />}
      {phase === "p2"  && <Phase2  onComplete={go("p3")} />}
      {phase === "p3"  && <Phase3  onComplete={go("p4")} />}
      {phase === "p4"  && <Phase4  onComplete={go("p5")} />}
      {phase === "p5"  && <Phase5  onComplete={go("p6")} />}
      {phase === "p6"  && <Phase6  onComplete={go("p7")} />}
      {phase === "p7"  && <Phase7  onComplete={go("p8")} />}
      {phase === "p8"  && <Phase8  onComplete={go("p9")} />}
      {phase === "p9"  && <Phase9  onComplete={go("p10")} />}
      {phase === "p10" && <Phase10 onComplete={go("p11")} onRestart={go("p1")} />}
      {phase === "p11" && <Phase11 onComplete={handleFinalizar} />}

      {celebrando && <FireworksOverlay />}
    </div>
  );
}
