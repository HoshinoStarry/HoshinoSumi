<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { character } from "./data";

const menuOpen = ref(false);
const themeMode = ref(null);
const systemDark = ref(false);
const themeModes = ["light", "dark"];
const currentYear = new Date().getFullYear();
const githubUrl = "https://github.com/HoshinoStarry/HoshinoSumi";

let mediaQuery;

const closeMenu = () => {
  menuOpen.value = false;
};

const themeLabel = computed(() => {
  if (resolvedTheme.value === "dark") return "深色";
  return "浅色";
});

const resolvedTheme = computed(() => themeMode.value ?? (systemDark.value ? "dark" : "light"));

const applyTheme = () => {
  document.documentElement.dataset.theme = resolvedTheme.value;
  document.documentElement.style.colorScheme = resolvedTheme.value;
};

const cycleTheme = () => {
  const nextTheme = resolvedTheme.value === "dark" ? "light" : "dark";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(() => {
      themeMode.value = nextTheme;
      applyTheme();
    });
    return;
  }

  themeMode.value = nextTheme;
};

onMounted(() => {
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = mediaQuery.matches;

  const syncSystemTheme = (event) => {
    systemDark.value = event.matches;
  };

  mediaQuery.addEventListener("change", syncSystemTheme);
  mediaQuery._sumiSync = syncSystemTheme;
  applyTheme();
});

onBeforeUnmount(() => {
  if (mediaQuery?._sumiSync) {
    mediaQuery.removeEventListener("change", mediaQuery._sumiSync);
  }
});

watch([themeMode, systemDark], () => {
  applyTheme();
});
</script>

<template>
  <header class="site-nav">
    <div class="nav-shell">
      <nav class="nav-links" aria-label="页面导航">
        <RouterLink to="/stickers">贴纸</RouterLink>
        <RouterLink to="/">关于</RouterLink>
        <RouterLink to="/design">设计</RouterLink>
      </nav>
    </div>
    <button class="theme-toggle" type="button" :aria-label="`切换主题，当前为${themeLabel}`" :title="themeLabel" @click="cycleTheme">
      <svg v-if="resolvedTheme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.25 2.76 6.2 6.74.71-5.03 4.55 1.4 6.64L12 16.96l-5.87 3.39 1.4-6.64L2.5 9.16l6.74-.71L12 2.25Z" />
      </svg>
    </button>
  </header>

  <RouterView v-slot="{ Component, route }">
    <Transition name="page-fade" mode="out-in" appear>
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </RouterView>

  <footer class="site-footer">
    <div class="footer-brand">
      <a class="github-link" :href="githubUrl" target="_blank" rel="noreferrer" aria-label="GitHub 仓库" title="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 .5a12 12 0 0 0-3.8 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z"
          />
        </svg>
      </a>
      <span>{{ currentYear }} © HoshinoStarry</span>
    </div>
    <div class="footer-links">
      <span>除有特别声明，本站部分内容使用生成式人工智能生成</span>
    </div>
  </footer>
</template>

<style scoped>
.site-nav {
  position: sticky;
  top: 1rem;
  z-index: 30;
  display: flex;
  width: max-content;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin: 1rem auto 0;
}

.nav-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex: 1 1 auto;
  min-height: 4.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: 3rem;
  background: var(--nav-panel);
  box-shadow: var(--soft-shadow);
  backdrop-filter: blur(5px);
}

.brand,
.nav-links {
  display: flex;
  align-items: center;
}

.brand {
  gap: 0.55rem;
  margin-right: 0.4rem;
  padding: 0 0.75rem;
  color: var(--navy);
  font-weight: 900;
}

.brand-mark {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  place-items: center;
  border-radius: 50%;
  color: var(--navy);
  background: var(--gold);
}

.nav-links {
  gap: 0.2rem;
}

.nav-links a {
  display: grid;
  min-height: 2.6rem;
  place-items: center;
  padding: 0 1rem;
  border-radius: 999px;
  color: var(--nav-text);
  font-size: 0.98rem;
  font-weight: 800;
  transition:
    color 150ms ease,
    background 150ms ease;
}

.nav-links a.router-link-active {
  color: var(--active-text);
  background: var(--active-bg);
}

.nav-links a:hover {
  background: var(--nav-hover-bg);
}

.nav-links a.router-link-active:hover {
  background: var(--active-bg);
}

.theme-toggle {
  display: grid;
  width: 4.5rem;
  min-height: 4.5rem;
  padding: 0.75rem;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 2.25rem;
  color: var(--nav-text);
  background: var(--nav-panel);
  box-shadow: var(--soft-shadow);
  backdrop-filter: blur(5px);
  font-size: 1.15rem;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  transition:
    color 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease;
}

.theme-toggle svg {
  display: block;
  width: 1.35rem;
  height: 1.35rem;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.theme-toggle:hover {
  color: var(--blue-strong);
  border-color: var(--line);
  background: var(--nav-panel);
}

.menu-button {
  display: none;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.menu-button span {
  grid-area: 1 / 1;
  width: 1.25rem;
  height: 0.18rem;
  border-radius: 999px;
  background: var(--active-bg);
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}

.menu-button span:nth-child(1) {
  transform: translateY(-0.42rem);
}

.menu-button span:nth-child(3) {
  transform: translateY(0.42rem);
}

.is-open .menu-button span:nth-child(1) {
  transform: rotate(45deg);
}

.is-open .menu-button span:nth-child(2) {
  opacity: 0;
}

.is-open .menu-button span:nth-child(3) {
  transform: rotate(-45deg);
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(2rem, 5vw, 4rem);
  padding: 1.4rem clamp(1rem, 5vw, 4rem);
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 800;
  background: var(--footer-bg);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.9rem;
  text-align: right;
}

.github-link {
  display: grid;
  flex: 0 0 auto;
  width: 2.1rem;
  height: 2.1rem;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: var(--muted);
  background: transparent;
  transition:
    color 150ms ease;
}

.github-link svg {
  width: 1.18rem;
  height: 1.18rem;
  fill: currentColor;
}

.github-link:hover {
  color: var(--blue-strong);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(1.6rem);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-1.2rem);
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: opacity 1ms linear;
  }

  .page-fade-enter-from,
  .page-fade-leave-to {
    transform: none;
  }
}

@media (max-width: 620px) {
  .site-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .footer-links {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }
}

/* @media (max-width: 820px) {
  .site-nav {
    width: min(100% - 1rem, 54rem);
  }

  .nav-shell {
    justify-content: space-between;
    flex-wrap: wrap;
    border-radius: 1.75rem;
  }

  .menu-button {
    display: grid;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    padding: 0.6rem 0.2rem 0.15rem;
    border-top: 1px solid transparent;
  }

  .is-open .nav-links {
    display: flex;
    border-color: var(--line);
  }

  .nav-links a {
    width: 100%;
    min-height: 3.25rem;
    font-size: 1.1rem;
  }
} */
</style>
