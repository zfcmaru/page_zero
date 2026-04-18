// ── ESTADO DO MAPA ────────────────────────────────────────────────────────
const player = { x: 0, y: 0 };
const TRIGGER_DIST = 40;
const keys = {};

const wind = {
  angle: 0, targetAngle: 0, strength: 1.2,
  changeTimer: 0, changeInterval: 180
};
let boatAngle  = 0;
const PARTICLE_COUNT = 55;
const particles      = [];

let motorState = 'neutral';
let speed = 0;

let rafId = null;

// ── VENTO ─────────────────────────────────────────────────────────────────
function updateWind() {
  wind.changeTimer++;
  if (wind.changeTimer >= wind.changeInterval) {
    wind.changeTimer = 0;
    const delta = (Math.random() - 0.5) * (Math.PI * 2 / 3);
    wind.targetAngle = wind.angle + delta;
    wind.changeInterval = 150 + Math.floor(Math.random() * 120);
  }
  wind.angle += (wind.targetAngle - wind.angle) * 0.012;
}

function getWindVector() {
  return {
    x: Math.cos(wind.angle) * wind.strength,
    y: Math.sin(wind.angle) * wind.strength
  };
}

// ── PARTÍCULAS ────────────────────────────────────────────────────────────
function initParticles() {
  particles.length = 0;
  const stage = document.getElementById('vn-stage');
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:       Math.random() * W,
      y:       Math.random() * H,
      size:    1.5 + Math.random() * 2,
      speed:   0.8 + Math.random() * 1.4,
      opacity: 0.2 + Math.random() * 0.5
    });
  }
}

function updateParticles() {
  const stage = document.getElementById('vn-stage');
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  const wv = getWindVector();
  for (const p of particles) {
    p.x += wv.x * p.speed;
    p.y += wv.y * p.speed;
    if (p.x < -10)    p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10)    p.y = H + 10;
    if (p.y > H + 10) p.y = -10;
  }
}

function drawWindParticles(ctx) {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
  }
}

// ── MARKERS DE CENÁRIO ────────────────────────────────────────────────────
function drawScenarioMarkers(ctx, W, H) {
  ctx.save();
  ctx.font = '11px "DotGothic16", monospace';
  ctx.textAlign = 'center';
  Object.values(SCENARIOS).forEach(scenario => {
    const mx = scenario.mapMarker.x * W;
    const my = scenario.mapMarker.y * H;
    ctx.fillStyle = '#f5c542';
    ctx.fillRect(mx - 15, my - 15, 30, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText(scenario.title, mx, my - 22);
  });
  ctx.restore();
}

function drawAll() {
  const canvas = document.getElementById('wind-canvas');
  const ctx    = canvas.getContext('2d');
  const stage  = document.getElementById('vn-stage');
  if (canvas.width !== stage.clientWidth) {
    canvas.width  = stage.clientWidth;
    canvas.height = stage.clientHeight;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWindParticles(ctx);
  drawScenarioMarkers(ctx, canvas.width, canvas.height);
  drawHUD(ctx, canvas.width, canvas.height);
}

function drawHUD(ctx, W, H) {
  if (gameState.phase !== 'hub') return;
  const motorColors = { forward: '#f5c542', neutral: '#fff', reverse: '#fb923c' };
  const col = motorColors[motorState];

  ctx.font = '11px "DotGothic16", monospace';
  ctx.fillStyle = col;
  ctx.textAlign = 'left';
  ctx.fillText('[ MOTOR: ' + motorState.toUpperCase() + ' ]', 16, H - 48);

  const segments = 5;
  const filled = Math.round((Math.abs(speed) / MAX_SPEED) * segments);
  for (let i = 0; i < segments; i++) {
    ctx.fillStyle = i < filled ? col : 'rgba(255,255,255,0.2)';
    ctx.fillRect(16 + i * 16, H - 68, 12, 4);
  }
}

// ── MOVIMENTO DO BARCO ────────────────────────────────────────────────────
function applyPlayerPos() {
  els.playerEl.style.left = player.x + 'px';
  els.playerEl.style.top  = player.y + 'px';
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function updatePlayer() {
  const stage = document.getElementById('vn-stage');
  const W = stage.clientWidth;
  const H = stage.clientHeight;

  const input = {
    left:    !!(keys['ArrowLeft']  || keys['KeyA']),
    right:   !!(keys['ArrowRight'] || keys['KeyD']),
    forward: !!(keys['KeyW'] || keys['ArrowUp']),
    reverse: !!(keys['KeyS'] || keys['ArrowDown'])
  };

  const state = {
    x: player.x, y: player.y,
    heading: boatAngle, speed: speed,
    motorState: motorState,
    windAngle: wind.angle
  };

  let next = tickPhysics(state, input);
  next = clampToBounds(next, W, H, 20);

  player.x   = next.x;
  player.y   = next.y;
  boatAngle  = next.heading;
  speed      = next.speed;
  motorState = next.motorState;

  const degrees = boatAngle * (180 / Math.PI);
  els.playerEl.style.left      = player.x + 'px';
  els.playerEl.style.top       = player.y + 'px';
  els.playerEl.style.transform = `translate(-50%, -50%) rotate(${degrees + 90}deg)`;
}

function gameLoop() {
  if (gameState.phase !== 'hub') return;
  updateWind();
  updateParticles();
  updatePlayer();
  drawAll();

  const stage = document.getElementById('vn-stage');
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  for (const scenario of Object.values(SCENARIOS)) {
    const mx = scenario.mapMarker.x * W;
    const my = scenario.mapMarker.y * H;
    if (Math.hypot(player.x - mx, player.y - my) <= TRIGGER_DIST) {
      startDialogue(scenario.id);
      return;
    }
  }

  rafId = requestAnimationFrame(gameLoop);
}

// ── RESET ─────────────────────────────────────────────────────────────────
function resetGame() {
  const stage = document.getElementById('vn-stage');
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  player.x = W * 0.15;
  player.y = H * 0.50;
  applyPlayerPos();

  // Point boat toward first scenario marker
  const firstScenario = Object.values(SCENARIOS)[0];
  const mx = firstScenario.mapMarker.x * W;
  const my = firstScenario.mapMarker.y * H;
  boatAngle  = Math.atan2(my - player.y, mx - player.x);
  speed      = 0;
  motorState = 'neutral';
  wind.angle       = Math.PI / 4;
  wind.targetAngle = Math.PI / 4;
  wind.changeTimer = 0;
  initParticles();
}
