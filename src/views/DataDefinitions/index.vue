<template>
  <content-wrapper
    :controller-nav-height="controllerNavHeight"
    :use-padding="usePadding"
    :nav-bar-height="navBarHeight"
    :is-loading="isLoading"
  >
    <div
      v-if="!isLoading"
      class="tw-relative tw-mx-auto tw-w-full tw-max-w-5xl tw-pb-10 sm:tw-px-4"
    >
      <!-- Overlay -->
      <loading-overlay v-if="!mapLoaded" />

      <!-- Definitions wrapper -->
      <definitions-table
        ref="definitions"
        :hierarchy="metadata.hierarchy"
        :aliases="metadata.aliases"
        :definitions="metadata.definitions"
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
        :selected-variable="selectedVariable"
        :selected-dimension="selectedDimension"
        @loaded="mapLoaded = true"
      />
    </div>
  </content-wrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import DefinitionsTable from "./DefinitionsTable";
import IndicatorMap from "./IndicatorMap";

export default {
  name: "DataDefinitions",
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
    LoadingOverlay,
    ContentWrapper,
    DefinitionsTable,
    IndicatorMap,
  },
  data() {
    return {
      /**
       * Has the map fully loaded?
       */
      mapLoaded: false,

      /**
       * The currently selected dimension, which sets the colormap
       */
      selectedDimension: null,
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
};
</script>
