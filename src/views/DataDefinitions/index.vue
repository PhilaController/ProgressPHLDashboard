<template>
  <!-- Show a loader -->
  <loading-page v-if="isLoading" />

  <!-- If data is loaded, show the definitions content -->
  <div
    v-else
    class="tw-relative tw-flex tw-flex-col"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <!-- The top section -->
    <div
      class="tw-relative tw-mx-auto tw-w-full tw-max-w-5xl tw-pb-10 sm:tw-px-4"
      :style="getPaddingTop(navBarHeight)"
    >
      <!-- Overlay -->
      <loading-overlay v-if="!mapLoaded" />

      <!-- Definitions wrapper -->
      <definitions-table
        ref="definitions"
        :hierarchy="metadata.hierarchy"
        :aliases="metadata.aliases"
        :definitions="metadata.definitions"
        :dimension-names="dimensionNames"
        :is-loading="isLoading"
        @dimension="selectedDimension = $event"
      />

      <!-- Indicator map -->
      <indicator-map
        class="tw-mt-10 tw-px-2 sm:tw-px-0"
        ref="indicatorMap"
        v-if="selectedVariable && selectedDimension"
        :data="data"
        :aliases="metadata.aliases"
        :hierarchy="metadata.hierarchy"
        :definitions="metadata.definitions"
        :geojson="geojson"
        :selected-variable="metadata.aliases[selectedVariable]"
        :selected-dimension="selectedDimension"
        @loaded="mapLoaded = true"
      />
    </div>
  </div>
</template>

<script>
import LoadingPage from "@/components/LoadingPage";
import Navbar from "@/components/Navbar";
import LoadingOverlay from "@/components/LoadingOverlay";
import DefinitionsTable from "./DefinitionsTable";
import IndicatorMap from "./IndicatorMap";

export default {
  name: "DataDefinitions",
  props: [
    "metadata",
    "data",
    "geojson",
    "controllerNavHeight",
    "navBarHeight",
    "usePadding",
  ],
  components: {
    LoadingPage,
    Navbar,
    DefinitionsTable,
    IndicatorMap,
    LoadingOverlay,
  },
  data() {
    return {
      mapLoaded: false,
      selectedDimension: null,
      dimensionNames: [
        "basic_human_needs",
        "foundations_of_wellbeing",
        "opportunity",
      ],
    };
  },

  computed: {
    selectedVariable() {
      return this.$route.query.value;
    },
    isLoading() {
      return this.metadata == null || this.data == null || this.geojson == null;
    },
  },
  methods: {
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>
