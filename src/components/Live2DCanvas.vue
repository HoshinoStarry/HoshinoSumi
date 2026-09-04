<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

const canvas = ref(null);
const stage = ref(null);
const ready = ref(false);
const failed = ref(false);
const jointMode = ref(false);
const talking = ref(false);
const toggles = reactive({ hoodie: true, shorts: true, socks: true, shoes: true, ornaments: true });

let model;
let loaded = [];
let context;
let animationFrame;
let nextBlink = performance.now() + 1300;
let blinkStart = -9999;
let blinkNow = false;
let waveStart = 0;
let drag = null;
let gazeX = 0;
let gazeY = 0;
let targetGazeX = 0;
let targetGazeY = 0;
const angles = {};

const identity = () => [1, 0, 0, 1, 0, 0];
const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
const translate = (x, y) => [1, 0, 0, 1, x, y];
const rotate = (value) => {
  const cosine = Math.cos(value);
  const sine = Math.sin(value);
  return [cosine, sine, -sine, cosine, 0, 0];
};
const scale = (x, y) => [x, 0, 0, y, 0, 0];
const around = (pivot, matrix) => multiply(multiply(translate(pivot[0], pivot[1]), matrix), translate(-pivot[0], -pivot[1]));
const transformPoint = (matrix, point) => [matrix[0] * point[0] + matrix[2] * point[1] + matrix[4], matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]];
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const smooth = (value, target, amount) => value + (target - value) * amount;
const editableBones = ["head", "upperArmL", "forearmL", "handL", "upperArmR", "forearmR", "handR", "thighL", "calfL", "footL", "thighR", "calfR", "footR"];

const boneMatrix = (name, cache, time) => {
  if (cache[name]) return cache[name];
  const bone = model.bones[name];
  let parent = bone.parent ? boneMatrix(bone.parent, cache, time) : identity();
  let degrees = angles[name] || 0;
  if (name === "head" && !jointMode.value) degrees += gazeX * 7;
  if (name === "hairBunL") degrees += Math.sin(time * 0.0021) * 2.5;
  if (name === "hairBunR") degrees -= Math.sin(time * 0.0021) * 2.5;
  if (name === "hairSideL") degrees += Math.sin(time * 0.0018) * 2;
  if (name === "hairSideR") degrees -= Math.sin(time * 0.0018) * 2;
  if (name === "root") {
    const breath = 1 + Math.sin(time * 0.0017) * 0.0035;
    parent = multiply(parent, around(bone.pivot, scale(1, breath)));
  }
  cache[name] = multiply(parent, around(bone.pivot, rotate((degrees * Math.PI) / 180)));
  return cache[name];
};

const blinkValue = (time) => {
  if (time > nextBlink && !blinkNow) {
    blinkStart = time;
    blinkNow = true;
    nextBlink = time + 2200 + Math.random() * 2600;
  }
  const progress = (time - blinkStart) / 170;
  if (progress < 0 || progress > 1) {
    if (progress > 1) blinkNow = false;
    return 0;
  }
  return progress < 0.5 ? progress * 2 : (1 - progress) * 2;
};

const jointWorld = (name, cache, time) => {
  const bone = model.bones[name];
  const parentMatrix = bone.parent ? boneMatrix(bone.parent, cache, time) : identity();
  return transformPoint(parentMatrix, bone.pivot);
};

const drawHandles = (cache, time) => {
  context.save();
  context.lineWidth = 2.5;
  for (const name of editableBones) {
    const point = jointWorld(name, cache, time);
    context.beginPath();
    context.arc(point[0], point[1], 13, 0, Math.PI * 2);
    context.fillStyle = drag?.bone === name ? "#247fc9" : "rgba(105, 180, 238, .94)";
    context.fill();
    context.strokeStyle = "#ffffff";
    context.stroke();
  }
  context.restore();
};

const drawModel = (time) => {
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);
  const cache = {};
  const blink = blinkValue(time);
  for (const part of loaded) {
    if (part.toggle && !toggles[part.toggle]) continue;
    if (part.feature?.includes("closed") && blink < 0.58) continue;
    if (part.feature?.includes("open") && blink >= 0.74) continue;
    if (part.feature === "mouth-open" && !talking.value) continue;
    if (part.feature === "mouth-closed" && talking.value) continue;
    let matrix = boneMatrix(part.bone, cache, time);
    const pivot = part.pivot || [part.x + part.w / 2, part.y + part.h / 2];
    if (part.feature?.includes("eye-") && !part.feature.includes("closed")) matrix = multiply(matrix, around(pivot, scale(1, Math.max(0.08, 1 - blink))));
    if (part.feature?.includes("iris")) matrix = multiply(matrix, translate(gazeX * 6, gazeY * 4));
    if (part.feature === "mouth-open") matrix = multiply(matrix, around(pivot, scale(1, 0.55 + 0.35 * Math.sin(time * 0.018))));
    context.save();
    context.setTransform(...matrix);
    context.drawImage(part.image, part.x, part.y);
    context.restore();
  }
  if (jointMode.value) drawHandles(cache, time);
};

const resetPose = (resetFace = true) => {
  Object.keys(angles).forEach((name) => { angles[name] = 0; });
  waveStart = 0;
  if (resetFace) talking.value = false;
};

const updateMotion = (time) => {
  gazeX = smooth(gazeX, targetGazeX, 0.09);
  gazeY = smooth(gazeY, targetGazeY, 0.09);
  if (!waveStart) return;
  const progress = (time - waveStart) / 1000;
  if (progress < 2.8) {
    angles.upperArmR = smooth(angles.upperArmR, -46, 0.12);
    angles.forearmR = smooth(angles.forearmR, 58 + Math.sin(progress * 12) * 14, 0.18);
    angles.handR = Math.sin(progress * 15) * 15;
  } else resetPose(false);
};

const render = (time) => {
  updateMotion(time);
  drawModel(time);
  animationFrame = requestAnimationFrame(render);
};

const triggerBlink = () => {
  blinkStart = performance.now();
  blinkNow = true;
  nextBlink = performance.now() + 2500;
};
const wave = () => { waveStart = performance.now(); };
const toggleTalk = () => { talking.value = !talking.value; };

const eventPoint = (event) => {
  const bounds = canvas.value.getBoundingClientRect();
  return [((event.clientX - bounds.left) / bounds.width) * model.canvas[0], ((event.clientY - bounds.top) / bounds.height) * model.canvas[1]];
};

const onPointerMove = (event) => {
  if (!model) return;
  const point = eventPoint(event);
  if (drag) {
    const bone = model.bones[drag.bone];
    angles[drag.bone] = clamp(drag.startAngle + (point[0] - drag.startX) * 0.28, bone.min, bone.max);
    return;
  }
  targetGazeX = clamp((point[0] - 512) / 330, -1, 1);
  targetGazeY = clamp((point[1] - 240) / 300, -1, 1);
};

const onPointerDown = (event) => {
  if (!jointMode.value) { triggerBlink(); return; }
  const point = eventPoint(event);
  const cache = {};
  let hit = null;
  let bestDistance = 36;
  for (const name of editableBones) {
    const joint = jointWorld(name, cache, performance.now());
    const distance = Math.hypot(point[0] - joint[0], point[1] - joint[1]);
    if (distance < bestDistance) { bestDistance = distance; hit = name; }
  }
  if (hit) {
    drag = { bone: hit, startX: point[0], startAngle: angles[hit] || 0 };
    stage.value.setPointerCapture(event.pointerId);
  }
};

const onPointerUp = (event) => {
  drag = null;
  try { stage.value.releasePointerCapture(event.pointerId); } catch { /* already released */ }
};
const onPointerLeave = () => { if (!drag) { targetGazeX = 0; targetGazeY = 0; } };
const onKeydown = (event) => {
  if (/input/i.test(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  if (key === "b") triggerBlink();
  if (key === "w") wave();
  if (key === "t") toggleTalk();
  if (key === "j") jointMode.value = !jointMode.value;
  if (key === "r") resetPose();
};

onMounted(async () => {
  context = canvas.value.getContext("2d", { alpha: true });
  try {
    model = await fetch("/live2d/model/model.json").then((response) => {
      if (!response.ok) throw new Error("Model manifest unavailable");
      return response.json();
    });
    Object.keys(model.bones).forEach((name) => { angles[name] = 0; });
    loaded = await Promise.all(model.parts.map(async (part) => {
      const image = new Image();
      image.src = part.file;
      await image.decode();
      return { ...part, image };
    }));
    ready.value = true;
    window.addEventListener("keydown", onKeydown);
    animationFrame = requestAnimationFrame(render);
  } catch (error) {
    console.error(error);
    failed.value = true;
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="model-workspace">
    <div ref="stage" class="model-stage" :class="{ editing: jointMode, dragging: Boolean(drag) }" @pointermove="onPointerMove" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="onPointerUp" @pointerleave="onPointerLeave">
      <canvas ref="canvas" width="1024" height="1536" aria-label="可交互的星野澄全身模型"></canvas>
      <p v-if="!ready && !failed" class="stage-status">正在载入模型…</p>
      <p v-if="failed" class="stage-status error">模型载入失败，请刷新页面重试。</p>
      <p v-if="ready" class="stage-hint">{{ jointMode ? "拖动蓝色关节点调整姿势" : "移动指针控制视线 · 点击角色眨眼" }}</p>
    </div>

    <aside class="model-controls" aria-label="模型控制面板">
      <section>
        <p class="control-label">动作</p>
        <div class="action-grid">
          <button type="button" class="primary" @click="triggerBlink">眨眼</button>
          <button type="button" @click="wave">挥手</button>
          <button type="button" :class="{ primary: talking }" @click="toggleTalk">说话</button>
          <button type="button" @click="resetPose">复位</button>
        </div>
      </section>

      <section class="control-row">
        <div><p class="control-label">关节编辑</p><p class="control-note">拖动关节点，调整头、手臂和双腿</p></div>
        <label class="switch"><input v-model="jointMode" type="checkbox" /><span aria-hidden="true"></span><span class="sr-only">开启关节编辑</span></label>
      </section>

      <section>
        <p class="control-label">可脱服饰</p>
        <div class="outfit-list">
          <label><span>连帽衫</span><input v-model="toggles.hoodie" type="checkbox" /></label>
          <label><span>外层短裤</span><input v-model="toggles.shorts" type="checkbox" /></label>
          <label><span>袜套</span><input v-model="toggles.socks" type="checkbox" /></label>
          <label><span>鞋子</span><input v-model="toggles.shoes" type="checkbox" /></label>
          <label><span>头饰</span><input v-model="toggles.ornaments" type="checkbox" /></label>
        </div>
        <p class="control-note safe">关闭外衣后保留运动背心与安全裤内搭。</p>
      </section>

      <section class="downloads">
        <p class="control-label">制作文件</p>
        <a href="/live2d/downloads/Live2D_Cubism绑定规格.json" download>Cubism 绑定规格</a>
      </section>
      <p class="shortcuts">B 眨眼 · W 挥手 · T 说话 · J 关节 · R 复位</p>
    </aside>
  </div>
</template>

<style scoped>
.model-workspace { display: grid; grid-template-columns: minmax(0, 1fr) 18rem; gap: clamp(1rem, 2.5vw, 1.6rem); }
.model-stage, .model-controls { border: 1px solid var(--line); border-radius: clamp(1.3rem, 2.5vw, 2rem); background: var(--panel-weak); }
.model-stage { position: relative; display: grid; min-height: 44rem; place-items: center; overflow: hidden; background: radial-gradient(ellipse at 50% 38%, rgba(255,255,255,.94), rgba(220,238,255,.54) 61%, rgba(142,199,255,.18)), var(--panel-blue); touch-action: none; }
.model-stage::after { position: absolute; right: 18%; bottom: 3.5%; left: 18%; height: 4.5%; border-radius: 50%; background: radial-gradient(ellipse, rgba(34,56,102,.16), transparent 70%); content: ""; filter: blur(12px); pointer-events: none; }
canvas { position: relative; z-index: 1; display: block; width: auto; max-width: 100%; height: min(76vh, 49rem); max-height: 100%; aspect-ratio: 2 / 3; }
.editing canvas { cursor: grab; }.dragging canvas { cursor: grabbing; }
.stage-status, .stage-hint { position: absolute; z-index: 3; bottom: .85rem; left: 50%; margin: 0; padding: .48rem .78rem; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); background: var(--panel); font-size: .76rem; font-weight: 800; white-space: nowrap; transform: translateX(-50%); }
.stage-status.error { color: var(--danger); }
.model-controls { align-self: center; padding: 1.15rem; }
.model-controls section { padding: 0 0 1rem; margin: 0 0 1rem; border-bottom: 1px solid var(--line); }.model-controls section:last-of-type { margin-bottom: .8rem; }
.control-label { margin: 0; color: var(--blue-strong); font-size: .72rem; font-weight: 900; letter-spacing: .09em; text-transform: uppercase; }.control-note { margin: .28rem 0 0; color: var(--muted); font-size: .72rem; line-height: 1.55; }.control-note.safe { margin-top: .55rem; }
.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-top: .7rem; }
button, .downloads a { display: grid; min-height: 2.55rem; place-items: center; border: 1px solid var(--line); border-radius: .9rem; color: var(--navy); background: var(--chip-bg); font-size: .84rem; font-weight: 900; cursor: pointer; transition: transform 160ms ease, border-color 160ms ease, background 160ms ease; }
button:hover, .downloads a:hover { border-color: var(--blue-strong); transform: translateY(-1px); }button.primary { border-color: transparent; color: #fff; background: var(--blue-strong); }
.control-row { display: flex; align-items: center; justify-content: space-between; gap: .8rem; }.switch input { position: absolute; opacity: 0; }.switch > span:first-of-type { position: relative; display: block; width: 2.7rem; height: 1.55rem; border-radius: 99px; background: var(--line); cursor: pointer; transition: background 160ms ease; }.switch > span:first-of-type::after { position: absolute; top: .2rem; left: .2rem; width: 1.15rem; height: 1.15rem; border-radius: 50%; background: #fff; box-shadow: 0 2px 8px rgba(34,56,102,.2); content: ""; transition: transform 160ms ease; }.switch input:checked + span { background: var(--blue-strong); }.switch input:checked + span::after { transform: translateX(1.15rem); }
.outfit-list { display: grid; gap: .25rem; margin-top: .55rem; }.outfit-list label { display: flex; min-height: 2.1rem; align-items: center; justify-content: space-between; color: var(--summary); font-size: .82rem; font-weight: 800; }.outfit-list input { width: 1.1rem; height: 1.1rem; accent-color: var(--blue-strong); }
.downloads { display: grid; gap: .5rem; }.downloads .control-label { margin-bottom: .15rem; }.downloads a { background: var(--panel-blue); }.shortcuts { margin: 0; color: var(--muted); font-size: .65rem; line-height: 1.6; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width: 820px) { .model-workspace { grid-template-columns: 1fr; }.model-stage { min-height: 38rem; }.model-controls { align-self: stretch; }canvas { height: min(68vh, 43rem); } }
@media (max-width: 520px) { .model-stage { min-height: 31rem; }canvas { height: min(61vh, 35rem); }.stage-hint { max-width: calc(100% - 1rem); white-space: normal; text-align: center; } }
</style>
