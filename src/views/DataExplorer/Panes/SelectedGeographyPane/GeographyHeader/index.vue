<template>
  <!-- Header and subheaders -->
  <div
    class="tw-static tw-z-[8] tw-h-fit tw-w-full tw-border-b-4 tw-border-stone-300 tw-bg-white tw-text-base lg:tw-sticky lg:tw-top-0"
    ref="contentHeader"
  >
    <!-- Header -->
    <div
      class="tw-mt-2 tw-mb-1 tw-flex tw-flex-col tw-px-4 tw-text-3xl sm:tw-mt-0 sm:tw-flex-row sm:tw-items-end sm:tw-px-8"
    >
      <div class="tw-font-bold">
        <a
          class="visited:tw-text-inherit hover:tw-text-inherit focus:tw-outline-none"
          href="#"
          @click.prevent="$emit('scroll')"
          @keydown.enter.prevent="$emit('scroll')"
          @keydown.space.prevent="$emit('scroll')"
          >{{ selectedGeographyName }}</a
        >
      </div>
      <div
        class="tw-mt-1 tw-text-xl tw-font-semibold tw-uppercase tw-text-gray-400 sm:tw-mt-0 sm:tw-ml-2"
      >
        {{ selectedGeographyType }}
        <span
          class="tw-ml-1.5 tw-text-[1em] tw-text-gray-400 hover:tw-cursor-pointer hover:tw-text-gray-600"
          title="Reset the selected geography"
          role="button"
          tabindex="0"
          @click.prevent="$emit('geography:reset')"
          @keydown.enter.prevent="$emit('geography:reset')"
          @keydown.space.prevent="$emit('geography:reset')"
        >
          <i class="fas fa-times-circle"></i>
        </span>
      </div>
    </div>

    <!-- Neighborhood Subheader -->
    <neighborhood-subheader
      v-if="selectedGeographyType == 'neighborhood'"
      :name="selectedGeographyName"
      :neighborhood-size="neighborhoodSizes.get(selectedGeographyName)"
      :regions="hoodsToRegions[selectedGeographyName]"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Tract subheader -->
    <tract-subheader
      v-else-if="selectedGeographyType == 'tract'"
      :data="getTractData(selectedGeographyName)"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Region subheader -->
    <region-subheader
      v-else-if="selectedGeographyType == 'region'"
      :neighborhoods="regionsToHoods[selectedGeographyName]"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Section links -->
    <section-links @scroll="$emit('scroll', $event)" />
  </div>
</template>

<script>
import { regionsToHoods, hoodsToRegions } from "@/data";

import SectionLinks from "./SectionLinks";
import NeighborhoodSubheader from "./Subheaders/Neighborhood";
import TractSubheader from "./Subheaders/Tract";
import RegionSubheader from "./Subheaders/Region";

import { rollup, max } from "d3-array";

export default {
  name: "GeographyHeader",
  props: {
    /**
     * The height of the ProgressPHL navbar in pixels
     */
    navBarHeight: { type: Number },

    /**
     * The height of the controller.phila.gov navbar in pixels
     */
    controllerNavHeight: { type: Number },

    /**
     * Name of selected geography name
     */
    selectedGeographyName: { type: String },

    /**
     * Type of selected geography name
     */
    selectedGeographyType: { type: String },

    /**
     * Census tract features
     */
    tractFeatures: { type: Array, required: true },
  },
  components: {
    NeighborhoodSubheader,
    TractSubheader,
    RegionSubheader,
    SectionLinks,
  },
  data() {
    return {
      regionsToHoods: regionsToHoods,
      hoodsToRegions: hoodsToRegions,
      observer: null,
      height: null,
    };
  },
  /**
   * When mounted, set up tracking the height
   */
  mounted() {
    // Emit the initialize height
    this.$emit("mounted", this.$el.offsetHeight);

    // Set up the observer
    const observer = new ResizeObserver(() => {
      this.height = this.$el.offsetHeight;
      this.$emit("change:height", this.height);
    });
    observer.observe(this.$el);
    this.observer = observer;
  },

  /**
   * Remove observer
   */
  beforeDestroy() {
    if (this.observer) this.observer.unobserve(this.$el);
  },

  computed: {
    /**
     * Top padding to offset navbars
     */
    topOffset() {
      const padding = this.navBarHeight + this.controllerNavHeight;
      return `top: ${padding}px`;
    },

    /**
     * Number of tracts per neighborhood
     */
    neighborhoodSizes() {
      return rollup(
        this.tractFeatures,
        (grp) => max(grp, (d) => +d.properties.tract_id),
        (d) => d.properties.neighborhood_name
      );
    },
  },
  methods: {
    /**
     * Return the properties for the tract feature with the input name
     */
    getTractData(name) {
      let tract = this.tractFeatures.find(
        (d) =>
          `${d.properties.neighborhood_name} ${+d.properties.tract_id}` === name
      );
      if (tract) return tract.properties;
    },
  },
};
</script>
