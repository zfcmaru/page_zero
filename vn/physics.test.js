// vn/physics.test.js
// Run with: node vn/physics.test.js

const {
  tickPhysics,
  ROTATION_SPEED,
  ACCELERATION,
  MAX_SPEED,
  DRAG,
  WIND_FORCE
} = require('./js/physics.js');

// ── BASELINE TESTS ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log('  \u2713', label); passed++; }
  else           { console.error('  \u2717 FAIL:', label); failed++; }
}

// Test 1: neutral motor → speed decays by DRAG each tick
{
  const s0 = { x:0, y:0, heading:0, speed:2.0, motorState:'neutral', windAngle:0 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:false, reverse:false });
  assert('neutral drag: speed decays', Math.abs(s1.speed - 2.0 * DRAG) < 0.001);
}

// Test 2: forward input → speed increases by ACCELERATION; motorState = 'forward'
{
  const s0 = { x:0, y:0, heading:0, speed:0, motorState:'neutral', windAngle:0 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:true, reverse:false });
  assert('forward: speed increases', Math.abs(s1.speed - ACCELERATION) < 0.001);
  assert('forward: motorState is forward', s1.motorState === 'forward');
}

// Test 3: left input → heading decreases
{
  const s0 = { x:100, y:100, heading:0, speed:1, motorState:'neutral', windAngle:Math.PI/2 };
  const s1 = tickPhysics(s0, { left:true, right:false, forward:false, reverse:false });
  assert('left: heading decreases', s1.heading < 0);
}

// Test 4: boat at MAX_SPEED with forward → stays capped at MAX_SPEED
{
  const s0 = { x:0, y:0, heading:0, speed:4.0, motorState:'forward', windAngle:0 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:true, reverse:false });
  assert('max speed cap', s1.speed <= MAX_SPEED + 0.001);
}

// Test 5: wind displaces X when windAngle = 0
{
  const s0 = { x:100, y:100, heading:0, speed:0, motorState:'neutral', windAngle:0 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:false, reverse:false });
  assert('wind displaces x at angle 0', s1.x > s0.x);
}

console.log(`\nBaseline: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

// ── NEW FEATURE TESTS ──────────────────────────────────────────────────────

passed = 0; failed = 0;

// Test 6: inertia — after 10 neutral ticks from speed=4.0, still > 3.0
{
  let s = { x:200, y:200, heading:0, speed:4.0, motorState:'neutral', windAngle:0 };
  const noInput = { left:false, right:false, forward:false, reverse:false };
  for (let i = 0; i < 10; i++) s = tickPhysics(s, noInput);
  assert('inertia: still moving after 10 neutral ticks', s.speed > 3.0);
}

// Test 7: after 60 neutral ticks from speed=4.0, still has residual momentum
{
  let s = { x:200, y:200, heading:0, speed:4.0, motorState:'neutral', windAngle:0 };
  const noInput = { left:false, right:false, forward:false, reverse:false };
  for (let i = 0; i < 60; i++) s = tickPhysics(s, noInput);
  assert('inertia: has residual speed after 60 ticks', s.speed > 0.5);
}

// Test 8: crosswind (windAngle=π/2, heading=0) → Y displacement > 0.05
{
  const s0 = { x:200, y:200, heading:0, speed:0, motorState:'neutral', windAngle: Math.PI/2 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:false, reverse:false });
  assert('crosswind drift: Y displacement', Math.abs(s1.y - s0.y) > 0.05);
}

// Test 9: reverse cap at -MAX_SPEED * 0.4
{
  const s0 = { x:200, y:200, heading:0, speed:-2.0, motorState:'reverse', windAngle:0 };
  const s1 = tickPhysics(s0, { left:false, right:false, forward:false, reverse:true });
  assert('reverse cap', s1.speed >= -MAX_SPEED * 0.4 - 0.001);
}

console.log(`\nNew features: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
