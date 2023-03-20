<template>
  <content-wrapper :is-loading="isLoading">
    <div
      v-if="!isLoading"
      class="tw-relative tw-mx-auto tw-w-full tw-max-w-5xl sm:tw-px-4"
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
        class="tw-mt-10 tw-px-2 tw-pb-20 sm:tw-px-0"
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
import { mapState } from "vuex";

export default {
  name: "DataDefinitions",
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
    ...mapState(["data", "metadata", "geojson"]),

    selectedVariable() {
      return this.$route.query.value;
    },
    isLoading() {
      return this.metadata == null || this.data == null || this.geojson == null;
    },
  },
};
</script>
