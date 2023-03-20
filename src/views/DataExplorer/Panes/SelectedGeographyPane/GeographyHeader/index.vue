<template>
  <!-- Header and subheaders -->
  <div
    class="tw-static tw-z-[8] tw-h-fit tw-w-full tw-border-b-4 tw-border-stone-300 tw-bg-white tw-text-base lg:tw-sticky lg:tw-top-0"
    ref="contentHeader"
  >
    <!-- Header -->
    <div
      class="tw-mt-4 tw-flex tw-flex-col tw-px-4 tw-text-3xl sm:tw-flex-row sm:tw-items-end sm:tw-px-8 lg:tw-mt-0"
    >
      <div class="tw-font-semibold">
        <span class="tw-mr-3 tw-text-2xl"><i class="fas fa-map-pin"></i></span
        >{{ selectedGeographyName }}
      </div>
      <div
        class="tw-mt-1 tw-flex tw-text-xl tw-font-semibold tw-uppercase tw-text-gray-400 sm:tw-mt-0 sm:tw-ml-2"
      >
        {{ selectedGeographyType }}
      </div>
    </div>

    <!-- Neighborhood Subheader -->
    <neighborhood-subheader
      v-if="selectedGeographyType == 'neighborhood'"
      class="tw-mb-2"
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
      class="tw-mb-2"
      :data="getTractData(selectedGeographyName)"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Region subheader -->
    <region-subheader
      v-else-if="selectedGeographyType == 'region'"
      class="tw-mb-2"
      :neighborhoods="regionsToHoods[selectedGeographyName]"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Section links -->
    <div
      class="tw-flex tw-w-full tw-items-end tw-justify-between tw-bg-stone-100/25 tw-pl-4 tw-pr-4 sm:tw-pl-8"
    >
      <!-- Links -->
      <section-links
        @scroll="$emit('scroll', $event)"
        :selected-geography-type="selectedGeographyType"
        v-if="$mq !== 'mobile'"
      />

      <!-- Buttons -->
      <div class="tw-flex tw-items-center">
        <!-- Reset -->
        <div class="tw-mr-2 tw-flex tw-flex-col">
          <div
            class="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider tw-text-gray-400"
          >
            Reset
          </div>

          <div class="tw-flex tw-flex-row tw-items-center tw-text-lg">
            <span class="tw-mr-2"><i class="fas fa-map-pin"></i></span>
            <span
              class="tw-text-[#0F7582]/75 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
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

        <div
          v-if="selectedGeographyType == 'tract'"
          class="tw-flex- tw-flex-col tw-border-l-2 tw-border-gray-300 tw-pl-2"
        >
          <!-- Header -->
          <div
            class="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider tw-text-gray-400"
          >
            Compare
          </div>

          <div class="tw-flex tw-flex-row tw-text-lg">
            <span class="tw-mr-2"><i class="fas fa-table"></i></span>
            <span
              class="tw-text-[#0F7582]/75 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
              :class="{
                disabled: isDisabled('plus'),
              }"
              title="Add to scorecard comparison"
              role="button"
              tabindex="0"
              @click.prevent="handlePlusClick"
              @keydown.enter.prevent="handlePlusClick"
              @keydown.space.prevent="handlePlusClick"
            >
              <i class="fas fa-plus-circle"></i>
            </span>
            <span
              class="tw-ml-0.5 tw-text-[#0F7582]/75 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
              :class="{
                disabled: isDisabled('minus'),
              }"
              title="Remove from scorecard comparison"
              role="button"
              tabindex="0"
              @click.prevent="handleMinusClick"
              @keydown.enter.prevent="handleMinusClick"
              @keydown.space.prevent="handleMinusClick"
            >
              <i class="fas fa-minus-circle"></i>
            </span>
            <span
              class="tw-ml-0.5 tw-text-[#0F7582]/75 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
              :class="{
                disabled: isDisabled('times'),
              }"
              title="Clear scorecard comparison"
              role="button"
              tabindex="0"
              @click.prevent="handleTimesClick"
              @keydown.enter.prevent="handleTimesClick"
              @keydown.space.prevent="handleTimesClick"
            >
              <i class="fas fa-times-circle"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else class="tw-mb-4"></div> -->
  </div>
</template>

<script>
import SectionLinks from "./SectionLinks";
import NeighborhoodSubheader from "./Subheaders/Neighborhood";
import TractSubheader from "./Subheaders/Tract";
import RegionSubheader from "./Subheaders/Region";

import { mapState } from "vuex";

export default {
  name: "GeographyHeader",
  props: {
    /**
     * Name of selected geography name
     */
    selectedGeographyName: { type: String },

    /**
     * Type of selected geography name
     */
    selectedGeographyType: { type: String },
  },
  components: {
    NeighborhoodSubheader,
    TractSubheader,
    RegionSubheader,
    SectionLinks,
  },
  data() {
    return {
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
    ...mapState([
      "navBarHeight",
      "controllerNavHeight",
      "neighborhoodSizes",
      "geojson",
      "regionsToHoods",
      "hoodsToRegions",
      "scorecardTractNames",
    ]),

    /**
     * Census tract features
     */
    tractFeatures() {
      return this.geojson.tracts.features;
    },

    /**
     * Top padding to offset navbars
     */
    topOffset() {
      const padding = this.navBarHeight + this.controllerNavHeight;
      return `top: ${padding}px`;
    },
  },
  methods: {
    handlePlusClick() {
      if (!this.isDisabled("plus")) this.$emit("comparison:add");
    },
    handleMinusClick() {
      if (!this.isDisabled("minus")) this.$emit("comparison:remove");
    },
    handleTimesClick() {
      if (!this.isDisabled("times")) this.$emit("comparison:reset");
    },
    isDisabled(kind) {
      if (kind === "minus")
        return (
          this.scorecardTractNames === undefined ||
          !this.scorecardTractNames.includes(this.selectedGeographyName)
        );
      else if (kind === "plus")
        return (
          this.scorecardTractNames !== undefined &&
          (this.scorecardTractNames.length == 2 ||
            this.scorecardTractNames.includes(this.selectedGeographyName))
        );
      else {
        return (
          this.scorecardTractNames === undefined ||
          this.scorecardTractNames.length === 0
        );
      }
    },
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

<style scoped>
span.disabled,
span.disabled:hover,
span.disabled:active,
span.disabled:focus {
  opacity: 25%;
  cursor: not-allowed;
  color: #0f7582;
}
</style>
