import { useEffect, useRef, useState } from "react";
import idleImg from "@assets/Pink_Monster_Idle_4_1779999759778.png";
import walkImg from "@assets/Pink_Monster_Walk_6_1779999759781.png";
import jumpImg from "@assets/Pink_Monster_Jump_8_1779999759779.png";
import attack1Img from "@assets/Pink_Monster_Attack1_4_1779999759777.png";
import attack2Img from "@assets/Pink_Monster_Attack2_6_1779999759777.png";
import throwImg from "@assets/Pink_Monster_Throw_4_1779999759780.png";
import deathImg from "@assets/Pink_Monster_Death_8_1779999759778.png";
import rock1Img from "@assets/Rock1_1779999759782.png";
import rock2Img from "@assets/Rock2_1779999759782.png";
import cartaImg from "@assets/carta_1779999812883.png";
import enemyIdleImg from "@assets/Idle_1779999887836.png";
import enemyWalkImg from "@assets/Walk_1779999887836.png";
import enemyAttackImg from "@assets/Attack1_1779999887834.png";
import enemyDeathImg from "@assets/Death_1779999887836.png";

interface Phase5Props {
  onComplete: () => void;
}

const GRAVITY = 0.6;
const PLAYER_SPEED = 3.8;
const JUMP_VEL = -15;
const TRAMPOLINE_VEL = -26;
const PLAYER_W = 48;
const PLAYER_H = 48;
const ENEMY_W = 60;
const ENEMY_H = 60;
const ROCK_W = 18;
const ROCK_H = 18;
const CARTA_W = 58;
const CARTA_H = 58;
const MAP_W = 3200;
const MAP_H = 1150;
const GROUND_Y = 1100;

// Platform kinds
type PlatKind = "normal" | "trampoline" | "ceiling" | "spike";

interface Platform {
  x: number; y: number; w: number; h: number;
  kind: PlatKind;
}

// ─── MAP DESIGN ─────────────────────────────────────────────────────────────
// Coordinate system: Y=0 top, Y increases downward.
// Ground is at GROUND_Y. Carta is near top (low Y).
// ─────────────────────────────────────────────────────────────────────────────
const PLATFORMS: Platform[] = [
  // === GROUND FLOOR (start area) ===
  { x: 0,    y: GROUND_Y, w: 420, h: 20, kind: "normal" },

  // === SECTION 1: stepped climb (left side) ===
  { x: 160,  y: 1010, w: 120, h: 18, kind: "normal" },
  { x: 260,  y: 930,  w: 110, h: 18, kind: "normal" },
  { x: 340,  y: 850,  w: 90,  h: 18, kind: "normal" },
  // gap then...
  { x: 470,  y: 820,  w: 70,  h: 18, kind: "normal" },   // tiny, precise
  { x: 580,  y: 760,  w: 110, h: 18, kind: "normal" },

  // === SECTION 2: trampoline launch ===
  { x: 650,  y: GROUND_Y, w: 300, h: 20, kind: "normal" },
  { x: 760,  y: GROUND_Y - 2, w: 80,  h: 18, kind: "trampoline" }, // launches up

  // === SECTION 2B: ceiling obstacle corridor ===
  { x: 820,  y: 780,  w: 200, h: 18, kind: "normal" },   // land here after trampoline
  { x: 820,  y: 680,  w: 260, h: 22, kind: "ceiling" },  // ceiling block – can't jump through
  { x: 900,  y: 750,  w: 60,  h: 18, kind: "normal" },   // low platform in corridor
  { x: 1000, y: 740,  w: 50,  h: 18, kind: "normal" },

  // === SECTION 3: long ground stretch ===
  { x: 950,  y: GROUND_Y, w: 600, h: 20, kind: "normal" },
  // spikes in the middle of the stretch
  { x: 1080, y: GROUND_Y - 18, w: 80, h: 18, kind: "spike" },
  { x: 1260, y: GROUND_Y - 18, w: 80, h: 18, kind: "spike" },

  // === SECTION 4: mid staircase ===
  { x: 1160, y: 970,  w: 90,  h: 18, kind: "normal" },
  { x: 1300, y: 890,  w: 90,  h: 18, kind: "normal" },
  { x: 1420, y: 810,  w: 80,  h: 18, kind: "normal" },
  { x: 1510, y: 730,  w: 70,  h: 18, kind: "normal" },  // tiny
  { x: 1580, y: 650,  w: 90,  h: 18, kind: "normal" },

  // === SECTION 5: high area ===
  { x: 1550, y: GROUND_Y, w: 300, h: 20, kind: "normal" },
  { x: 1660, y: GROUND_Y - 2, w: 80, h: 18, kind: "trampoline" }, // 2nd trampoline
  { x: 1700, y: 500,  w: 130, h: 18, kind: "normal" },   // after 2nd trampoline
  { x: 1860, y: 430,  w: 100, h: 18, kind: "normal" },
  { x: 1980, y: 360,  w: 90,  h: 18, kind: "normal" },
  { x: 2080, y: 300,  w: 80,  h: 18, kind: "normal" },  // tiny

  // === SECTION 6: ceiling maze ===
  { x: 2000, y: GROUND_Y, w: 500, h: 20, kind: "normal" },
  { x: 2050, y: 220,  w: 350, h: 22, kind: "ceiling" }, // big ceiling
  { x: 2100, y: 250,  w: 60,  h: 18, kind: "normal" },
  { x: 2220, y: 240,  w: 55,  h: 18, kind: "normal" },
  { x: 2330, y: 230,  w: 60,  h: 18, kind: "normal" },

  // === SECTION 7: final approach ===
  { x: 2480, y: GROUND_Y, w: 400, h: 20, kind: "normal" },
  { x: 2500, y: 960,  w: 90,  h: 18, kind: "normal" },
  { x: 2620, y: 870,  w: 80,  h: 18, kind: "normal" },
  { x: 2720, y: 790,  w: 70,  h: 18, kind: "normal" },  // tiny
  { x: 2820, y: GROUND_Y - 2, w: 80, h: 18, kind: "trampoline" }, // 3rd trampoline
  { x: 2790, y: 540,  w: 100, h: 18, kind: "normal" },
  { x: 2900, y: 420,  w: 90,  h: 18, kind: "normal" },
  { x: 2990, y: 310,  w: 80,  h: 18, kind: "normal" },
  { x: 3050, y: 210,  w: 90,  h: 18, kind: "normal" },
  { x: 3080, y: 130,  w: 120, h: 18, kind: "normal" },  // carta platform
];

const CARTA_POS = { x: 3090, y: 75 };
const PORTAL_POS = { x: 60, y: GROUND_Y - 90 };

const ENEMY_DEFS = [
  { x: 290,  y: 900,  platIdx: 3  },
  { x: 820,  y: 740,  platIdx: 7  },
  { x: 950,  y: 740,  platIdx: 11 },
  { x: 1300, y: 860,  platIdx: 16 },
  { x: 1510, y: 700,  platIdx: 19 },
  { x: 1870, y: 400,  platIdx: 25 },
  { x: 2100, y: 220,  platIdx: 30 },
  { x: 2630, y: 840,  platIdx: 33 },
  { x: 3000, y: 280,  platIdx: 38 },
];

// ────────────────────────────────────────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(img);
    img.src = src;
  });
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

interface Entity {
  x: number; y: number; vx: number; vy: number;
  onGround: boolean; facingRight: boolean;
  hp: number; maxHp: number;
  state: string; animFrame: number; animTimer: number; animSpeed: number;
  dead: boolean; deadTimer: number; invincible: number;
}

interface Rock {
  x: number; y: number; vx: number; vy: number;
  active: boolean; img: HTMLImageElement; fromPlayer: boolean;
}

function getFrameCount(state: string, isEnemy: boolean): number {
  if (isEnemy) {
    switch (state) { case "idle": return 4; case "walk": return 6; case "attack": return 8; case "death": return 8; default: return 4; }
  }
  switch (state) {
    case "idle": return 4; case "walk": return 6; case "jump": return 8;
    case "attack1": return 4; case "attack2": return 6; case "throw": return 4; case "death": return 8;
    default: return 4;
  }
}

export default function Phase5({ onComplete }: Phase5Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    keys: new Set<string>(),
    mouseWorld: { x: 0, y: 0 },
    pendingShot: false,
    player: null as Entity | null,
    enemies: [] as Entity[],
    rocks: [] as Rock[],
    camX: 0, camY: 0,
    imgs: null as Record<string, HTMLImageElement> | null,
    attackCooldown: 0,
    throwCooldown: 0,
    attackHitbox: null as { x: number; y: number; w: number; h: number; timer: number } | null,
    cartaFloatT: 0, portalSpinT: 0,
    cartaCollected: false, triumph: false,
    prevAttackKey: false,
  });
  const [uiMsg, setUiMsg] = useState<string | null>(null);
  const [triumph, setTriumph] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const resetGame = () => {
    const s = stateRef.current;
    setShowGameOver(false);
    setTriumph(false);
    s.triumph = false;
    s.cartaCollected = false;
    s.player = makePlayer();
    s.enemies = makeEnemies();
    s.rocks = [];
    s.attackCooldown = 0;
    s.throwCooldown = 0;
    s.attackHitbox = null;
    s.camX = 0; s.camY = 0;
  };

  function makePlayer(): Entity {
    return { x: 80, y: GROUND_Y - PLAYER_H, vx: 0, vy: 0, onGround: false, facingRight: true, hp: 1, maxHp: 1, state: "idle", animFrame: 0, animTimer: 0, animSpeed: 7, dead: false, deadTimer: 0, invincible: 0 };
  }

  function makeEnemies(): Entity[] {
    return ENEMY_DEFS.map(() => ({
      x: 0, y: 0, vx: 0.9, vy: 0, onGround: false, facingRight: true,
      hp: 3, maxHp: 3, state: "walk", animFrame: 0, animTimer: 0, animSpeed: 10, dead: false, deadTimer: 0, invincible: 0,
    })).map((e, i) => ({ ...e, x: ENEMY_DEFS[i].x, y: ENEMY_DEFS[i].y }));
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    let raf = 0;
    let alive = true;

    async function init() {
      const srcs = {
        idle: idleImg, walk: walkImg, jump: jumpImg,
        attack1: attack1Img, attack2: attack2Img, throw: throwImg, death: deathImg,
        rock1: rock1Img, rock2: rock2Img, carta: cartaImg,
        eIdle: enemyIdleImg, eWalk: enemyWalkImg, eAttack: enemyAttackImg, eDeath: enemyDeathImg,
      };
      const imgs: Record<string, HTMLImageElement> = {};
      await Promise.all(Object.entries(srcs).map(async ([k, v]) => { imgs[k] = await loadImg(v); }));
      const s = stateRef.current;
      s.imgs = imgs;
      s.player = makePlayer();
      s.enemies = makeEnemies();
      raf = requestAnimationFrame(loop);
    }

    function advanceAnim(ent: Entity, isEnemy: boolean) {
      ent.animTimer++;
      if (ent.animTimer >= ent.animSpeed) {
        ent.animTimer = 0;
        const fc = getFrameCount(ent.state, isEnemy);
        ent.animFrame = (ent.animFrame + 1) % fc;
      }
    }

    function applyPlatforms(ent: Entity, w: number, h: number): { trampoline: boolean; spike: boolean } {
      let trampoline = false, spike = false;
      for (const p of PLATFORMS) {
        const ex = ent.x, ey = ent.y, ew = w, eh = h;
        // Floor collision (falling down onto platform top)
        if (p.kind !== "ceiling") {
          if (ex + ew > p.x && ex < p.x + p.w && ey + eh > p.y && ey + eh < p.y + p.h + 18 && ent.vy >= 0) {
            ent.y = p.y - eh;
            ent.vy = 0;
            ent.onGround = true;
            if (p.kind === "trampoline") trampoline = true;
            if (p.kind === "spike") spike = true;
          }
        }
        // Ceiling collision (jumping up into ceiling underside)
        if (p.kind === "ceiling") {
          if (ex + ew > p.x && ex < p.x + p.w && ey < p.y + p.h && ey > p.y - 18 && ent.vy < 0) {
            ent.y = p.y + p.h;
            ent.vy = 0;
          }
        }
      }
      return { trampoline, spike };
    }

    function loop() {
      if (!alive) return;
      const s = stateRef.current;
      if (!s.player || !s.imgs) { raf = requestAnimationFrame(loop); return; }
      update(s);
      render(s);
      raf = requestAnimationFrame(loop);
    }

    function update(s: typeof stateRef.current) {
      if (s.triumph) return;
      const p = s.player!;
      const keys = s.keys;

      if (s.attackCooldown > 0) s.attackCooldown--;
      if (s.throwCooldown > 0) s.throwCooldown--;
      if (s.attackHitbox) { s.attackHitbox.timer--; if (s.attackHitbox.timer <= 0) s.attackHitbox = null; }
      if (p.invincible > 0) p.invincible--;

      if (!p.dead) {
        const left  = keys.has("ArrowLeft")  || keys.has("KeyA");
        const right = keys.has("ArrowRight") || keys.has("KeyD");
        const jump  = keys.has("ArrowUp") || keys.has("KeyW") || keys.has("Space");
        const attackKey = keys.has("KeyE") || keys.has("KeyJ");
        const attackPressed = attackKey && !s.prevAttackKey;
        s.prevAttackKey = attackKey;

        // Facing always updates instantly — no delay on turning
        if (left)       p.facingRight = false;
        else if (right) p.facingRight = true;

        const isAttacking = p.state === "attack1" || p.state === "attack2" || p.state === "throw";
        const fc = getFrameCount(p.state, false);
        // Attack is done when the last frame has been fully shown
        const attackDone = isAttacking && p.animFrame >= fc - 1 && p.animTimer >= p.animSpeed - 1;

        // Exit attack state the moment animation finishes
        if (attackDone) {
          p.state = "idle";
          p.animFrame = 0;
          p.animTimer = 0;
        }

        const freeToAct = !isAttacking || attackDone;

        if (freeToAct) {
          if (left)       { p.vx = -PLAYER_SPEED; }
          else if (right) { p.vx =  PLAYER_SPEED; }
          else            { p.vx = 0; }

          if (jump && p.onGround) { p.vy = JUMP_VEL; p.onGround = false; }

          if (attackPressed && s.attackCooldown <= 0) {
            p.state = Math.random() > 0.5 ? "attack1" : "attack2";
            p.animFrame = 0; p.animTimer = 0;
            s.attackCooldown = 35;
            const hbW = 52, hbH = 38;
            s.attackHitbox = {
              x: p.facingRight ? p.x + PLAYER_W : p.x - hbW,
              y: p.y + 6, w: hbW, h: hbH, timer: 10,
            };
          } else if (s.pendingShot && s.throwCooldown <= 0) {
            s.pendingShot = false;
            p.state = "throw";
            p.animFrame = 0; p.animTimer = 0;
            s.throwCooldown = 30;
            const ri = s.imgs![Math.random() > 0.5 ? "rock1" : "rock2"];
            const ox = p.x + PLAYER_W / 2, oy = p.y + PLAYER_H / 2;
            const mx = s.mouseWorld.x, my = s.mouseWorld.y;
            const dx = mx - ox, dy = my - oy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            s.rocks.push({ x: ox, y: oy, vx: (dx / len) * 11, vy: (dy / len) * 11, active: true, img: s.imgs![Math.random() > 0.5 ? "rock1" : "rock2"], fromPlayer: true });
            if (dx > 0) p.facingRight = true; else if (dx < 0) p.facingRight = false;
          } else if (p.state !== "attack1" && p.state !== "attack2" && p.state !== "throw") {
            if (!p.onGround)        p.state = "jump";
            else if (left || right) p.state = "walk";
            else                    p.state = "idle";
          }
        } else {
          // Mid-attack: freeze horizontal, let animation finish
          p.vx = 0;
        }

        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.x = clamp(p.x, 0, MAP_W - PLAYER_W);
        p.onGround = false;
        const { trampoline, spike } = applyPlatforms(p, PLAYER_W, PLAYER_H);

        if (trampoline && !p.dead) { p.vy = TRAMPOLINE_VEL; p.onGround = false; }
        if (spike && !p.dead && p.invincible === 0) {
          killPlayer(p, s);
        }

        if (p.y > MAP_H) { p.y = MAP_H - PLAYER_H; p.vy = 0; p.onGround = true; }
      } else {
        p.vx *= 0.85;
        p.vy += GRAVITY;
        p.y = Math.min(p.y + p.vy, MAP_H + 100);
        p.deadTimer++;
        if (p.deadTimer > 90 && !showGameOver) setShowGameOver(true);
      }

      advanceAnim(p, false);

      for (let ei = 0; ei < s.enemies.length; ei++) {
        const e = s.enemies[ei];
        if (e.dead) { e.deadTimer++; advanceAnim(e, true); continue; }

        const def = ENEMY_DEFS[ei];
        const pat = PLATFORMS[def.platIdx] || PLATFORMS[0];

        e.vy += GRAVITY;
        e.x += e.vx;
        e.y += e.vy;
        e.onGround = false;
        applyPlatforms(e, ENEMY_W, ENEMY_H);
        if (e.y > MAP_H) { e.y = MAP_H - ENEMY_H; e.vy = 0; e.onGround = true; }

        if (e.x <= pat.x + 2) { e.vx = Math.abs(e.vx); e.facingRight = true; }
        if (e.x + ENEMY_W >= pat.x + pat.w - 2) { e.vx = -Math.abs(e.vx); e.facingRight = false; }

        const near = Math.abs(e.x + ENEMY_W / 2 - (p.x + PLAYER_W / 2)) < 90 &&
                     Math.abs(e.y + ENEMY_H / 2 - (p.y + PLAYER_H / 2)) < 70;
        e.state = near ? "attack" : "walk";

        if (near && !p.dead && p.invincible === 0 &&
          rectsOverlap(e.x + 10, e.y, ENEMY_W - 20, ENEMY_H, p.x, p.y, PLAYER_W, PLAYER_H) &&
          e.animFrame === 3 && e.animTimer === 0) {
          killPlayer(p, s);
        }

        advanceAnim(e, true);

        if (s.attackHitbox && rectsOverlap(s.attackHitbox.x, s.attackHitbox.y, s.attackHitbox.w, s.attackHitbox.h, e.x, e.y, ENEMY_W, ENEMY_H)) {
          e.hp = Math.max(0, e.hp - 1);
          if (e.hp <= 0 && !e.dead) { e.dead = true; e.state = "death"; e.animFrame = 0; e.vx = 0; }
        }
      }

      for (const r of s.rocks) {
        if (!r.active) continue;
        r.vy += GRAVITY * 0.35;
        r.x += r.vx; r.y += r.vy;
        if (r.x < -50 || r.x > MAP_W + 50 || r.y > MAP_H + 100) { r.active = false; continue; }
        for (const e of s.enemies) {
          if (e.dead || !r.active) continue;
          if (rectsOverlap(r.x, r.y, ROCK_W, ROCK_H, e.x, e.y, ENEMY_W, ENEMY_H)) {
            e.hp = Math.max(0, e.hp - 1);
            r.active = false;
            if (e.hp <= 0 && !e.dead) { e.dead = true; e.state = "death"; e.animFrame = 0; e.vx = 0; }
          }
        }
      }
      s.rocks = s.rocks.filter((r) => r.active);

      if (!s.cartaCollected && !p.dead) {
        s.cartaFloatT += 0.05;
        const cy = CARTA_POS.y + Math.sin(s.cartaFloatT) * 6;
        if (rectsOverlap(p.x, p.y, PLAYER_W, PLAYER_H, CARTA_POS.x, cy, CARTA_W, CARTA_H)) {
          s.cartaCollected = true;
          setUiMsg("🎉 Você pegou a carta! Volte ao início e entre no Portal!");
          setTimeout(() => setUiMsg(null), 6000);
        }
      }

      if (s.cartaCollected && !s.triumph && !p.dead) {
        s.portalSpinT += 0.05;
        if (rectsOverlap(p.x, p.y, PLAYER_W, PLAYER_H, PORTAL_POS.x, PORTAL_POS.y, 70, 90)) {
          s.triumph = true;
          setTriumph(true);
          setTimeout(() => onComplete(), 2500);
        }
      }

      const cw = canvas.width, ch = canvas.height;
      const tx = p.x + PLAYER_W / 2 - cw / 2;
      const ty = p.y + PLAYER_H / 2 - ch / 2;
      s.camX += (tx - s.camX) * 0.1;
      s.camY += (ty - s.camY) * 0.1;
      s.camX = clamp(s.camX, 0, MAP_W - cw);
      s.camY = clamp(s.camY, 0, MAP_H - ch + 80);
    }

    function killPlayer(p: Entity, s: typeof stateRef.current) {
      p.hp = 0;
      p.dead = true;
      p.state = "death";
      p.animFrame = 0;
      p.animTimer = 0;
      p.vy = -8;
    }

    function drawSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, frame: number, totalFrames: number,
      dx: number, dy: number, dw: number, dh: number, flipX: boolean) {
      const fw = img.width / totalFrames;
      ctx.save();
      if (flipX) {
        ctx.translate(dx + dw, dy); ctx.scale(-1, 1);
        ctx.drawImage(img, frame * fw, 0, fw, img.height, 0, 0, dw, dh);
      } else {
        ctx.drawImage(img, frame * fw, 0, fw, img.height, dx, dy, dw, dh);
      }
      ctx.restore();
    }

    function getPlayerImg(state: string): HTMLImageElement {
      const imgs = stateRef.current.imgs!;
      return ({ idle: imgs.idle, walk: imgs.walk, jump: imgs.jump, attack1: imgs.attack1, attack2: imgs.attack2, throw: imgs.throw, death: imgs.death } as Record<string, HTMLImageElement>)[state] || imgs.idle;
    }

    function getEnemyImg(state: string): HTMLImageElement {
      const imgs = stateRef.current.imgs!;
      return ({ idle: imgs.eIdle, walk: imgs.eWalk, attack: imgs.eAttack, death: imgs.eDeath } as Record<string, HTMLImageElement>)[state] || imgs.eIdle;
    }

    function render(s: typeof stateRef.current) {
      const ctx = canvas.getContext("2d")!;
      const cw = canvas.width, ch = canvas.height;
      const cx = s.camX, cy = s.camY;

      ctx.clearRect(0, 0, cw, ch);
      const bg = ctx.createLinearGradient(0, 0, 0, ch);
      bg.addColorStop(0, "#060d18"); bg.addColorStop(1, "#0e1f14");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);

      // Stars (parallax)
      for (let i = 0; i < 100; i++) {
        const sx = ((i * 137.5 + cx * 0.2) % MAP_W) % cw;
        const sy = ((i * 73.1  + cy * 0.1) % (MAP_H + 100)) % ch;
        ctx.fillStyle = `rgba(255,255,255,${0.08 + (i % 4) * 0.03})`;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Platforms
      for (const plat of PLATFORMS) {
        const px = plat.x - cx, py = plat.y - cy;
        if (px + plat.w < 0 || px > cw || py + plat.h < 0 || py > ch) continue;

        if (plat.kind === "trampoline") {
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(px, py, plat.w, plat.h);
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          for (let tx = 4; tx < plat.w - 4; tx += 10) {
            ctx.fillRect(px + tx, py + 3, 5, 5);
          }
          ctx.fillStyle = "rgba(34,197,94,0.3)";
          ctx.fillRect(px, py + plat.h, plat.w, 4);
        } else if (plat.kind === "ceiling") {
          ctx.fillStyle = "#4a1a6b";
          ctx.fillRect(px, py, plat.w, plat.h);
          ctx.fillStyle = "rgba(180,80,255,0.3)";
          ctx.fillRect(px, py + plat.h - 4, plat.w, 4);
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          ctx.fillRect(px, py, plat.w, 3);
          // ceiling spikes indicator
          for (let tx = 8; tx < plat.w - 8; tx += 16) {
            ctx.fillStyle = "rgba(200,0,255,0.4)";
            ctx.beginPath();
            ctx.moveTo(px + tx, py + plat.h);
            ctx.lineTo(px + tx + 6, py + plat.h + 10);
            ctx.lineTo(px + tx + 12, py + plat.h);
            ctx.fill();
          }
        } else if (plat.kind === "spike") {
          ctx.fillStyle = "#7f1d1d";
          for (let tx = 0; tx < plat.w; tx += 16) {
            ctx.beginPath();
            ctx.moveTo(px + tx, py + plat.h);
            ctx.lineTo(px + tx + 8, py);
            ctx.lineTo(px + tx + 16, py + plat.h);
            ctx.closePath();
            ctx.fill();
          }
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = plat.color || "#2d4a3e";
          ctx.fillRect(px, py, plat.w, plat.h);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(px, py, plat.w, 3);
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillRect(px, py + plat.h - 3, plat.w, 3);
        }
      }

      // Portal
      const portalX = PORTAL_POS.x - cx, portalY = PORTAL_POS.y - cy;
      if (s.cartaCollected) {
        const t = s.portalSpinT;
        ctx.save();
        ctx.translate(portalX + 35, portalY + 45);
        const g = ctx.createRadialGradient(0, 0, 8, 0, 0, 42);
        g.addColorStop(0, `rgba(140,60,255,${0.5 + Math.sin(t * 3) * 0.2})`);
        g.addColorStop(0.6, `rgba(219,39,119,${0.3 + Math.cos(t * 2) * 0.15})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 42, 52, t * 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(199,${110 + Math.sin(t * 4) * 40},255,0.9)`;
        ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 32, 42, t, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("PORTAL", 0, 62);
        ctx.restore();
      } else {
        ctx.strokeStyle = "rgba(100,200,100,0.35)"; ctx.lineWidth = 2;
        ctx.strokeRect(portalX, portalY, 70, 90);
        ctx.fillStyle = "rgba(100,200,100,0.08)"; ctx.fillRect(portalX, portalY, 70, 90);
        ctx.fillStyle = "rgba(100,200,100,0.4)"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("início", portalX + 35, portalY + 48); ctx.textAlign = "left";
      }

      // Carta
      if (!s.cartaCollected && s.imgs) {
        const floatY = CARTA_POS.y + Math.sin(s.cartaFloatT) * 6;
        ctx.save();
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 24;
        ctx.drawImage(s.imgs.carta, CARTA_POS.x - cx, floatY - cy, CARTA_W, CARTA_H);
        ctx.restore();
        ctx.strokeStyle = "rgba(251,191,36,0.4)"; ctx.lineWidth = 2;
        ctx.strokeRect(CARTA_POS.x - cx, floatY - cy, CARTA_W, CARTA_H);
      }

      if (!s.imgs) return;

      // Enemies
      for (const e of s.enemies) {
        if (e.dead && e.deadTimer > 65) continue;
        const ex = e.x - cx, ey = e.y - cy;
        const img = getEnemyImg(e.state);
        const fc = getFrameCount(e.state, true);
        ctx.save();
        if (e.dead) ctx.globalAlpha = Math.max(0, 1 - e.deadTimer / 70);
        drawSprite(ctx, img, e.animFrame % fc, fc, ex, ey, ENEMY_W, ENEMY_H, e.facingRight);
        ctx.restore();
        if (!e.dead) {
          const bw = 38, bx2 = ex + (ENEMY_W - bw) / 2, by2 = ey - 10;
          ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(bx2, by2, bw, 5);
          ctx.fillStyle = e.hp > 1 ? "#22c55e" : "#ef4444";
          ctx.fillRect(bx2, by2, bw * (e.hp / e.maxHp), 5);
        }
      }

      // Rocks
      for (const r of s.rocks) {
        if (!r.active) continue;
        ctx.drawImage(r.img, r.x - cx, r.y - cy, ROCK_W, ROCK_H);
      }

      // Attack hitbox debug (subtle)
      if (s.attackHitbox) {
        ctx.fillStyle = "rgba(255,120,0,0.12)";
        ctx.fillRect(s.attackHitbox.x - cx, s.attackHitbox.y - cy, s.attackHitbox.w, s.attackHitbox.h);
      }

      // Player
      const pl = s.player!;
      const plx = pl.x - cx, ply = pl.y - cy;
      const pimg = getPlayerImg(pl.state);
      const pfc = getFrameCount(pl.state, false);
      ctx.save();
      if (pl.dead) ctx.globalAlpha = Math.max(0, 1 - pl.deadTimer / 60);
      else if (pl.invincible > 0 && Math.floor(pl.invincible / 4) % 2 === 0) ctx.globalAlpha = 0.4;
      drawSprite(ctx, pimg, pl.animFrame % pfc, pfc, plx, ply, PLAYER_W, PLAYER_H, !pl.facingRight);
      ctx.restore();

      // HUD
      // 1 HP skull / heart
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(8, 8, 80, 26); ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1; ctx.strokeRect(8, 8, 80, 26);
      ctx.font = "bold 15px sans-serif"; ctx.textAlign = "left";
      ctx.fillStyle = pl.dead ? "#ef4444" : "#f0f0f0";
      ctx.fillText(pl.dead ? "💀 mort" : "❤️  vida", 14, 26);

      // Controls hint
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(8, ch - 28, 280, 20);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "9px monospace";
      ctx.fillText("←→ mover | ↑ pular | E soco | click esquerdo arremessar", 12, ch - 13);
      ctx.textAlign = "left";

      if (s.cartaCollected) {
        ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(cw / 2 - 130, 6, 260, 26);
        ctx.fillStyle = "#fbbf24"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("📜 Carta coletada! Vá ao Portal!", cw / 2, 24); ctx.textAlign = "left";
      }
    }

    // Event listeners
    const onKeyDown = (e: KeyboardEvent) => { stateRef.current.keys.add(e.code); e.preventDefault(); };
    const onKeyUp   = (e: KeyboardEvent) => { stateRef.current.keys.delete(e.code); };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
      stateRef.current.mouseWorld.x = sx * scaleX + stateRef.current.camX;
      stateRef.current.mouseWorld.y = sy * scaleY + stateRef.current.camY;
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
        const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        stateRef.current.mouseWorld.x = sx * scaleX + stateRef.current.camX;
        stateRef.current.mouseWorld.y = sy * scaleY + stateRef.current.camY;
        stateRef.current.pendingShot = true;
      }
    };

    function resize() {
      canvas.width  = Math.min(window.innerWidth, 960);
      canvas.height = Math.min(window.innerHeight - 70, 540);
    }
    resize();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", resize);

    init();

    return () => {
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  // Mobile virtual buttons
  const moveBtns = [
    { label: "←", code: "ArrowLeft"  },
    { label: "→", code: "ArrowRight" },
    { label: "↑", code: "ArrowUp"    },
    { label: "E",  code: "KeyE"       },
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: "#040810" }}>
      <div style={{ marginBottom: 6, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: "1rem" }}>⚔️ Jornada da Carta</span>
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>1 vida • clique esquerdo = arremessar • E = soco</span>
      </div>

      <canvas
        ref={canvasRef}
        style={{ imageRendering: "pixelated", border: "2px solid rgba(124,58,237,0.4)", borderRadius: 8, boxShadow: "0 0 40px rgba(124,58,237,0.25)", maxWidth: "100vw", cursor: "crosshair" }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {moveBtns.map((b) => (
          <button key={b.code}
            onPointerDown={() => stateRef.current.keys.add(b.code)}
            onPointerUp={() => stateRef.current.keys.delete(b.code)}
            onPointerLeave={() => stateRef.current.keys.delete(b.code)}
            style={{ width: 52, height: 52, background: "rgba(124,58,237,0.25)", border: "2px solid rgba(124,58,237,0.45)", borderRadius: 10, color: "#fff", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", touchAction: "none", userSelect: "none" }}>
            {b.label}
          </button>
        ))}
      </div>

      {uiMsg && (
        <div style={{ position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.92)", border: "2px solid #7c3aed", borderRadius: 14, padding: "1rem 2rem", color: "#fff", fontSize: "0.95rem", fontWeight: 600, zIndex: 50, textAlign: "center", boxShadow: "0 0 30px rgba(124,58,237,0.5)", maxWidth: "90vw" }}>
          {uiMsg}
        </div>
      )}

      {showGameOver && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <p style={{ color: "#ef4444", fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.5rem" }}>💀 Você morreu!</p>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontSize: "0.95rem" }}>Uma vida só — tente de novo!</p>
          <button onClick={resetGame} style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", border: "none", borderRadius: 12, padding: "0.9rem 2.5rem", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}>
            Tentar de novo
          </button>
        </div>
      )}

      {triumph && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ fontSize: "5rem", animation: "float 1s ease-in-out infinite", marginBottom: "1rem" }}>🎉</div>
          <p style={{ color: "#fbbf24", fontSize: "1.8rem", fontWeight: 900 }}>Você conseguiu!</p>
          <p style={{ color: "#a78bfa", marginTop: "0.5rem" }}>Abrindo a carta...</p>
        </div>
      )}
    </div>
  );
}
