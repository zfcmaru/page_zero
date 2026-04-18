// ── MINIGAME (mini boat inside the choice panel) ─────────────────────────
const mini = {
  state: null,
  dest: { x: 0, y: 0 },
  rafId: null,
  canvas: null,
  ctx: null,
  W: 0,
  H: 0,
  particles: []
};

function miniInitParticles() {
  mini.particles.length = 0;
  for (let i = 0; i < 20; i++) {
    mini.particles.push({
      x: Math.random() * mini.W,
      y: Math.random() * mini.H,
      size: 1 + Math.random() * 1.2,
      speed: 0.5 + Math.random() * 0.8,
      opacity: 0.25 + Math.random() * 0.4
    });
  }
}

function miniUpdateParticles() {
  const wx = Math.cos(mini.state.windAngle) * 1.0;
  const wy = Math.sin(mini.state.windAngle) * 1.0;
  for (const p of mini.particles) {
    p.x += wx * p.speed;
    p.y += wy * p.speed;
    if (p.x < -4) p.x = mini.W + 4;
    if (p.x > mini.W + 4) p.x = -4;
    if (p.y < -4) p.y = mini.H + 4;
    if (p.y > mini.H + 4) p.y = -4;
  }
}

function miniDraw() {
  const ctx = mini.ctx;
  ctx.clearRect(0, 0, mini.W, mini.H);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, mini.W, mini.H);

  for (const p of mini.particles) {
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#f5c542';
  ctx.fillRect(mini.dest.x - 6, mini.dest.y - 6, 12, 12);

  ctx.save();
  ctx.translate(mini.state.x, mini.state.y);
  ctx.rotate(mini.state.heading + Math.PI / 2);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(-7, 7);
  ctx.lineTo(7, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function miniLoop() {
  if (gameState.phase !== 'minigame') return;

  const input = {
    left:    !!(keys['ArrowLeft']  || keys['KeyA']),
    right:   !!(keys['ArrowRight'] || keys['KeyD']),
    forward: !!(keys['KeyW'] || keys['ArrowUp']),
    reverse: !!(keys['KeyS'] || keys['ArrowDown'])
  };

  mini.state.windAngle += (Math.random() - 0.5) * 0.01;

  const next = tickPhysics(mini.state, input);

  if (next.x < 10) { next.x = 10; next.speed *= 0.5; }
  if (next.x > mini.W - 10) { next.x = mini.W - 10; next.speed *= 0.5; }
  if (next.y < 10) { next.y = 10; next.speed *= 0.5; }
  if (next.y > mini.H - 10) { next.y = mini.H - 10; next.speed *= 0.5; }

  mini.state = next;

  miniUpdateParticles();
  miniDraw();

  const dx = mini.state.x - mini.dest.x;
  const dy = mini.state.y - mini.dest.y;
  if (Math.hypot(dx, dy) < 16) {
    exitMinigame(true);
    return;
  }

  mini.rafId = requestAnimationFrame(miniLoop);
}

// UI setup — called by enterMinigame() in state.js
function doStartMinigame() {
  els.choiceContainer.classList.remove('is-active');
  els.choiceContainer.innerHTML = '';
  els.choicePlaceholder.style.display = 'none';
  els.minigamePanel.classList.add('is-active');

  els.nameBox.style.display = 'none';
  els.dialogText.textContent = 'Navigate to the marker...';
  els.hint.style.opacity = '0';

  const canvas = els.minigameCanvas;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(200, Math.floor(rect.width));
  canvas.height = Math.max(200, Math.floor(rect.width));
  mini.canvas = canvas;
  mini.ctx = canvas.getContext('2d');
  mini.W = canvas.width;
  mini.H = canvas.height;

  mini.state = {
    x: mini.W * 0.2,
    y: mini.H * 0.8,
    heading: -Math.PI / 4,
    speed: 0,
    motorState: 'neutral',
    windAngle: Math.PI / 3
  };
  mini.dest.x = mini.W * 0.8;
  mini.dest.y = mini.H * 0.2;

  miniInitParticles();

  const stage = document.getElementById('vn-stage');
  stage.focus({ preventScroll: true });

  mini.rafId = requestAnimationFrame(miniLoop);
}
