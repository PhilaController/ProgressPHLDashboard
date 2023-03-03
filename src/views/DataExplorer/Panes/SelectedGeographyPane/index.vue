<template>
  <div class="tw-relative tw-w-full">
    <!-- Header and subheaders -->
    <geography-header
      :selected-geography-name="selectedGeographyName"
      :selected-geography-type="selectedGeographyType"
      :nav-bar-height="navBarHeight"
      :controller-nav-height="controllerNavHeight"
      :tract-features="tractFeatures"
      @mounted="headerHeight = $event"
      @change:height="headerHeight = $event"
      @scroll="handleScroll"
      @geography:reset="$emit('geography:reset')"
      @geography:select="$emit('geography:select', $event)"
      @geography:highlight="$emit('geography:highlight', $event)"
      @geography:unhighlight="$emit('geography:unhighlight')"
    />

    <!-- Sections -->
    <div class="tw-mt-10">
      <!-- Top Summary Message -->
      <top-message
        class="tw-px-4 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
        :spi-data="data['social_progress_index']"
      />

      <!-- Indicators section -->
      <indicators-section
        id="indicators-section"
        class="tw-mt-10 tw-px-4 sm:tw-px-8"
        :data="selectedCensusData"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
      />

      <!-- Strip plots -->
      <strip-plots-section
        id="spi-section"
        class="tw-mt-20 tw-px-4 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
        :selected-geography-size="selectedGeographySize"
        :data="data"
        :metadata="metadata"
        :focused-ids="focusedIds"
        :hovered-id="hoveredId"
        @geography:select="$emit('geography:select', $event)"
        @geography:hover="$emit('geography:hover', $event)"
        @geography:unhover="$emit('geography:unhover')"
      />

      <!-- Trends -->
      <trends-section
        id="trends-section"
        class="tw-mt-20 tw-px-0 sm:tw-px-8"
        :selected-geography-name="selectedGeographyName"
        :selected-geography-type="selectedGeographyType"
        :data="data"
        :metadata="metadata"
        :focused-ids="focusedIds"
        @geography:select="$emit('geography:select', $event)"
        @geography:hover="$emit('geography:hover', $event)"
        @geography:unhover="$emit('geography:unhover')"
      />
    </div>
  </div>
</template>

<script>
// Local
import GeographyHeader from "./GeographyHeader";
import TopMessage from "./TopMessage";
import IndicatorsSection from "./Sections/Indicators";
import StripPlotsSection from "./Sections/StripPlots";
import TrendsSection from "./Sections/Trends";

// d3
import { json } from "d3-fetch";

// The SPI url
const SPI_URL = "https://spi-dashboard-data.s3.amazonaws.com/v1/census-data";

export default {
  name: "SelectedGeographyPage",
  props: {
    /**
     * The height of the ProgressPHL navbar in pixels
     */
    navBarHeight: { type: Number },

    /**
     * The height of the controller.phila.gov navbar in pixels
     */
    controllerNavHeight: { type: Number },

    usePadding: { type: Boolean },

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

    /**
     * SPI data
     */
    data: { type: Object, required: true },

    /**
     * Metadata for SPI
     */
    metadata: { type: Object, required: true },

    /**
     * GEOIDs of focused tracts
     */
    focusedIds: { type: Array },

    /**
     * GEOID of hovered tract
     */
    hoveredId: { type: String },
  },
  components: {
    GeographyHeader,
    TopMessage,
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

      /**
       * Census data cache
       */
      censusData: {},
      selectedCensusData: null,
    };
  },

  created() {
    // Pull census data
    this.setCensusData(this.selectedGeographyName);
  },

  computed: {
    /**
     * Number of tracts in the selected geography
     */
    selectedGeographySize() {
      return this.focusedIds.length;
    },
  },

  watch: {
    /**
     * Pull the new census data if we need to
     */
    selectedGeographyName(newValue) {
      this.setCensusData(newValue);
    },
  },

  methods: {
    /**
     * Get the census data indicators
     */
    setCensusData(value) {
      if (value !== null) {
        // Get the data from the cache
        let data = this.censusData[value];

        // Pull the data if we need to
        if (!data) {
          const url = `${SPI_URL}/${value}.json`;
          json(url).then((data) => {
            this.censusData[value] = this.selectedCensusData = data;
          });
        }
        // Or use the cached data
        else {
          this.selectedCensusData = data;
        }
      } else {
        // Reset the selected census data
        this.selectedCensusData = null;
      }
    },

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
        scrollableContainer.scrollTop = scrollTop - 20;
      }
    },
  },
};
</script>
