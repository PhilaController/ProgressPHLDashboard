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
      <div class="tw-ml-2 tw-text-2xl tw-font-bold">Social Progress Scores</div>
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
      <p class="tw-mt-4">
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

    /**
     * Number of tracts in selected geography
     */
    selectedGeographySize: { type: Number, required: true },
  },
  components: {
    StripPlot,
    OptionsMenu,
    ScorecardPopup,
  },
  data() {
    return {
      modalShowing: false,
      scorecardValue: null,
      /**
       * Variable names for dimensions
       */
      dimensionNames: [
        "basic_human_needs",
        "foundations_of_wellbeing",
        "opportunity",
      ],

      /**
       * Expanded dimensions
       */
      expandedDimensions: [],

      /**
       * Questions for each dimension
       */
      questions: {
        basic_human_needs:
          "Are Philadelphians' most essential needs being met?",
        foundations_of_wellbeing:
          "Are the building blocks in place for Philadelphians to enhance and sustain their wellbeing?",
        opportunity:
          "Is there opportunity for all Philadelphians to reach their full potential?",
      },

      /**
       * Component descriptions
       */
      componentDescriptions: {
        nutrition_and_medical_care:
          "includes indicators tracking dental care, preventative health care, and food stamp usage.",
        water_and_sanitation:
          "includes indicators tracking plumbing usage, impervious surfaces, and violations of Environmental Protection Agency regulations.",
        shelter:
          "includes indicators tracking evictions, housing crowdedness, and housing cost burdens.",
        personal_safety:
          "includes indicators tracking the rates of property crime, violent crime, and car accidents.",
        basic_knowledge_access:
          "includes indicators tracking educational attainment, preschool enrollment, and student proficiency in math and language arts.",
        info_comms_access:
          "includes indicators tracking internet access and type, and broadband upload and download speeds.",
        health_and_wellness:
          "includes indicators tracking the prevalence of cancer, heart disease, obesity, and poor mental health.",
        environmental_quality:
          "includes indicators tracking air quality and tree canopy loss.",
        personal_rights:
          "includes indicators tracking home ownership, voter registration, and voter turnout.",
        personal_freedom_and_choice:
          "includes indicators tracking the prevalance of non-vehicle commuters, walkability, disconnected youth, and dependents over the age of 65.",
        inclusiveness:
          "includes indicators tracking commute times, gender labor force participation and pay gaps, and residential isolation and segregation.",
        advanced_education_access:
          "includes indicators tracking educational attainment beyond the high school level.",
      },
    };
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

    /**
     * Is the input dimension expanded?
     */
    isExpanded(name) {
      return this.expandedDimensions.includes(name);
    },

    /**
     * Expand the input dimension
     */
    expandDimension(name) {
      this.expandedDimensions.push(name);
    },

    /**
     * Collapse the input dimension
     */
    collapseDimension(name) {
      this.expandedDimensions = this.expandedDimensions.filter(
        (dim) => dim !== name
      );
    },

    /**
     * Get the text for the 'more options' popup
     */
    getMoreOptions(name) {
      let out = [];
      if (this.isExpanded(name)) out.push("Hide Component Scores");
      else out.push("Show Component Scores");
      out.push("Go to Definition");
      return out;
    },

    /**
     * Get the callback functions for the "more options" button
     */
    getMoreOptionsCallbacks(name) {
      let out = [];
      if (this.isExpanded(name)) out.push(() => this.collapseDimension(name));
      else out.push(() => this.expandDimension(name));
      out.push(() => this.goToDefinition(name));
      return out;
    },

    /**
     * Go the specified definition page
     */
    goToDefinition(value) {
      this.$router.push({
        path: "/definitions",
        query: { value: value },
      });
    },

    /**
     * The list of classes for the component (optionally hidden)
     */
    getComponentClasses(dimension) {
      let out = this.getBorderColorByDimension(dimension);
      if (!this.isExpanded(dimension)) out += " tw-hidden";
      return out;
    },

    /**
     * Get the list of components in a dimension
     */
    getComponentList(dimension) {
      let h = this.metadata.hierarchy[dimension];
      let out = "";
      for (let i = 0; i < h.length; i++) {
        out += `<span class='tw-font-medium'>${
          this.metadata.aliases[h[i]]
        }</span>`;
        if (i !== h.length - 1) out += "; ";
        if (i === h.length - 2) out += "and ";
      }
      return out;
    },
  },
};
</script>

<style>
#strip-plots-container {
  grid-template-columns: auto minmax(0, 1fr);
}

. {
  grid-area: ;
}
. {
  grid-area: ;
}
</style>
