<template>
  <div>
    <!-- Name -->
    <div
      class="scorecard-cell tw-pb-1"
      :class="`${borderClasses} ${variableClasses}`"
    >
      <div class="variable-name" :class="fontSize">
        {{ metadata.aliases[variable] }}
      </div>

      <clickable-icon
        v-if="showHelp"
        class="tw-ml-2 tw-text-sm"
        icon="fas fa-info-circle"
        color-class="tw-text-gray-300"
        hover-color-class="hover:tw-text-gray-600"
        @click="goToDefinition()"
      />
    </div>

    <template v-for="i in [0, 1]">
      <!-- Value -->
      <div class="scorecard-cell tw-justify-end tw-pb-1" :class="borderClasses">
        <div
          class="tw-text-right"
          :class="fontSize"
          v-html="formattedValues[i]"
        />
      </div>

      <!-- Rank -->
      <div
        class="scorecard-cell tw-justify-end tw-pl-4 tw-pb-1"
        :class="borderClasses"
      >
        <div class="tw-text-right tw-opacity-50" :class="fontSize">
          {{ selectedData[i].rank || "N/A" }}
        </div>
      </div>

      <!-- Circle -->
      <div
        class="scorecard-cell tw-items-center tw-justify-center tw-pb-1"
        :class="borderClasses"
      >
        <scorecard-circle
          class="tw-mx-2 tw-mb-1"
          :class="circleSizeClasses"
          :label="selectedData[i].average_label"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { format } from "d3-format";
import ClickableIcon from "@/components/ClickableIcon";
import ScorecardCircle from "../../components/ScorecardCircle";

export default {
  name: "DataRowDouble",
  props: {
    /**
     * SPI data
     */
    data: { type: Object, required: true },

    /**
     * Metadata for SPI
     */
    metadata: { type: Object, required: true },

    /**
     * First tract name
     */
    tractNameFirst: { type: String, required: true },

    /**
     * Second tract name
     */
    tractNameSecond: { type: String, required: true },

    /**
     * Variable name
     */
    variable: { type: String, required: true },

    /**
     * Class for font size
     */
    fontSize: {
      type: String,
      default: "tw-text-xl",
    },

    /**
     * Whether to include a border
     */
    showBorder: { type: Boolean, default: false },

    /**
     * Circle size
     */
    circleSize: { type: String, default: 10 },

    /**
     * Border direction
     */
    borderDirection: { type: String, default: "b" },

    /**
     * Class for variable
     */
    variableClasses: { type: String, default: "" },

    /**
     * Show the info icon
     */
    showHelp: { type: Boolean, default: false },
  },
  components: { ClickableIcon, ScorecardCircle },
  computed: {
    /**
     * Tracts
     */
    tractNames() {
      return [this.tractNameFirst, this.tractNameSecond];
    },

    /**
     * Clases for border
     */
    borderClasses() {
      if (!this.showBorder) return "";
      else if (this.borderDirection == "t")
        return "tw-border-t tw-border-stone-300";
      else return "tw-border-b tw-border-stone-300";
    },

    /**
     * Classes for circle size
     */
    circleSizeClasses() {
      if (this.circleSize == 10) return "tw-h-10 tw-w-10";
      else if (this.circleSize == 8) return "tw-h-8 tw-w-8";
      else if (this.circleSize == 6) return "tw-h-6 tw-w-6";
      else if (this.circleSize == 4) return "tw-h-4 tw-w-4";
    },

    /**
     * Definitions exist for indicators only
     */
    isIndicator() {
      return this.definition !== undefined;
    },

    /**
     * The data for this variable and tract
     */
    selectedData() {
      return this.tractNames.map((name) => this.getData(name));
    },

    /**
     * Definition for selected variable
     */
    definition() {
      return this.metadata.definitions[this.variable];
    },

    /**
     * The formatted values
     */
    formattedValues() {
      return this.tractNames.map((name) => this.getFormattedValue(name));
    },
  },
  methods: {
    goToDefinition() {
      this.$router.push({
        path: "/definitions",
        query: { value: this.variable },
      });
    },

    getData(name) {
      return this.data[this.variable].find(
        (d) => `${d.neighborhood_name} ${+d.tract_id}` === name
      );
    },

    getFormattedValue(name) {
      // No value? ==> return N/A
      let d = this.getData(name);
      if (d.value === null || d.value === undefined) return "N/A";

      // Check the definition
      let def = this.definition;

      // If no definition, it is a dimension/component score
      if (!this.isIndicator) {
        return `${format(".1f")(d.value)} / 100`;
      } else {
        let fmt = format(def.fmt);
        let out = fmt(d.value);
        if (def.percentage) out += "%";
        else if (def.units) out += ` ${def.units}`;
        return out;
      }
    },
  },
};
</script>
