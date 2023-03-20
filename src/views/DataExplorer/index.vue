<template>
  <content-wrapper
    :is-loading="isLoading"
    wrapper-class="lg:tw-h-screen tw-text-lg"
    content-class="tw-flex-col lg:tw-flex-row"
  >
    <!-- Make sure this doesn't render until data is loaded -->
    <template v-if="!isLoading" #default>
      <!-- Show an overlay if map isn't loaded -->
      <div
        v-if="showOverlay"
        class="tw-fixed tw-inset-0 tw-z-[10] tw-flex tw-h-screen tw-w-screen tw-bg-white/75"
      ></div>

      <!-- Map -->
      <div
        class="tw-h-[400px] tw-w-full tw-border-x-4 tw-border-y-4 tw-border-stone-400/50 lg:tw-h-full lg:tw-w-1/3"
      >
        <explorer-map
          ref="ExplorerMap"
          :displayed-variable="mappedVariable"
          :selected-geography-name="selectedGeographyName"
          :selected-geography-type="selectedGeographyType"
          :focused-ids="focusedIds"
          @geography:select="handleGeographySelection"
          @geography:hover="hoveredId = $event"
          @geography:unhover="hoveredId = null"
          @update:map-variable="($event) => (mappedVariable = $event)"
          @loaded="showOverlay = false"
        />
      </div>

      <!-- Content -->
      <div
        class="tw-w-full tw-border-b-4 tw-border-stone-400/50 tw-pb-10 lg:tw-w-2/3 lg:tw-overflow-y-scroll"
        id="content-container"
      >
        <!-- Welcome Pane: No neighborhood selection  -->
        <welcome-pane
          v-if="selectedGeographyName === null"
          :selected-geography-name="selectedGeographyName"
          @geography:select="handleGeographySelection"
        />

        <!-- Geography page: selected geography-->
        <selected-geography-pane
          v-else
          :selected-geography-name="selectedGeographyName"
          :selected-geography-type="selectedGeographyType"
          :focused-ids="focusedIds"
          :hovered-id="hoveredId"
          @comparison:add="handleComparisonAdd"
          @comparison:reset="handleComparisonReset"
          @comparison:remove="handleComparisonRemove"
          @geography:reset="resetSelectedGeography"
          @geography:select="handleGeographySelection"
          @geography:highlight="highlightGeography"
          @geography:unhighlight="unHighlightGeography"
          @geography:hover="handleStripPlotMouseover"
          @geography:unhover="handleStripPlotMouseleave"
          @update:map-variable="($event) => (mappedVariable = $event)"
          @loaded-charts="handleChartLoad"
        />
      </div>
    </template>
  </content-wrapper>
</template>

<script>
// Local
import ContentWrapper from "@/components/ContentWrapper";
import WelcomePane from "./Panes/WelcomePane";
import SelectedGeographyPane from "./Panes/SelectedGeographyPane";
import ExplorerMap from "./ExplorerMap.vue";

// external
import { mapState } from "vuex";

export default {
  name: "DataExplorer",
  components: {
    ContentWrapper,
    WelcomePane,
    SelectedGeographyPane,
    ExplorerMap,
  },
  data() {
    return {
      /**
       * Should we show an overlay
       */
      showOverlay: true,

      /**
       * Count loaded strip plots
       */
      loadedCharts: 0,

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
  },
  computed: {
    // Grab state from data store
    ...mapState([
      "data",
      "metadata",
      "geojson",
      "neighborhoodNames",
      "regionNames",
      "scorecardTractNames",
    ]),

    /**
     * Whether we need to show spinner until data is loaded
     */
    isLoading() {
      return (
        this.data === null || this.geojson === null || this.metadata === null
      );
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

  beforeDestroy() {
    this.$store.commit("setValue", {
      key: "scorecardTractNames",
      value: [],
    });
  },

  methods: {
    handleChartLoad(value) {
      this.loadedCharts = value;
      if (value == 16 && this.showOverlay) this.showOverlay = false;
    },
    /**
     * Update comparison add
     */
    handleComparisonAdd(name) {
      if (!name) name = this.selectedGeographyName;

      let names = this.scorecardTractNames;
      if (!names.includes(name)) {
        // Add it
        let out = [...names];
        out.push(name);
        console.log("HEY", out);

        // Save it
        this.$store.commit("setValue", {
          key: "scorecardTractNames",
          value: out,
        });
      }
    },

    /**
     * Handle comparison reset
     */
    handleComparisonReset() {
      this.$store.commit("setValue", {
        key: "scorecardTractNames",
        value: [],
      });
    },

    /**
     * Update comparison remove
     */
    handleComparisonRemove(name) {
      if (!name) name = this.selectedGeographyName;

      // Save it
      this.$store.commit("setValue", {
        key: "scorecardTractNames",
        value: this.scorecardTractNames.filter((d) => d !== name),
      });
    },

    /**
     * Handle mouseover event from a strip plot
     */
    handleStripPlotMouseover({ name, type }) {
      this.highlightGeography({ name, type });
    },

    /**
     * Handle mouseleave event from a strip plot
     */
    handleStripPlotMouseleave() {
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
      // Format the type
      type = type.toLowerCase();
      if (type == "neighborhood tract") type = "tract";

      // Welcome pane to selected pane
      // This is slow b/c of initial creation of 16 strip plots
      if (this.selectedGeographyName === null) {
        // Turn on the overlay while it loads
        this.showOverlay = true;

        // Update after short delay so overlay shows first
        setTimeout(() => {
          this.selectedGeographyType = type;
          this.selectedGeographyName = name;
        }, 50);
      }
      // Just update (strip plots are already loaded)
      else {
        this.selectedGeographyType = type;
        this.selectedGeographyName = name;
      }
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
