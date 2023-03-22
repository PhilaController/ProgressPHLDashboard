<template>
  <div
    class="tw-flex tw-w-full tw-justify-around tw-text-base sm:tw-justify-start sm:tw-gap-8"
  >
    <div v-for="(title, i) in titles" class="tw-py-1">
      <a
        href="#"
        @click.prevent="$emit('scroll', selectors[i])"
        @keydown.enter.prevent="$emit('scroll', selectors[i])"
        @keydown.space.prevent="$emit('scroll', selectors[i])"
        class="tw-font-semibold tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
        >{{ title }}</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SectionLinks",
  props: ["selectedGeographyType"],
  data() {
    return {
      selectors: ["#indicators-section", "#spi-section", "#trends-section"],
    };
  },
  computed: {
    titles() {
      return ["Indicators", "SPI Scores", "Citywide Trends"];
    },
  },
};
</script>
