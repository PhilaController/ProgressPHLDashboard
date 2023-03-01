<template>
  <div
    class="tw-mx-1 tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-justify-start sm:tw-w-1/3 md:tw-mx-4 lg:tw-mx-8"
  >
    <!-- Icon grid -->
    <div
      class="tw-grid tw-grid-cols-2 tw-grid-rows-2 tw-justify-center tw-gap-1 tw-py-4"
      :style="dropShadowClass"
    >
      <!-- Icon -->
      <div
        v-for="component in data"
        class="tw-flex tw-w-full tw-justify-center"
      >
        <font-awesome-icon
          :icon="`fa-solid ${component.icon}`"
          class="tw-mb-1 tw-text-2xl sm:tw-text-3xl"
        />
      </div>
    </div>

    <!-- Title -->
    <div :class="`tw-text-center tw-text-lg tw-font-semibold lg:tw-text-xl`">
      {{ title }}
    </div>
    <!-- Subtitle -->
    <div class="tw-text-center tw-text-sm tw-italic lg:tw-text-base">
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
const colors = require("tailwindcss/colors");

export default {
  name: "DimensionBlock",
  props: ["title", "subtitle", "data", "shadowColor"],
  computed: {
    dropShadowClass() {
      let color = colors[this.shadowColor[0]][this.shadowColor[1]];
      return `filter: drop-shadow(0 0 1em ${color});`;
    },
  },
};
</script>

<style scoped>
.has-drop-shadow {
  filter: drop-shadow(0 0 2em #38bdf8);
}
</style>
