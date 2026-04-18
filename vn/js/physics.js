// ── FÍSICA DO BARCO ───────────────────────────────────────────────────────
const ROTATION_SPEED = 0.045;
const ACCELERATION   = 0.15;
const MAX_SPEED      = 4.0;
const DRAG           = 0.985;
const WIND_FORCE     = 0.35;

function tickPhysics(state, input) {
  const next = Object.assign({}, state);

  if (input.left)  next.heading -= ROTATION_SPEED;
  if (input.right) next.heading += ROTATION_SPEED;

  if (input.forward)      next.motorState = 'forward';
  else if (input.reverse) next.motorState = 'reverse';
  else                    next.motorState = 'neutral';

  if (next.motorState === 'forward')
    next.speed = Math.min(next.speed + ACCELERATION, MAX_SPEED);
  else if (next.motorState === 'reverse')
    next.speed = Math.max(next.speed - ACCELERATION, -MAX_SPEED * 0.4);
  else
    next.speed = next.speed * DRAG;

  const windX = Math.cos(next.windAngle) * WIND_FORCE;
  const windY = Math.sin(next.windAngle) * WIND_FORCE;

  const perpX = -Math.sin(next.heading);
  const perpY =  Math.cos(next.heading);
  const windDot = Math.cos(next.windAngle) * perpX + Math.sin(next.windAngle) * perpY;
  const DRIFT_FORCE = 0.12;
  const driftX = perpX * windDot * DRIFT_FORCE;
  const driftY = perpY * windDot * DRIFT_FORCE;

  next.x = state.x + Math.cos(next.heading) * next.speed + windX + driftX;
  next.y = state.y + Math.sin(next.heading) * next.speed + windY + driftY;

  return next;
}

function clampToBounds(next, W, H, padding) {
  if (next.x < padding)       { next.x = padding;       next.speed *= 0.3; }
  if (next.x > W - padding)   { next.x = W - padding;   next.speed *= 0.3; }
  if (next.y < padding)       { next.y = padding;        next.speed *= 0.3; }
  if (next.y > H - padding)   { next.y = H - padding;   next.speed *= 0.3; }
  return next;
}

// Node.js compatibility — used by physics.test.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tickPhysics, clampToBounds, ROTATION_SPEED, ACCELERATION, MAX_SPEED, DRAG, WIND_FORCE };
}
