<template>
  <div
    id="landing-page"
    class="tw-relative tw-h-screen tw-min-h-fit tw-bg-gradient-to-r tw-from-[#D6F0F2] tw-pb-4"
    :style="paddingTop"
  >
    <!-- Logo aligned on right -->
    <logo :style="paddingTop" />

    <!-- Main content -->
    <div class="tw-relative tw-z-[8] tw-mx-auto tw-max-w-6xl tw-px-8 tw-pt-20">
      <!-- Title -->
      <div
        class="tw-font-['Montserrat'] tw-text-5xl tw-font-semibold sm:tw-text-6xl md:tw-text-7xl lg:tw-text-8xl"
      >
        ProgressPHL
      </div>

      <!-- Subtitle -->
      <div
        class="tw-mt-4 tw-w-full tw-text-base sm:tw-mt-8 sm:tw-w-4/5 sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl"
      >
        Explore the social and environmental wellbeing of Philadelphians and
        their communities. Find out why some neighborhoods excel while others
        lag behind and build the evidence to make progress for all
        Philadelphians.
      </div>

      <!-- Buttons -->
      <buttons class="tw-mt-14" :data="data" :geojson="geojson" />
    </div>
  </div>
</template>

<script>
import Logo from "./components/Logo";
import Buttons from "./components/Buttons";

export default {
  name: "LandingPage",
  props: {
    /**
     * The height of the controller.phila.gov navbar in pixels
     */
    controllerNavHeight: { type: Number },

    /**
     * The geojson collections
     */
    geojson: { type: Object },

    /**
     * SPI data
     */
    data: { type: Object },

    /**
     * Metadata for SPI
     */
    metadata: { type: Object },

    /**
     * Whether to use the top padding (on small screens it isn't needed)
     */
    usePadding: { type: Boolean },
  },
  components: { Logo, Buttons },
  computed: {
    /**
     * Apply top padding to offset nav bar
     */
    paddingTop() {
      if (this.usePadding) return `padding-top: ${this.controllerNavHeight}px`;
      else return "";
    },
  },
};
</script>
