<script setup>
import { ref } from "vue";
import { character, stickers } from "../data";

const bannerVisible = ref(true);
const statusById = ref({});

const copySticker = async (sticker) => {
  statusById.value = { ...statusById.value, [sticker.id]: "copying" };

  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("Clipboard image copy is not supported.");
    }

    const response = await fetch(sticker.src);
    const blob = await response.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type || "image/png"]: blob })]);
    statusById.value = { ...statusById.value, [sticker.id]: "copied" };
  } catch {
    statusById.value = { ...statusById.value, [sticker.id]: "failed" };
  } finally {
    window.setTimeout(() => {
      const next = { ...statusById.value };
      delete next[sticker.id];
      statusById.value = next;
    }, 1100);
  }
};
</script>

<template>
  <main class="home-page">
    <div class="hero-section-outer">
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">Stickers</p>
          <h1>贴纸</h1>
          <div class="cta-group">
            <a href="https://t.me/addstickers/hoshino_sumi_1_by_hsnsty_slavebot" target="_blank" class="tg-button">
              <svg class="tg-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              添加到 Telegram
            </a>
          </div>
        </div>

        <figure class="banner-slot" :class="{ 'is-empty': !bannerVisible }">
          <img v-if="bannerVisible" src="/assets/sumi-banner.png" :alt="`${character.name} 贴纸横幅`"
            @error="bannerVisible = false" />
        </figure>
      </section>
    </div>

    <!-- <section class="stats" aria-label="贴纸统计">
      <article>
        <strong>{{ stickers.length }}</strong>
        <span>张透明 PNG</span>
      </article>
      <article>
        <strong>Emoji</strong>
        <span>情绪标签</span>
      </article>
      <article>
        <strong>Click</strong>
        <span>点击复制</span>
      </article>
    </section> -->

    <section class="sticker-section" aria-label="贴纸列表">
      <div v-for="sticker in stickers" :key="sticker.id" class="sticker-wrapper">
        <button class="sticker-card" type="button" :data-state="statusById[sticker.id]"
          :aria-label="`复制${sticker.name}`" @click="copySticker(sticker)">
          <span class="sticker-number" aria-hidden="true">{{ sticker.number }}</span>
          <span class="sticker-image">
            <img :src="sticker.src" :alt="sticker.name" loading="lazy" decoding="async" />
          </span>
          <span class="emoji-row" aria-hidden="true">{{ sticker.emoji.join(" ") }}</span>
          <span class="sticker-name">{{ sticker.name }}</span>
        </button>
        <span class="card-offset" aria-hidden="true"></span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page {
  padding-bottom: clamp(3rem, 6vw, 5rem);
  overflow-x: clip;
}

.hero-section-outer {
  margin-top: clamp(1rem, 12vw, 22rem);
}

.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: clamp(1.4rem, 4vw, 3.5rem);
  border: 1px solid var(--line);
  border-radius: clamp(1.5rem, 3vw, 2.6rem);
  background: var(--panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
  overflow: visible;
}

.hero-copy {
  position: relative;
  z-index: 1;
  width: min(36rem, 44%);
  min-width: 0;
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

.cta-group {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.tg-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.4rem;
  background: #24A1DE;
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 800;
  font-size: 0.95rem;
  transition: transform 0.2s ease, background 0.2s ease;
  box-shadow: 0 4px 12px rgba(36, 161, 222, 0.2);
}

.tg-button:hover {
  background: #1e88bc;
  transform: translateY(-2px);
}

.tg-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.summary {
  max-width: 34rem;
  margin: 1.2rem 0 0;
  color: var(--summary);
  font-size: clamp(1.02rem, 1.35vw, 1.28rem);
  line-height: 1.8;
}

.banner-slot {
  position: absolute;
  right: clamp(2rem, 5vw, 4rem);
  bottom: 0;
  z-index: 3;
  display: block;
  width: min(38rem, 42vw);
  margin: 0;
  background: transparent;
  pointer-events: none;
  transform: translateY(6.9%) translateX(5%);
}

.banner-slot img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
}

.stats article {
  display: grid;
  gap: 0.2rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  background: var(--panel-weak);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.stats strong {
  color: var(--navy);
  font-size: clamp(1.45rem, 3vw, 2.25rem);
  line-height: 1;
  font-weight: 900;
}

.stats span {
  color: var(--muted);
  font-size: 0.94rem;
  font-weight: 800;
}

.sticker-section {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(0.8rem, 1.6vw, 1.15rem);
  margin-top: clamp(1.2rem, 4vw, 2.5rem);
  padding: clamp(1rem, 2.5vw, 1.8rem);
  border: 1px solid var(--line);
  border-radius: clamp(1.5rem, 3vw, 2.4rem);
  background: var(--panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.sticker-wrapper {
  position: relative;
}

.sticker-card,
.card-offset {
  border-radius: clamp(1.25rem, 2.5vw, 2rem);
}

.sticker-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  padding: clamp(0.9rem, 2vw, 1.25rem);
  border: 0;
  color: var(--ink);
  background: var(--panel-blue);
  cursor: pointer;
  transition:
    transform 190ms ease,
    background 190ms ease;
}

.card-offset {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--panel-offset);
  opacity: 0;
  transition: opacity 190ms ease;
}

.sticker-wrapper:hover .sticker-card {
  background: var(--chip-bg);
  transform: translate(-0.5rem, -0.5rem);
}

.sticker-wrapper:hover .card-offset {
  opacity: 1;
}

.sticker-image {
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  place-items: center;
}

.sticker-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sticker-number {
  position: absolute;
  top: 0.85rem;
  left: 0.95rem;
  color: rgba(34, 56, 102, 0.34);
  font-size: 0.78rem;
  font-weight: 900;
}

.emoji-row {
  min-height: 1.75rem;
  margin-top: 0.55rem;
  font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
  font-weight: 400;
  font-size: 1.42rem;
  line-height: 1;
}

.sticker-name {
  display: block;
  margin-top: 0.45rem;
  color: var(--muted);
  font-size: 0.92rem;
  font-weight: 800;
  text-align: center;
}

.sticker-card::after {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  content: "";
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  color: var(--navy);
  background: var(--chip-bg);
  font-size: 0.74rem;
  font-weight: 900;
  opacity: 0;
  transform: translateY(0.18rem);
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.sticker-card[data-state="copying"]::after {
  content: "复制中";
  opacity: 1;
  transform: translateY(0);
}

.sticker-card[data-state="copied"]::after {
  content: "已复制";
  color: var(--success);
  opacity: 1;
  transform: translateY(0);
}

.sticker-card[data-state="failed"]::after {
  content: "失败";
  color: var(--danger);
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1100px) {
  .sticker-section {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  /* .hero-section {
    min-height: 0;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 0;
  }

  .hero-copy {
    width: 100%;
  }

  .banner-slot {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    margin-top: 1rem;
    transform: translateY(6.9%) translateX(30%);
  }

  .banner-slot img {
    width: 70%;
    max-height: none;
  } */

  .stats {
    grid-template-columns: 1fr;
  }

  .sticker-section {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
