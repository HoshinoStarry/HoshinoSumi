<script setup>
import AppSection from "../components/AppSection.vue";
import PageBanner from "../components/PageBanner.vue";
import { palette, stickerRules, visualKeywords } from "../data";
</script>

<template>
  <main class="page design-page">
    <PageBanner
      class="design-banner"
      image-src="/assets/sumi-design-banner-cutout.png"
      copy-width-tablet="100%"
      visual-transform-mobile="translateY(5%) translateX(-5%)"
    >
      <template #copy>
        <p class="eyebrow">Design</p>
        <h1>设计</h1>
      </template>
    </PageBanner>


    <AppSection class="section">
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
    </AppSection>

    <AppSection class="section guide-grid">
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
    </AppSection>
  </main>
</template>

<style scoped>
.page {
  padding-bottom: clamp(3rem, 7vw, 5rem);
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

@media (max-width: 1100px) {
  .color-row {
    grid-template-columns: 5rem 1fr 1fr;
  }
}

@media (max-width: 820px) {
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
}

@media (max-width: 620px) {
  h1 {
    font-size: clamp(2.45rem, 11vw, 3rem);
  }
}
</style>
