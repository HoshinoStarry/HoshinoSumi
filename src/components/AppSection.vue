<script setup>
import { computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  as: {
    type: String,
    default: "section",
  },
  spacing: {
    type: String,
    default: "default",
  },
  radius: {
    type: String,
    default: "default",
  },
  variant: {
    type: String,
    default: "panel",
  },
  marginTop: {
    type: String,
    default: "",
  },
  marginTopMobile: {
    type: String,
    default: "",
  },
  padding: {
    type: String,
    default: "",
  },
  paddingMobile: {
    type: String,
    default: "",
  },
  background: {
    type: String,
    default: "",
  },
  border: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
});

const spacingPresets = {
  default: "clamp(1.2rem, 4vw, 2.5rem)",
  loose: "clamp(2.5rem, 6vw, 4.6rem)",
  banner: "clamp(2rem, 5vw, 4rem)",
  none: "0",
};

const radiusPresets = {
  default: "clamp(1.5rem, 3vw, 2.4rem)",
  soft: "clamp(1.2rem, 2.5vw, 2rem)",
  banner: "clamp(1.5rem, 3vw, 2.6rem)",
  none: "0",
};

const variantPresets = {
  panel: "var(--panel)",
  weak: "var(--panel-weak)",
  blue: "var(--panel-blue)",
  deep: "var(--deep-panel)",
  transparent: "transparent",
};

const sectionStyle = computed(() => {
  const style = {
    "--section-margin-top": props.marginTop || spacingPresets[props.spacing] || props.spacing,
    "--section-padding-value": props.padding || "var(--section-padding)",
    "--section-padding-mobile-value": props.paddingMobile || "var(--section-padding-mobile)",
    "--section-radius": radiusPresets[props.radius] || props.radius,
    "--section-background": props.background || variantPresets[props.variant] || props.variant,
    "--section-border": props.border ? "1px solid var(--line)" : "0",
    "--section-shadow": props.shadow ? "0 10px 24px rgba(34, 56, 102, 0.04)" : "none",
  };

  if (props.marginTopMobile) {
    style["--section-margin-top-mobile"] = props.marginTopMobile;
  }

  return style;
});
</script>

<template>
  <component :is="as" v-bind="$attrs" class="app-section" :style="sectionStyle">
    <slot></slot>
  </component>
</template>

<style scoped>
.app-section {
  margin-top: var(--section-margin-top, clamp(1.2rem, 4vw, 2.5rem));
  padding: var(--section-padding-value, var(--section-padding));
  border: var(--section-border, 1px solid var(--line));
  border-radius: var(--section-radius, clamp(1.5rem, 3vw, 2.4rem));
  background: var(--section-background, var(--panel));
  box-shadow: var(--section-shadow, 0 10px 24px rgba(34, 56, 102, 0.04));
}

@media (max-width: 620px) {
  .app-section {
    margin-top: var(--section-margin-top-mobile, var(--section-margin-top, clamp(1.2rem, 4vw, 2.5rem)));
    padding: var(--section-padding-mobile-value, var(--section-padding-mobile));
  }
}
</style>
