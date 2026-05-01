<script setup>
import { character, designNotes, profile, profileStory, visualKeywords } from "../data";
</script>

<template>
  <main class="page about-page">
    <div class="about-section-outer">
      <section class="about-hero">
        <div class="hero-copy">
          <p class="eyebrow">About</p>
          <h1>{{ character.name }}</h1>
          <!-- <p class="summary">{{ character.about }}</p> -->
          <p class="profile-roman">{{ character.roman }}</p>
          <p class="profile-line">{{ character.tagline }}</p>
        </div>

        <figure class="turnaround portrait-visual">
          <img src="/assets/character-transparent.png" :alt="`${character.name} 角色主视觉`" />
        </figure>
      </section>
    </div>


    <section class="profile-section">
      <p class="eyebrow">Profile</p>
      <div class="profile-grid" aria-label="人物资料">
        <article v-for="item in profile" :key="item[0]" class="info-card">
          <h3>{{ item[0] }}</h3>
          <p>
            <strong>{{ item[1] }}</strong>
            <span v-if="item[2]">{{ item[2] }}</span>
          </p>
        </article>
      </div>

      <div class="profile-text">
        <p class="eyebrow">Story</p>
        <div class="profile-story-content">
          <p v-for="paragraph in profileStory" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </section>
    <!-- 
    <section class="story-band">
      <p class="eyebrow">Core</p>
      <blockquote>
        {{ character.tagline }}
      </blockquote>
    </section>

    <section class="section two-column">
      <div class="section-title">
        <p class="eyebrow">Design</p>
        <h2>造型记忆点</h2>
      </div>
      <div class="notes">
        <article v-for="[title, text] in designNotes" :key="title" class="note">
          <h3>{{ title }}</h3>
          <p>{{ text }}</p>
        </article>
      </div>
    </section>

    <section class="keyword-cloud" aria-label="角色关键词">
      <span v-for="keyword in visualKeywords" :key="keyword">{{ keyword }}</span>
    </section> -->
  </main>
</template>

<style scoped>
.page {
  padding-bottom: clamp(3rem, 7vw, 5rem);
}

.about-section-outer {
  margin-top: clamp(1rem, 15vw, 22rem);
}

.about-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  /* min-height: clamp(25rem, 36vw, 32rem); */
  margin-top: clamp(2rem, 5vw, 4rem);
  padding: clamp(1.4rem, 4vw, 3.5rem);
  border: 1px solid var(--line);
  border-radius: clamp(1.5rem, 3vw, 2.6rem);
  background: var(--panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
  overflow: visible;
}

.hero-copy {
  position: relative;
  z-index: 2;
  display: flex;
  width: min(36rem, 44%);
  min-width: 0;
  flex-direction: column;
  justify-content: flex-end;
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

.turnaround {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.turnaround img {
  display: block;
  object-fit: contain;
}

.portrait-visual {
  position: absolute;
  right: clamp(2rem, 5vw, 4rem);
  bottom: 0;
  z-index: 3;
  width: min(34rem, 38vw);
  background: transparent;
  pointer-events: none;
  transform: translateX(12%);
}

.portrait-visual img {
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
  object-position: center bottom;
}

.section {
  padding-top: clamp(2.5rem, 6vw, 4.6rem);
}

.profile-section {
  margin-top: clamp(2.5rem, 6vw, 4.6rem);
  padding: clamp(1.35rem, 3.5vw, 2.4rem);
  border-radius: clamp(1.2rem, 2.5vw, 2rem);
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.profile-name {
  margin: 0;
  color: var(--navy);
  font-size: clamp(2.4rem, 5.4vw, 4rem);
  font-weight: 900;
  line-height: 1;
}

.profile-roman {
  margin: 0;
  color: var(--muted);
  font-size: clamp(1.45rem, 3.4vw, 2.4rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.profile-line {
  margin: 0.7rem 0 0;
  color: var(--muted);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.7;
}

.section-title {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 1.1rem;
}

.profile-grid,
.notes {
  display: grid;
  gap: 1rem;
}

.profile-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 2rem;
}

.notes {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card,
.note {
  padding: 1.15rem;
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  background: var(--panel-weak);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.info-card p,
.note p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.info-card {
  min-height: 7.4rem;
  border: 0;
  background: var(--profile-card);
  box-shadow: none;
}

.info-card h3 {
  color: var(--muted);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.info-card strong {
  display: block;
  color: var(--navy);
  font-size: clamp(1.35rem, 2.6vw, 1.8rem);
  line-height: 1.15;
}

.info-card span {
  display: block;
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.95rem;
}

.profile-text {
  /* max-width: 52rem; */
  margin-top: clamp(2.6rem, 6vw, 4.5rem);
}

.profile-text .profile-story-content h2 {
  margin-bottom: 1.6rem;
  color: var(--navy);
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: 0.04em;
}

.profile-text .profile-story-content p {
  margin: 0 0 1.35rem;
  color: var(--muted);
  font-size: clamp(1rem, 1.7vw, 1.18rem);
  line-height: 1.9;
}

.story-band {
  margin-top: clamp(2.5rem, 6vw, 4.6rem);
  padding: clamp(1.3rem, 4vw, 2rem);
  border: 1px solid var(--line);
  border-radius: 1.6rem;
  background: var(--deep-panel);
  box-shadow: 0 10px 24px rgba(34, 56, 102, 0.04);
}

.story-band .eyebrow {
  color: var(--gold);
}

.story-band blockquote {
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.35rem, 3vw, 2.35rem);
  font-weight: 900;
  line-height: 1.35;
}

.keyword-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding-top: clamp(2.4rem, 5vw, 3.4rem);
}

.keyword-cloud span {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  color: var(--chip-text);
  background: var(--chip-bg);
  font-size: 0.92rem;
  font-weight: 900;
}
/* 
@media (max-width: 820px) {
  .about-hero {
    min-height: 0;
    margin-top: 1.25rem;
    padding-bottom: 0;
  }

  .profile-grid,
  .notes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-copy {
    width: 100%;
  }

  .portrait-visual {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    margin-top: 1rem;
    transform: translateX(30%);
  }

  .portrait-visual img {
    width: 70%;
    max-height: none;
  }
}

@media (max-width: 620px) {
  .about-hero {
    flex-direction: column;
    gap: 0;
    min-height: 0;
    padding-bottom: 0;
    overflow: visible;
  }

  .hero-copy {
    width: 100%;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.25rem;
  }

  .summary {
    font-size: 0.95rem;
  }

  .portrait-visual {
    min-height: 0;
  }

  .portrait-visual img {
    height: auto;
    object-position: center bottom;
  }

  .section {
    padding-top: 2.2rem;
  }

  .profile-section {
    margin-top: 2.2rem;
    padding: 1rem;
  }

  .profile-heading {
    gap: 0.55rem;
    padding-bottom: 1.25rem;
  }

  .profile-grid,
  .notes {
    grid-template-columns: 1fr;
  }

  .profile-grid {
    gap: 0.85rem;
    margin-top: 1.35rem;
  }

  .info-card {
    min-height: 0;
  }

  .profile-text {
    margin-top: 2.3rem;
  }

  .profile-text h2 {
    margin-bottom: 1rem;
  }

  .profile-text p {
    font-size: 0.98rem;
    line-height: 1.85;
  }

  .info-card,
  .note {
    padding: 1rem;
  }

  .story-band blockquote {
    font-size: 1.35rem;
  }
} */
</style>
