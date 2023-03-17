<template>
  <div class="tw-relative tw-w-full">
    <!-- Header and subheaders -->
    <geography-header
      :selected-geography-name="selectedGeographyName"
      :selected-geography-type="selectedGeographyType"
      :scorecard-tracts="scorecardTracts"
      @mounted="headerHeight = $event"
      @change:height="headerHeight = $event"
      @scroll="handleScroll"
      @comparison:add="$emit('comparison:add')"
      @comparison:remove="$emit('comparison:remove')"
      @geography:reset="$emit('geography:reset')"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Sections -->
    <div class="tw-mt-6">
      <!-- Indicators section -->
      <indicators-section
        id="indicators-section"
        class="tw-mt-0 tw-px-4 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
      />

      <!-- Strip plots -->
      <strip-plots-section
        id="spi-section"
        class="tw-mt-14 tw-px-4 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
        :focused-ids="focusedIds"
        :hovered-id="hoveredId"
        @geography:select="$emit('geography:select', $event)"
        @geography:hover="$emit('geography:hover', $event)"
        @geography:unhover="$emit('geography:unhover')"
        @update:map-variable="$emit('update:map-variable', $event)"
        @scroll="handleScroll"
        @loaded-charts="$emit('loaded-charts', $event)"
      />

      <!-- Trends -->
      <trends-section
        id="trends-section"
        class="tw-mt-20 tw-px-0 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
        :focused-ids="focusedIds"
        :scorecard-tracts="scorecardTracts"
        @geography:select="$emit('geography:select', $event)"
        @geography:hover="$emit('geography:hover', $event)"
        @geography:unhover="$emit('geography:unhover')"
        @comparison:add="$emit('comparison:add', $event)"
        @comparison:remove="$emit('comparison:remove', $event)"
        @comparison:reset="$emit('comparison:reset')"
      />
    </div>
  </div>
</template>

<script>
// Local
import GeographyHeader from "./GeographyHeader";
import IndicatorsSection from "./Sections/Indicators";
import StripPlotsSection from "./Sections/StripPlots";
import TrendsSection from "./Sections/Trends";

import { mapState } from "vuex";

export default {
  name: "SelectedGeographyPage",
  props: {
    /**
     * Name of selected geography name
     */
    selectedGeographyName: { type: String },

    /**
     * Type of selected geography name
     */
    selectedGeographyType: { type: String },

    /**
     * GEOIDs of focused tracts
     */
    focusedIds: { type: Array },

    /**
     * GEOID of hovered tract
     */
    hoveredId: { type: String },

    /**
     * Names of tracts selected for scorecard page
     */
    scorecardTracts: { type: Array },
  },
  components: {
    GeographyHeader,
    IndicatorsSection,
    StripPlotsSection,
    TrendsSection,
  },
  data() {
    return {
      /**
       * Observe the height of the header
       */
      observer: null,
      headerHeight: null,

      /** Show overlay */
    };
  },

  computed: {
    ...mapState(["navBarHeight"]),
  },

  methods: {
    /**
     * Scroll to the specified element, or to the top if none is provided
     */
    handleScroll(selector) {
      // Get the scrollable container
      let scrollableContainer = this.$el.parentElement;

      // Scroll to the top if selector is not provided
      if (!selector) {
        scrollableContainer.scrollTop = 0;
      }
      // Scroll to an element
      else {
        // The element to scroll to
        let elem = this.$el.querySelector(selector);

        // Calculate new scroll top
        let scrollOffset = elem.offsetTop - scrollableContainer.offsetTop;
        let scrollTop = scrollOffset - (this.headerHeight - this.navBarHeight);

        // Scroll!
        scrollableContainer.scrollTop = scrollTop - 10;
      }
    },
  },
};
</script>
