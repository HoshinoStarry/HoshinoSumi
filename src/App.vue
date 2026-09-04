<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();
const menuOpen = ref(false);
const themeMode = ref(null);
const systemDark = ref(false);
const navHidden = ref(false);
const pageTransitionName = ref("page-forward");
const themeModes = ["light", "dark"];
const currentYear = new Date().getFullYear();
const githubUrl = "https://github.com/HoshinoStarry/HoshinoSumi";
const navItems = [
  {
    label: "贴纸",
    to: "/stickers",
    isActive: (path) => path.startsWith("/stickers"),
  },
  {
    label: "关于",
    to: "/",
    isActive: (path) => path === "/",
  },
  {
    label: "互动",
    to: "/live2d",
    isActive: (path) => path.startsWith("/live2d"),
  },
  {
    label: "设计",
    to: "/design",
    isActive: (path) => path.startsWith("/design") || path.startsWith("/palette"),
  },
];

let mediaQuery;
let lastScrollY = 0;
let scrollFrame = null;

const closeMenu = () => {
  menuOpen.value = false;
};

const themeLabel = computed(() => {
  if (resolvedTheme.value === "dark") return "深色";
  return "浅色";
});

const resolvedTheme = computed(() => themeMode.value ?? (systemDark.value ? "dark" : "light"));
const activeNavIndex = computed(() => {
  const matchedIndex = navItems.findIndex((item) => item.isActive(route.path));
  return matchedIndex === -1 ? 0 : matchedIndex;
});

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

const syncNavVisibility = () => {
  if (scrollFrame !== null) return;

  scrollFrame = window.requestAnimationFrame(() => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY < 40) {
      navHidden.value = false;
    } else if (scrollDelta > 8) {
      navHidden.value = true;
    } else if (scrollDelta < -8) {
      navHidden.value = false;
    }

    lastScrollY = currentScrollY;
    scrollFrame = null;
  });
};

onMounted(() => {
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = mediaQuery.matches;
  lastScrollY = Math.max(window.scrollY, 0);

  const syncSystemTheme = (event) => {
    systemDark.value = event.matches;
  };

  mediaQuery.addEventListener("change", syncSystemTheme);
  window.addEventListener("scroll", syncNavVisibility, { passive: true });
  mediaQuery._sumiSync = syncSystemTheme;
  applyTheme();
});

onBeforeUnmount(() => {
  if (mediaQuery?._sumiSync) {
    mediaQuery.removeEventListener("change", mediaQuery._sumiSync);
  }

  window.removeEventListener("scroll", syncNavVisibility);

  if (scrollFrame !== null) {
    window.cancelAnimationFrame(scrollFrame);
  }
});

watch([themeMode, systemDark], () => {
  applyTheme();
});

watch(
  activeNavIndex,
  (nextIndex, previousIndex) => {
    if (previousIndex === undefined || nextIndex === previousIndex) return;
    pageTransitionName.value = nextIndex > previousIndex ? "page-forward" : "page-back";
  },
  { flush: "sync" },
);
</script>

<template>
  <header class="site-nav" :class="{ 'is-hidden': navHidden }">
    <div class="nav-shell">
      <nav class="nav-links" aria-label="页面导航" :style="{ '--active-index': activeNavIndex, '--nav-count': navItems.length }">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
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
    <Transition :name="pageTransitionName" mode="out-in" appear>
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
  opacity: 1;
  transition:
    opacity 180ms ease,
    top 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-nav.is-hidden {
  top: -6rem;
  opacity: 0;
  pointer-events: none;
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
  position: relative;
  display: grid;
  width: 100%;
  --nav-gap: 0.2rem;
  grid-template-columns: repeat(var(--nav-count), minmax(0, 1fr));
  gap: var(--nav-gap);
  isolation: isolate;
}

.nav-links::before {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 0;
  width: calc((100% + var(--nav-gap)) / var(--nav-count) - var(--nav-gap));
  border-radius: 999px;
  background: var(--active-bg);
  content: "";
  transform: translateX(calc(var(--active-index) * (100% + var(--nav-gap))));
  transition:
    background 150ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-links a {
  position: relative;
  z-index: 1;
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
  background: transparent;
}

.nav-links a:hover {
  background: var(--nav-hover-bg);
}

.nav-links a.router-link-active:hover {
  background: transparent;
}

.theme-toggle {
  display: grid;
  flex: 0 0 auto;
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

.page-forward-enter-active,
.page-forward-leave-active,
.page-back-enter-active,
.page-back-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.page-forward-enter-from {
  opacity: 0;
  transform: translateX(1.6rem);
}

.page-forward-leave-to {
  opacity: 0;
  transform: translateX(-1.2rem);
}

.page-back-enter-from {
  opacity: 0;
  transform: translateX(-1.6rem);
}

.page-back-leave-to {
  opacity: 0;
  transform: translateX(1.2rem);
}

@media (prefers-reduced-motion: reduce) {
  .site-nav {
    transition: none;
  }

  .nav-links::before {
    transition: none;
  }

  .page-forward-enter-active,
  .page-forward-leave-active,
  .page-back-enter-active,
  .page-back-leave-active {
    transition: opacity 1ms linear;
  }

  .page-forward-enter-from,
  .page-forward-leave-to,
  .page-back-enter-from,
  .page-back-leave-to {
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

@media (max-width: 820px) {
  .site-nav {
    position: fixed;
    top: auto;
    bottom: calc(0.75rem + env(safe-area-inset-bottom));
    left: 50%;
    width: min(100% - 1rem, 34rem);
    margin: 0;
    transform: translateX(-50%);
  }

  .site-nav.is-hidden {
    top: auto;
    opacity: 0;
    transform: translateX(-50%) translateY(calc(100% + 1.5rem));
  }

  .nav-shell {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 3.9rem;
    padding: 0.55rem 0.65rem;
    border-radius: 2rem;
  }

  .nav-links a {
    min-height: 2.8rem;
    padding: 0 0.25rem;
    font-size: 0.92rem;
  }

  .theme-toggle {
    width: 3.9rem;
    min-height: 3.9rem;
    padding: 0.65rem;
  }

  .theme-toggle svg {
    width: 1.2rem;
    height: 1.2rem;
  }
}

@media (max-width: 380px) {
  .site-nav {
    gap: 0.35rem;
  }

  .nav-shell {
    padding: 0.5rem;
  }

  .nav-links a {
    padding: 0 0.15rem;
    font-size: 0.86rem;
  }

  .theme-toggle {
    width: 3.65rem;
    min-height: 3.65rem;
  }
}
</style>
