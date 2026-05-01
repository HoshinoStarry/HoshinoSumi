<script setup>
import { palette, stickerRules, visualKeywords } from "../data";
</script>

<template>
  <main class="page design-page">
    <div class="design-section-outer">
      <section class="page-head design-hero">
        <div class="hero-copy">
          <p class="eyebrow">Design</p>
          <h1>设计</h1>
        </div>
        <figure class="design-banner" aria-hidden="true">
          <img src="/assets/sumi-design-banner-cutout.png" alt="" />
        </figure>
      </section>
    </div>


    <section class="section">
      <div class="section-title">
        <p class="eyebrow">Palette</p>
        <h2>人物色系配色表</h2>
      </div>
      <div class="palette" aria-label="人物色系配色表">
        <article v-for="[name, hex, role, usage, avoid] in palette" :key="hex" class="color-row">
          <span class="swatch" :style="{ '--swatch': hex }" aria-hidden="true"></span>
          <div>
            <strong>{{ name }}</strong>
            <code>{{ hex }}</code>
          </div>
          <p>{{ role }}</p>
          <p>{{ usage }}</p>
          <p>{{ avoid }}</p>
        </article>
      </div>
    </section>

    <section class="section guide-grid">
      <div>
        <div class="section-title">
          <p class="eyebrow">Sticker Rules</p>
          <h2>贴纸制作规范</h2>
        </div>
        <div class="notes">
          <article v-for="[title, text] in stickerRules" :key="title" class="note">
            <h3>{{ title }}</h3>
            <p>{{ text }}</p>
          </article>
        </div>
      </div>

      <div>
        <div class="section-title">
          <p class="eyebrow">Identity</p>
          <h2>视觉关键词</h2>
        </div>
        <div class="identity-list">
          <span v-for="keyword in visualKeywords" :key="keyword">{{ keyword }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding-bottom: clamp(3rem, 7vw, 5rem);
}

.design-section-outer {
  margin-top: clamp(1rem, 12vw, 22rem);
}

.page-head {
  position: relative;
  margin-top: clamp(2rem, 5vw, 4rem);
  padding: clamp(1.4rem, 4vw, 3.5rem);
  border: 1px solid var(--line);
  border-radius: clamp(1.5rem, 3vw, 2.6rem);
  background: var(--panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
  overflow: hidden;
}

.design-hero {
  display: flex;
  /* min-height: clamp(25rem, 36vw, 32rem); */
  padding: clamp(1.4rem, 4vw, 3.5rem);
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  overflow: visible;
}

.hero-copy {
  position: relative;
  z-index: 2;
  width: min(36rem, 44%);
  min-width: 0;
}

.design-banner {
  position: absolute;
  right: clamp(2rem, 5vw, 4rem);
  bottom: 0;
  z-index: 3;
  display: block;
  width: min(38rem, 42vw);
  margin: 0;
  background: transparent;
  pointer-events: none;
  transform: translateY(5%) translateX(5%);
}

.design-banner img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.eyebrow {
  margin: 0 0 0.65rem;
  color: var(--blue-strong);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--navy);
  font-size: 4rem;
  line-height: 0.98;
  font-weight: 900;
}

h2 {
  margin: 0;
  color: var(--navy);
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  line-height: 1.06;
  font-weight: 900;
}

h3 {
  margin: 0 0 0.45rem;
  color: var(--navy);
  font-size: 1.04rem;
  font-weight: 900;
}

.summary {
  max-width: 36rem;
  margin: 1rem 0 0;
  color: var(--summary);
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.8;
}

.section {
  margin-top: clamp(1.2rem, 4vw, 2.5rem);
  padding: clamp(1.2rem, 3vw, 2rem);
  border: 1px solid var(--line);
  border-radius: clamp(1.5rem, 3vw, 2.4rem);
  background: var(--panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.section-title {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 1.1rem;
}

.palette {
  display: grid;
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  background: var(--panel-blue);
  overflow: hidden;
}

.color-row {
  display: grid;
  grid-template-columns: 5.2rem minmax(7rem, 0.85fr) minmax(8rem, 0.7fr) minmax(12rem, 1.05fr) minmax(10rem, 1fr);
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
}

.color-row:last-child {
  border-bottom: 0;
}

.swatch {
  display: block;
  width: 100%;
  height: 3rem;
  border: 1px solid var(--swatch-border);
  border-radius: 0.9rem;
  background: var(--swatch);
}

.color-row strong {
  display: block;
  color: var(--navy);
  font-size: 1.02rem;
  font-weight: 900;
}

.color-row code {
  display: inline-block;
  margin-top: 0.2rem;
  color: var(--violet);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-weight: 800;
}

.color-row p,
.note p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.guide-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(16rem, 0.85fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
}

.notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.note {
  padding: 1.15rem;
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  background: var(--panel-blue);
}

.identity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 1.1rem;
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  background: var(--panel-blue);
}

.identity-list span {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  color: var(--chip-text);
  background: var(--chip-bg);
  font-size: 0.92rem;
  font-weight: 900;
}

/* @media (max-width: 1100px) {
  .color-row {
    grid-template-columns: 5rem 1fr 1fr;
  }
}

@media (max-width: 820px) {
  .design-hero {
    min-height: 0;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 0;
  }

  .hero-copy {
    width: 100%;
  }

  .design-banner {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    margin-top: 1rem;
    transform: translateY(5%) translateX(30%);
  }

  .design-banner img {
    width: 70%;
    max-height: none;
    height: auto;
    object-fit: contain;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }

  .notes {
    grid-template-columns: 1fr;
  }

  .color-row {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
} */
</style>
