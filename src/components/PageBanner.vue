<script setup>
import { computed } from "vue";
import AppSection from "./AppSection.vue";

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: "",
  },
  sectionSpacing: {
    type: String,
    default: "banner",
  },
  sectionRadius: {
    type: String,
    default: "banner",
  },
  outerMarginTop: {
    type: String,
    default: "",
  },
  minHeight: {
    type: String,
    default: "",
  },
  copyWidth: {
    type: String,
    default: "",
  },
  copyWidthTablet: {
    type: String,
    default: "",
  },
  copyWidthMobile: {
    type: String,
    default: "",
  },
  copyMaxWidthMobile: {
    type: String,
    default: "",
  },
  visualWidth: {
    type: String,
    default: "",
  },
  visualWidthMobile: {
    type: String,
    default: "",
  },
  visualTransform: {
    type: String,
    default: "",
  },
  visualTransformMobile: {
    type: String,
    default: "",
  },
});

const bannerStyle = computed(() => {
  const style = {
    "--banner-margin-top-value": props.outerMarginTop || "clamp(1rem, 12vw, 22rem)",
    "--banner-min-height": props.minHeight || "0rem",
    "--banner-copy-width": props.copyWidth || "min(36rem, 44%)",
    "--banner-visual-width": props.visualWidth || "min(38rem, 42vw)",
    "--banner-visual-transform": props.visualTransform || "translateY(5%) translateX(5%)",
    "--banner-visual-transform-mobile": props.visualTransformMobile || "none",
  };

  if (props.copyWidthTablet) {
    style["--banner-copy-width-tablet"] = props.copyWidthTablet;
  }

  if (props.copyWidthMobile) {
    style["--banner-copy-width-mobile"] = props.copyWidthMobile;
  }

  if (props.copyMaxWidthMobile) {
    style["--banner-copy-max-width-mobile"] = props.copyMaxWidthMobile;
  }

  if (props.visualWidthMobile) {
    style["--banner-visual-width-mobile"] = props.visualWidthMobile;
  }

  return style;
});
</script>

<template>
  <div class="banner-section-outer" :style="bannerStyle">
    <AppSection class="page-banner" :spacing="sectionSpacing" :radius="sectionRadius">
      <div class="banner-copy">
        <slot name="copy"></slot>
      </div>

      <figure class="banner-visual" :aria-hidden="imageAlt ? undefined : 'true'">
        <img :src="imageSrc" :alt="imageAlt" />
      </figure>
    </AppSection>
  </div>
</template>

<style scoped>
.banner-section-outer {
  margin-top: var(--banner-margin-top-value);
}

.page-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  min-height: var(--banner-min-height);
  overflow: visible;
}

.banner-copy {
  position: relative;
  z-index: 4;
  display: block;
  width: var(--banner-copy-width);
  min-width: 0;
  min-height: 1px;
  color: var(--ink);
}

.banner-visual {
  position: absolute;
  right: clamp(2rem, 5vw, 4rem);
  bottom: 0;
  z-index: 3;
  display: block;
  width: var(--banner-visual-width);
  margin: 0;
  background: transparent;
  pointer-events: none;
  transform: var(--banner-visual-transform);
}

.banner-visual img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center bottom;
}

@media (max-width: 820px) {
  .banner-copy {
    width: var(--banner-copy-width-tablet, var(--banner-copy-width));
  }
}

@media (max-width: 620px) {
  .banner-copy {
    width: var(--banner-copy-width-mobile, min(100%, calc(100% - clamp(9rem, 38vw, 12.5rem))));
    max-width: var(--banner-copy-max-width-mobile, 18rem);
  }

  .banner-visual {
    right: 0.8rem;
    width: var(--banner-visual-width-mobile, clamp(9rem, 39vw, 12.25rem));
    transform: var(--banner-visual-transform-mobile);
  }

}
</style>
