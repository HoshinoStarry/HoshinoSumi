<script setup>
import AppSection from "../components/AppSection.vue";
import Live2DCanvas from "../components/Live2DCanvas.vue";
</script>

<template>
  <main class="live2d-page">
    <header class="page-heading">
      <div><p class="eyebrow">Interactive</p><h1>互动模型</h1></div>
      <p>视线会跟随指针，支持眨眼、说话、挥手、关节调整与服饰开关。</p>
    </header>
    <AppSection class="model-section" spacing="none" padding="clamp(.65rem, 1.5vw, 1rem)" padding-mobile=".5rem">
      <Live2DCanvas />
    </AppSection>
  </main>
</template>

<style scoped>
.live2d-page { padding: clamp(3rem, 8vw, 7rem) 0 clamp(3rem, 7vw, 5rem); }
.page-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; padding: 0 clamp(.2rem, 1.5vw, 1rem); }
.eyebrow { margin: 0 0 .65rem; color: var(--blue-strong); font-size: .78rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 0; color: var(--navy); font-size: clamp(2.8rem, 6vw, 4.8rem); line-height: .98; font-weight: 900; }
.page-heading > p { max-width: 30rem; margin: 0; color: var(--muted); font-size: clamp(.95rem, 1.5vw, 1.08rem); line-height: 1.8; }
.model-section { margin-top: clamp(1.3rem, 3vw, 2rem); overflow: hidden; }
@media (max-width: 720px) { .live2d-page { padding-top: 2rem; }.page-heading { display: grid; gap: .8rem; } }
</style>
