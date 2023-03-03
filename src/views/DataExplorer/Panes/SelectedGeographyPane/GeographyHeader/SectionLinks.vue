<template>
  <div
    class="tw-mt-2 tw-flex tw-w-full tw-justify-around tw-bg-stone-100/25 tw-px-4 tw-text-base sm:tw-justify-start sm:tw-gap-8 sm:tw-px-8"
  >
    <div v-for="(title, i) in titles" class="tw-py-2">
      <a
        href="#"
        @click.prevent="$emit('scroll', selectors[i])"
        @keydown.enter.prevent="$emit('scroll', selectors[i])"
        @keydown.space.prevent="$emit('scroll', selectors[i])"
        class="tw-font-semibold tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
        >{{ title }}</a
      >
    </div>
  </div>
</template>

<script>
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      if (this.$mq == "mobile")
        return ["Indicators", "SPI Scores", "SPI Correlations"];
      else
        return [
          `${capitalizeFirstLetter(this.selectedGeographyType)} Indicators`,
          "The Philadelphia SPI",
          "Economic Comparisons",
        ];
    },
  },
};
</script>
