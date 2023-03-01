<template>
  <div class="tw-flex tw-h-full tw-w-full tw-flex-col">
    <!-- Title-->
    <div
      class="tw-flex tw-items-end tw-border-b tw-border-stone-300 tw-pb-1 tw-leading-none"
    >
      <!-- SPI Logo -->
      <div class="tw-flex tw-h-[30px] tw-w-[30px] tw-items-end tw-pb-0.5">
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
      <div class="tw-ml-2 tw-text-2xl tw-font-bold tw-leading-none">
        SPI Scores Across Philadelphia
      </div>
    </div>

    <!-- Intro text -->
    <div class="tw-mt-3 tw-text-sm">
      <p>
        This section shows the SPI scores for each of the city's 372 populated
        neighborhood tracts, with each circle representing the score for one
        tract.
        <template v-if="selectedGeographyType == 'tract'">
          In the charts below, the score for the
          <span class="tw-font-medium">{{ selectedGeographyName }}</span>
          tract is selected. To view data for a different tract, hover over and
          click on a specific circle.
        </template>
        <template v-else>
          In the charts below, the scores for
          <span class="tw-font-medium">{{ selectedGeographySize }} tracts</span>
          in the
          <span class="tw-font-medium"
            >{{ selectedGeographyName }} {{ selectedGeographyType }}</span
          >
          are highlighted. To view data for an individual tract, hover over and
          click on a specific circle.
        </template>
      </p>
    </div>

    <!-- Charts part -->
    <div class="tw-relative" id="strip-plots-container">
      <!-- 1. SPI Chart-->
      <div class="tw-mt-8 tw-flex tw-items-center" id="spi_header">
        <div class="tw-text-xl tw-font-bold">
          {{ metadata.aliases["social_progress_index"] }}
        </div>

        <!-- More options icon -->
        <icon-dropdown
          class="ml-2 tw-flex tw-items-center"
          :options="['Show All Components', 'Hide All Components']"
          :option-callbacks="[
            () => dimensionNames.map((d) => expandDimension(d)),
            () => dimensionNames.map((d) => collapseDimension(d)),
          ]"
        >
          <i
            class="fas fa-ellipsis-h tw-text-xl tw-text-gray-400 hover:tw-cursor-pointer hover:tw-text-gray-600"
          ></i>
        </icon-dropdown>
      </div>
      <div class="tw-mt-0.5 tw-text-sm">
        A tract's SPI score is the average of its scores for the
        <template v-for="(name, i) in dimensionNames">
          <span v-if="i !== 0">, </span>
          <span v-if="i === dimensionNames.length - 1"> and </span>
          <span class="tw-font-medium" :class="getTextColorByDimension(name)">{{
            metadata.aliases[name]
          }}</span>
        </template>
        dimensions.
      </div>
      <strip-plot
        class="tw-mt-4"
        :data="data['social_progress_index']"
        :title="metadata.aliases['social_progress_index']"
        :focused-ids="focusedIds"
        :hovered-id="hoveredId"
        @click="$emit('geography:select', $event)"
        @mouseover="$emit('geography:hover', $event)"
        @mouseleave="$emit('geography:unhover')"
      />

      <!-- Loop over dimensions -->
      <div
        v-for="(dimension, i) in dimensionNames"
        :key="dimension"
        class="tw-mt-2 tw-flex tw-w-full tw-flex-col tw-border-l-2 tw-pl-4"
        :class="getBorderColorByDimension(dimension)"
      >
        <!-- Dimension Header -->
        <div class="tw-flex">
          <div class="tw-text-lg tw-font-bold" :id="`${dimension}_header`">
            Dimension #{{ i + 1 }}:
            {{ metadata.aliases[dimension] }}
          </div>

          <!-- More options icon -->
          <icon-dropdown
            class="ml-2 tw-flex tw-items-center"
            :options="getMoreOptions(dimension)"
            :option-callbacks="getMoreOptionsCallbacks(dimension)"
          >
            <i
              class="fas fa-ellipsis-h tw-text-xl tw-text-gray-400 hover:tw-cursor-pointer hover:tw-text-gray-600"
            ></i>
          </icon-dropdown>
        </div>

        <!-- Subheader -->
        <div class="tw-mt-0.5 tw-text-sm">
          <p>
            This dimension addresses the following question:
            <span class="tw-italic">{{ questions[dimension] }}</span>
          </p>
          <p class="tw-mt-4">
            A tract's score for this dimension is an average of its four
            component scores:
            <span v-html="getComponentList(dimension)"></span>. To see component
            scores, click on the
            <i class="fas fa-ellipsis-h tw-ml-1 tw-mr-1 tw-text-gray-500"></i>
            button above.
          </p>
        </div>

        <!-- Chart -->
        <strip-plot
          class="tw-mt-4"
          :data="data[dimension]"
          :title="metadata.aliases[dimension]"
          :focused-ids="focusedIds"
          :hovered-id="hoveredId"
          @click="$emit('geography:select', $event)"
          @mouseover="$emit('geography:hover', $event)"
          @mouseleave="$emit('geography:unhover')"
        />

        <!-- Loop over components -->
        <div
          v-for="(component, j) in metadata.hierarchy[dimension]"
          :key="component"
          class="tw-mt-4 tw-flex tw-w-full tw-flex-col tw-border-l-2 tw-pl-4"
          :class="getComponentClasses(dimension)"
        >
          <div class="tw-flex tw-items-center">
            <div class="tw-text-base tw-font-bold" :id="`${component}_header`">
              Component #{{ j + 1 }}:
              {{ metadata.aliases[component] }}
            </div>
          </div>

          <div class="tw-mt-0.5 tw-text-sm">
            <router-link
              class="tw-font-medium tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none"
              :title="`Go to the definition for the '${metadata.aliases[component]}' component`"
              :to="`/definitions?value=${component}`"
              >The definition</router-link
            >
            {{ componentDescriptions[component] }}
          </div>

          <strip-plot
            class="tw-mt-4 tw-flex-grow"
            :data="data[component]"
            :title="metadata.aliases[component]"
            :focused-ids="focusedIds"
            :hovered-id="hoveredId"
            @click="$emit('geography:select', $event)"
            @mouseover="$emit('geography:hover', $event)"
            @mouseleave="$emit('geography:unhover')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StripPlot from "./StripPlot";
import IconDropdown from "@/components/IconDropdown";

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
  components: { StripPlot, IconDropdown },
  data() {
    return {
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
