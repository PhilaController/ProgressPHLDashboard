<template>
  <!-- Show a loader if data hasn't loaded-->
  <loading-page v-if="isLoading" />

  <!-- Data is loaded -->
  <div
    v-else
    class="tw-relative tw-flex tw-flex-col tw-text-lg lg:tw-h-screen"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <!-- Main app -->
    <div
      class="tw-relative tw-flex tw-h-full tw-w-full tw-flex-col lg:tw-flex-row"
      :style="getPaddingTop(navBarHeight)"
    >
      <!-- Map -->
      <div
        class="tw-h-[400px] tw-w-full tw-border-x-4 tw-border-y-4 tw-border-stone-400/50 lg:tw-h-full lg:tw-w-1/3"
      >
        <explorer-map
          ref="ExplorerMap"
          :data="data"
          :geojson="geojson"
          :displayed-variable-name="metadata.aliases[mappedVariable]"
          :hierarchy="metadata.hierarchy"
          :aliases="metadata.aliases"
          :neighborhood-names="neighborhoodNames"
          :region-names="regionNames"
          :selected-geography-name="selectedGeographyName"
          :selected-geography-type="selectedGeographyType"
          :focused-ids="focusedIds"
          @geography:select="handleGeographySelection"
        />
      </div>

      <!-- Content -->
      <div
        class="tw-w-full tw-overflow-y-scroll tw-border-b-4 tw-border-stone-400/50 tw-pb-10 lg:tw-w-2/3"
        id="content-container"
      >
        <!-- Welcome Pane: No neighborhood selection  -->
        <welcome-pane
          v-if="selectedGeographyName == null"
          :tract-features="geojson.tracts.features"
          :neighborhood-names="neighborhoodNames"
          :region-names="regionNames"
          :selected-geography-name="selectedGeographyName"
          @geography:select="handleGeographySelection"
        />

        <!-- Geography page: selected geography-->
        <selected-geography-pane
          v-else
          :selected-geography-name="selectedGeographyName"
          :selected-geography-type="selectedGeographyType"
          :nav-bar-height="navBarHeight"
          :controller-nav-height="controllerNavHeight"
          :tract-features="geojson.tracts.features"
          :data="data"
          :metadata="metadata"
          :focused-ids="focusedIds"
          :hovered-id="hoveredId"
          @geography:reset="resetSelectedGeography"
          @geography:select="handleGeographySelection"
          @geography:highlight="highlightGeography"
          @geography:unhighlight="unHighlightGeography"
          @geography:hover="handleStripPlotMouseover"
          @geography:unhover="handleStripPlotMouseleave"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Local
import WelcomePane from "./Panes/WelcomePane";
import SelectedGeographyPane from "./Panes/SelectedGeographyPane";
import ExplorerMap from "./ExplorerMap.vue";
import LoadingPage from "@/components/LoadingPage";
import Navbar from "@/components/Navbar";

// d3
import { ascending } from "d3-array";

// These neighborhoods can be ignored
const missingHoods = ["Park", "Airport-Navy Yard", "NE Airport"];

export default {
  name: "DataExplorer",
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
     * Do we need top padding
     */
    usePadding: { type: Boolean },

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
  },

  components: {
    WelcomePane,
    SelectedGeographyPane,
    Navbar,
    LoadingPage,
    ExplorerMap,
  },
  data() {
    return {
      /**
       * Is the map fully loaded?
       */
      mapLoaded: false,

      /**
       * Is there a currently selected geography?
       * Track both the name and type
       */
      selectedGeographyName: null,
      selectedGeographyType: null,
      geographyTypes: ["neighborhood", "region", "tract"],

      /**
       * The GEOID of a currently hovered tract
       */
      hoveredId: null,

      /**
       * What variable is currently mapped
       */
      mappedVariable: "social_progress_index",
    };
  },

  /**
   * When created, set selected geography from route param if necessary
   */
  created() {
    let query = this.$route.query;
    for (let i = 0; i < this.geographyTypes.length; i++) {
      let type = this.geographyTypes[i];
      if (query[type] !== undefined) {
        this.selectedGeographyName = query[type];
        this.selectedGeographyType = type;
        break;
      }
    }
  },

  watch: {
    /**
     * When selected geography changes, update route query
     */
    selectedGeographyName(newValue, oldValue) {
      // Current route selection
      let currentRouteSelection = this.$route.query[this.selectedGeographyType];

      // Only update if value changed and it's not the current route
      if (newValue !== oldValue && currentRouteSelection !== newValue) {
        let type = this.selectedGeographyType;
        let name = this.selectedGeographyName;
        let q = {};
        if (name) q[type] = name;
        this.$router.replace({ query: q });
      }
    },

    /*
      When the map is loaded, check query parameters
    */
    mapLoaded() {
      if (this.tractUrlParam != undefined) {
        this.$refs.mapComponent.setClickedId(this.tractUrlParam);
      }
    },

    /*
      When the tract is updated, update the URL query params
    */
    clickedTract(newValue, oldValue) {
      if (newValue !== oldValue && this.$route.query.tract !== newValue) {
        let query = {};
        if (newValue) query = { tract: newValue };
        this.$router.replace({ query: query });
      }
    },
  },
  computed: {
    /**
     * Neighborhood names, sorted alphabetically
     */
    neighborhoodNames() {
      // Extract neighborhood names
      let values = this.geojson.tracts.features.map(
        (d) => d.properties.neighborhood_name
      );

      // Return unique values, sorted
      return [...new Set(values)]
        .filter((name) => !missingHoods.includes(name))
        .sort((a, b) => ascending(a, b));
    },

    /**
     * Region (PUMA) names, sorted alphabetically
     */
    regionNames() {
      // Extract PUMA names
      let values = this.geojson.tracts.features.map(
        (d) => d.properties.puma_name
      );

      // Return unique values, sorted
      return [...new Set(values)].sort((a, b) => ascending(a, b));
    },

    /**
     * Whether we need to show spinner until data is loaded
     */
    isLoading() {
      return this.data == null || this.geojson == null;
    },

    /**
     * The list of GEOIDs for currently focused tracts
     */
    focusedIds() {
      // All census tract features
      let features = this.geojson.tracts.features;

      // Trim by region
      if (this.selectedGeographyType == "region")
        features = features.filter(
          (d) => d.properties.puma_name == this.selectedGeographyName
        );

      // Trim by neighborhood
      if (this.selectedGeographyType == "neighborhood")
        features = features.filter(
          (d) => d.properties.neighborhood_name == this.selectedGeographyName
        );

      // Trim by census tract
      if (this.selectedGeographyType == "tract")
        features = features.filter(
          (d) =>
            `${d.properties.neighborhood_name} ${+d.properties.tract_id}` ==
            this.selectedGeographyName
        );

      // Return the geoids
      return features.map((d) => d.properties.geoid);
    },
  },

  methods: {
    /**
     * Determine the padding to use
     */
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
    /**
     * Get the properties for the specified tract name
     */
    getTractDataByName(name) {
      return this.geojson.tracts.features.find(
        (d) =>
          `${d.properties.neighborhood_name} ${+d.properties.tract_id}` == name
      ).properties;
    },

    /**
     * Handle mouseover event from a strip plot
     */
    handleStripPlotMouseover({ name, type }) {
      this.highlightGeography({ name, type });
      this.hoveredId = this.getTractDataByName(name).geoid;
    },

    /**
     * Handle mouseleave event from a strip plot
     */
    handleStripPlotMouseleave() {
      this.hoveredId = null;
      this.unHighlightGeography();
    },

    /**
     * Highlight the specified geography in the map
     */
    highlightGeography({ name, type }) {
      this.$refs.ExplorerMap.highlightGeographyLayer({ name, type });
    },

    /**
     * Unhighlight any geographies in the map
     */
    unHighlightGeography() {
      this.$refs.ExplorerMap.unHighlightGeographyLayer();
    },

    /**
     * Handle the input change from the geography search bar
     */
    handleGeographySelection({ name, type }) {
      type = type.toLowerCase();
      if (type == "neighborhood tract") type = "tract";
      this.selectedGeographyType = type;
      this.selectedGeographyName = name;
    },

    /**
     * Reset the selected geography
     */
    resetSelectedGeography() {
      this.$refs.ExplorerMap.unHighlightGeographyLayer();
      this.selectedGeographyName = null;
      this.selectedGeographyType = null;
    },
  },
};
</script>
