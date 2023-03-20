<template>
  <div class="tw-flex tw-h-full tw-w-full tw-flex-col">
    <!--Scorecard modal -->
    <scorecard-popup
      :showing="modalShowing"
      @close="modalShowing = false"
      :metadata="metadata"
      :data="data"
      :variable="scorecardValue"
      :tract-name="selectedGeographyName"
    />

    <!-- Title-->
    <div
      class="tw-flex tw-items-end tw-border-b tw-border-stone-300 tw-pb-1 tw-leading-none"
    >
      <!-- SPI Logo -->
      <div class="tw-flex tw-h-[30px] tw-w-[30px] tw-items-end tw-pb-1">
        <div
          class="tw-mx-[1px] tw-h-1/3 tw-flex-grow tw-border tw-border-green-500 tw-bg-green-300"
        ></div>
        <div
          class="tw-mx-[1px] tw-h-2/3 tw-flex-grow tw-border tw-border-orange-500 tw-bg-orange-300"
        ></div>
        <div
          class="tw-mx-[1px] tw-h-full tw-flex-grow tw-border tw-border-cyan-500 tw-bg-cyan-300"
        ></div>
      </div>
      <div class="tw-ml-2 tw-text-2xl tw-font-semibold">
        Social Progress Scores
      </div>
    </div>

    <!-- Intro text -->
    <div class="tw-mt-3 tw-text-sm">
      <p>
        This section shows the SPI scores for each of the city's 372 populated
        neighborhood tracts, with each circle representing the score for one
        tract. A tract's SPI score is the average of its scores for the
        <template v-for="(name, i) in dimensionNames">
          <span v-if="i !== 0">, </span>
          <span v-if="i === dimensionNames.length - 1"> and </span>
          <span class="tw-font-medium" :class="getTextColorByDimension(name)">{{
            metadata.aliases[name]
          }}</span>
        </template>
        dimensions. The score for each dimension is the average of four
        component scores.
      </p>

      <!-- Subheader -->
      <div class="tw-mt-4 tw-text-sm tw-font-semibold tw-underline">
        Chart Guide
      </div>
      <p class="tw-mt-0.5">
        <template v-if="selectedGeographyType == 'tract'">
          In the charts below, the score for the
          <span class="tw-font-medium">{{ selectedGeographyName }}</span>
          tract is selected. To view data for a different tract, click on a
          specific circle.
        </template>
        <template v-else>
          In the charts below, the scores for
          <span class="tw-font-medium">{{ selectedGeographySize }} tracts</span>
          in the
          <span class="tw-font-medium"
            >{{ selectedGeographyName }} {{ selectedGeographyType }}</span
          >
          are highlighted. To view data for an individual tract, click on a
          specific circle.
        </template>
        You can also hover over a tract in the map to see its data highlighted
        in the charts below.
      </p>

      <p class="tw-mt-4">
        Use the
        <span class="tw-inline tw-text-sm tw-text-gray-400"
          ><i class="fas fa-info-circle"></i
        ></span>
        icon to see a variable's definition, the
        <span class="tw-inline tw-text-sm tw-text-gray-400"
          ><i class="far fa-eye"></i
        ></span>
        icon to show the variable on the map, and the
        <span class="tw-inline tw-text-sm tw-text-gray-400"
          ><i class="fas fa-table"></i
        ></span>
        icon to show a variable's underlying data indicators.
      </p>
    </div>

    <!-- Charts part -->
    <div
      class="tw-relative tw-mt-10 tw-grid tw-grid-cols-2 tw-gap-0"
      id="strip-plots-container"
    >
      <!-- SPI: Header -->
      <div class="tw-flex tw-flex-col tw-pl-4" id="spi_header">
        <div class="tw-text-lg tw-font-semibold">
          {{ metadata.aliases["social_progress_index"] }}
        </div>
      </div>

      <!-- SPI: Chart -->
      <div class="tw-ml-2">
        <strip-plot
          :data="data['social_progress_index']"
          :title="metadata.aliases['social_progress_index']"
          :focused-ids="focusedIds"
          :hovered-id="hoveredId"
          :add-axis-labels="true"
          @click="$emit('geography:select', $event)"
          @mouseover="$emit('geography:hover', $event)"
          @mouseleave="$emit('geography:unhover')"
          @ready="loadedCharts += 1"
        />
      </div>

      <!-- Dimensions -->
      <template v-for="dimension in dimensionNames">
        <!-- Dimension Header -->
        <div
          class="tw-mt-6 tw-flex tw-w-full tw-flex-col tw-border-l-2 tw-pl-4"
          :class="getBorderColorByDimension(dimension)"
        >
          <div
            class="tw-text-base tw-font-semibold"
            :id="`${dimension}_header`"
          >
            {{ metadata.aliases[dimension] }}
          </div>

          <options-menu
            :variable="dimension"
            :selected-geography-type="selectedGeographyType"
            @update:map-variable="$emit('update:map-variable', $event)"
            @scorecard="
              {
                scorecardValue = $event;
                modalShowing = true;
              }
            "
          />
        </div>

        <!-- Chart -->
        <div class="tw-mt-6 tw-ml-2">
          <strip-plot
            :data="data[dimension]"
            :title="metadata.aliases[dimension]"
            :focused-ids="focusedIds"
            :hovered-id="hoveredId"
            @click="$emit('geography:select', $event)"
            @mouseover="$emit('geography:hover', $event)"
            @mouseleave="$emit('geography:unhover')"
            @ready="loadedCharts += 1"
          />
        </div>

        <!-- Components -->
        <template v-for="component in metadata.hierarchy[dimension]">
          <!-- Dimension Header -->
          <div
            class="tw-flex tw-w-full tw-max-w-[250px] tw-flex-row tw-border-l-2 tw-pl-3"
            :class="getBorderColorByDimension(dimension)"
          >
            <div
              class="tw-w-1 tw-border-l-2 tw-pl-0.5"
              :class="getBorderColorByDimension(dimension)"
            ></div>
            <div class="tw-ml-2 tw-flex tw-flex-col">
              <div
                class="tw-text-sm tw-leading-tight"
                :id="`${component}_header`"
              >
                {{ metadata.aliases[component] }}
              </div>

              <options-menu
                :variable="component"
                :selected-geography-type="selectedGeographyType"
                @update:map-variable="$emit('update:map-variable', $event)"
                @scorecard="
                  {
                    scorecardValue = $event;
                    modalShowing = true;
                  }
                "
              />
            </div>
          </div>

          <!-- Chart -->
          <div class="tw-ml-2 tw-pt-1">
            <strip-plot
              :data="data[component]"
              :title="metadata.aliases[component]"
              :focused-ids="focusedIds"
              :hovered-id="hoveredId"
              @click="$emit('geography:select', $event)"
              @mouseover="$emit('geography:hover', $event)"
              @mouseleave="$emit('geography:unhover')"
              @ready="loadedCharts += 1"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import StripPlot from "./StripPlot";
import OptionsMenu from "./OptionsMenu";
import ScorecardPopup from "./ScorecardPopup";
import { mapState } from "vuex";

export default {
  name: "StripPlotsSection",
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
  },
  components: {
    StripPlot,
    OptionsMenu,
    ScorecardPopup,
  },
  data() {
    return {
      /**
       * Count how many strip plots have loaded (16 total)
       */
      loadedCharts: 0,

      /**
       * Variables for scorecard popup
       */
      modalShowing: false,
      scorecardValue: null,
    };
  },

  watch: {
    /**
     * Emit event when chart has loaded
     */
    loadedCharts(value) {
      this.$emit("loaded-charts", value);
    },
  },
  computed: {
    // Get variables from store
    ...mapState(["data", "metadata", "dimensionNames"]),

    /**
     * Number of tracts in the selected geography
     */
    selectedGeographySize() {
      return this.focusedIds.length;
    },
  },
  methods: {
    /**
     * Dimension text colors
     */
    getTextColorByDimension(name) {
      if (name == "basic_human_needs") return "tw-text-cyan-500";
      else if (name == "foundations_of_wellbeing") return "tw-text-orange-500";
      else return "tw-text-green-500";
    },

    /**
     * Dimension border colors
     */
    getBorderColorByDimension(name) {
      if (name == "basic_human_needs") return "tw-border-cyan-400/75";
      else if (name == "foundations_of_wellbeing")
        return "tw-border-orange-400/75";
      else return "tw-border-green-400/75";
    },
  },
};
</script>

<style>
#strip-plots-container {
  grid-template-columns: auto minmax(0, 1fr);
}
</style>
