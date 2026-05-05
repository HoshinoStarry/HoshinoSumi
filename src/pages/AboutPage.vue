<script setup>
import AppSection from "../components/AppSection.vue";
import PageBanner from "../components/PageBanner.vue";
import { character, designNotes, profile, profileStory, visualKeywords } from "../data";
import characterVisual from "../../assets/character-transparent.png";
</script>

<template>
  <main class="page about-page">
    <PageBanner
      class="about-banner"
      :image-src="characterVisual"
      :image-alt="`${character.name} 角色主视觉`"
      outer-margin-top="clamp(1rem, 15vw, 22rem)"
      visual-width="min(34rem, 38vw)"
      visual-transform="translateX(12%)"
    >
      <template #copy>
        <p class="eyebrow">About</p>
        <h1>{{ character.name }}</h1>
        <p class="banner-roman">{{ character.roman }}</p>
        <p class="banner-line">{{ character.tagline }}</p>
      </template>
    </PageBanner>


    <AppSection class="profile-section" spacing="loose" radius="soft" margin-top-mobile="2.2rem">
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

.banner-roman {
  margin: 0;
  color: var(--muted);
  font-size: clamp(1.45rem, 3.4vw, 2.4rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.banner-line {
  margin: 0.7rem 0 0;
  color: var(--muted);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 1.7;
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

.profile-section {
  transition:
    background 240ms ease,
    border-color 240ms ease;
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

@media (max-width: 620px) {
  h1 {
    font-size: clamp(2.45rem, 11vw, 3rem);
  }

  .banner-roman {
    font-size: clamp(1.05rem, 5.2vw, 1.45rem);
  }

  .banner-line {
    font-size: clamp(0.98rem, 4.6vw, 1.12rem);
  }

  h2 {
    font-size: 2.25rem;
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
}
</style>
