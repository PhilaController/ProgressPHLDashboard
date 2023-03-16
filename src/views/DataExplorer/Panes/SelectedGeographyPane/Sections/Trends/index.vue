<template>
  <div class="tw-flex tw-w-full tw-flex-col">
    <!-- Section title -->
    <div
      class="tw-flex tw-items-end tw-border-b tw-border-stone-300 tw-px-4 tw-pb-1 sm:tw-px-0"
    >
      <!-- Custom logo -->
      <div class="tw-mr-1.5 tw-h-8 tw-w-8 tw-pt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 205.34 154"
          className="fa-scatter"
        >
          <polygon
            points="13 141.48 13 0 0 0 0 141.48 0 154 13 154 205.34 154 205.34 141.48 13 141.48"
          />
          <circle cx="78.5" cy="44.5" r="13.17" />
          <circle cx="39.84" cy="113.5" r="13.17" />
          <circle cx="91.67" cy="95.5" r="13.17" />
          <circle cx="132.67" cy="85.5" r="13.17" />
          <circle cx="177.67" cy="16.83" r="13.17" />
          <circle cx="169.34" cy="113.5" r="13.17" />
        </svg>
      </div>
      <div class="tw-ml-2 tw-text-2xl tw-font-bold">Citywide Trends</div>
    </div>

    <!-- Intro text -->
    <div class="tw-mt-3 tw-px-4 tw-text-sm sm:tw-px-0">
      <p>
        This section shows how the Philadelphia SPI compares to three
        traditional economic indicators: household income, poverty rate, and
        unemployment rate. These comparisons provide insight into how
        neighborhoods fare at turning their economic status into improved social
        outcomes.
      </p>

      <p class="tw-mt-3">
        The chart below includes one circle for each of the city's 372 populated
        neighborhood tracts, with the y-axis showing each tract's SPI score and
        the x-axis showing the value of each tract's economic indicator. A good
        exercise is to identify tracts with similar economic indicators (on the
        x-axis) and compare their SPI scores (on the y-axis) to identify those
        tracts that have been able to overperform and achieve higher levels of
        social progress than others.
      </p>
    </div>

    <!-- Title -->
    <div class="tw-mt-6 tw-px-4 sm:tw-px-0">
      <div class="tw-pb-2 tw-text-base tw-font-semibold">
        Chart Interactions
      </div>

      <p class="tw-text-sm">
        <template v-if="selectedGeographyType == 'tract'">
          The score for the
          <span class="tw-font-medium">{{ selectedGeographyName }}</span>
          tract is selected and highlighted in red. To change the main tract
          selection, hover over and click on a specific circle in the chart.
        </template>
        <template v-else>
          The scores for the
          <span class="tw-font-medium">{{ focusedIds.length }} tracts</span>
          in the
          <span class="tw-font-medium"
            >{{ selectedGeographyName }} {{ selectedGeographyType }}</span
          >
          are highlighted in red. To change the main tract selection, hover over
          and click on a specific circle in the chart.
        </template>
        To add a tract to the scorecard comparison tab, hold command
        <span>(<command-icon />)</span>
        and click on a circle in the chart.
      </p>
    </div>

    <!-- Chart options -->
    <div class="tw-mt-6 tw-px-4 sm:tw-px-0">
      <!-- Title -->
      <div class="tw-pb-2 tw-text-base tw-font-semibold">Chart Options</div>

      <div class="tw-flex tw-w-full tw-flex-col tw-gap-10 md:tw-flex-row">
        <!-- X/Y dropdowns -->
        <div
          class="tw-flex tw-w-full tw-flex-grow tw-flex-col tw-justify-start md:tw-w-1/2"
        >
          <!-- x-axis dropdown  -->
          <div class="tw-max-w-[400px]">
            <div
              for="dropdown-x-axis"
              class="tw-mb-1 tw-text-xs tw-italic tw-text-neutral-500"
            >
              Select the economic variable on the x-axis
            </div>
            <dropdown
              id="dropdown-x-axis"
              class="tw-text-sm"
              v-model="selectedComparisonVariable"
              :options="
                comparisonVariables.map((d) => {
                  return { label: comparisonAliases[d], value: d };
                })
              "
            />
          </div>

          <!-- Y-axis dropdown  -->
          <div class="tw-mt-3 tw-max-w-[400px]">
            <div
              for="dropdown-y-axis"
              class="tw-mb-1 tw-text-xs tw-italic tw-text-neutral-500"
            >
              Select the SPI variable on the y-axis
            </div>
            <dropdown
              id="dropdown-y-axis"
              class="tw-text-sm"
              v-model="selectedSPIVariable"
              :options="
                SPIVariables.map((d) => {
                  return {
                    label: metadata.aliases[d],
                    value: d,
                  };
                })
              "
            />
          </div>
        </div>

        <!-- Demographic Filter -->
        <div class="tw-flex tw-w-full tw-flex-grow tw-flex-col md:tw-w-1/2">
          <div class="tw-max-w-[400px]">
            <div
              class="tw-mb-2 tw-flex tw-justify-between tw-text-xs tw-text-neutral-500"
            >
              <div
                role="label"
                for="dropdown-demographic-cut"
                class="tw-italic"
              >
                Filter visible tracts by a specific demographic variable
              </div>
              <div
                class="hover:tw-cursor-point tw-leading tw-rounded tw-border tw-border-neutral-500 tw-bg-neutral-100/50 tw-py-1 tw-px-1.5 tw-text-xs tw-uppercase hover:tw-bg-neutral-200/50"
                :class="{
                  disabled:
                    !selectedDemographicVariable && !demographicCutoffValue,
                }"
                role="button"
                @click.prevent="handleDemographicReset"
              >
                Reset
              </div>
            </div>
            <dropdown
              id="dropdown-demographic-cut"
              class="tw-text-sm"
              v-model="selectedDemographicVariable"
              placeholder="Select a demographic variable"
              :options="
                demographicVariables.map((d) => {
                  return { label: comparisonAliases[d], value: d };
                })
              "
            />
          </div>
          <input-button
            ref="demographicFilterInput"
            class="tw-mt-2.5 tw-max-w-[400px]"
            placeholder="Cutoff value, e.g. population >50%"
            @input="demographicCutoffValue = $event"
          />

          <div
            class="tw-mt-2 tw-min-h-[50px] tw-max-w-[400px] tw-text-xs tw-italic"
          >
            <template v-if="hiddenIds.length > 0 && selectedData">
              Currently showing {{ visibleTracts }} out of
              {{ selectedData.length }} tracts where
              {{ comparisonAliases[selectedDemographicVariable] }} residents
              represent at least {{ demographicCutoffValue }}% of the population
            </template>
            <template v-else-if="selectedData"
              >Currently showing all {{ selectedData.length }} tracts</template
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="tw-relative tw-mt-4 tw-flex tw-w-full tw-flex-col tw-justify-start tw-px-0 sm:tw-px-0"
    >
      <div
        class="tw-absolute tw-top-0 tw-right-0 tw-z-[7] tw-w-[400px] tw-rounded tw-border tw-border-gray-300 tw-px-2 tw-py-1"
      >
        <p v-if="scorecardTracts.length === 0" class="tw-text-sm tw-italic">
          No tracts selected for scorecard comparison. To add a tract, hold
          command
          <span>(<command-icon />)</span>
          and click on a circle in the chart.
        </p>
        <p v-else class="tw-text-sm tw-italic">
          Tracts selected for scorecard comparison:<br />
          <span class="tw-font-medium">{{ scorecardTracts.join(", ") }}</span>
          <span
            class="tw-ml-3 tw-font-semibold tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] hover:tw-underline focus:tw-outline-none active:tw-text-[#0F7582]"
            @click.prevent="handleScorecardTractReset"
            >Clear</span
          >
        </p>
      </div>

      <scatter-chart
        v-if="selectedData"
        ref="scatterChart"
        class="tw-mt-4"
        :height="550"
        :max-width="1000"
        :data="selectedData"
        :hidden-ids="hiddenIds"
        :focused-ids="focusedIds"
        :xlabel="comparisonAliases[selectedComparisonVariable]"
        :ylabel="metadata.aliases[selectedSPIVariable]"
        :x-tick-format="tickFormatter"
        :x-label-format="labelFormatter"
        @click="$emit('geography:select', $event)"
        @right-click="handleRightClick"
        @mouseover="$emit('geography:hover', $event)"
        @mouseleave="$emit('geography:unhover')"
      />
      <div v-else class="tw-min-h-[600px]"></div>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import Dropdown from "@/components/Dropdowns/Dropdown";
import ScatterChart from "./ScatterChart";
import InputButton from "./InputButton";
import CommandIcon from "./CommandIcon";
import { json } from "d3-fetch";
import { format } from "d3-format";

// The SPI url
const SPI_URL = "https://spi-dashboard-data.s3.amazonaws.com/v1/trends";

export default {
  name: "TrendsSection",
  props: [
    "data",
    "metadata",
    "selectedGeographyName",
    "selectedGeographyType",
    "focusedIds",
    "scorecardTracts",
  ],
  components: {
    ScatterChart,
    Dropdown,
    InputButton,
    LoadingOverlay,
    CommandIcon,
  },
  data() {
    return {
      /**
       * Variables to compare SPI against
       */
      comparisonVariables: [
        "median_household_income",
        "poverty_rate",
        "unemployment_rate",
      ],
      comparisonAliases: {
        median_household_income: "Median Household Income",
        poverty_rate: "Poverty Rate",
        unemployment_rate: "Unemployment Rate",
        percent_black: "Black (Non-Hispanic)",
        percent_white: "White (Non-Hispanic)",
        percent_asian: "Asian (Non-Hispanic)",
        percent_hispanic: "Hispanic",
      },

      // Demographic variables
      demographicVariables: [
        "percent_white",
        "percent_black",
        "percent_asian",
        "percent_hispanic",
      ],

      /**
       * Selected variables
       */
      selectedSPIVariable: null,
      selectedComparisonVariable: null,
      selectedDemographicVariable: null,
      demographicCutoffValue: null,

      /**
       * Data cache
       */
      dataCache: {},
      comparisonData: null,
      demographicData: null,

      /**
       * Is the chart ready?
       */
      chartReady: false,
    };
  },

  created() {
    // Set the default variables
    this.selectedSPIVariable = "social_progress_index";
    this.selectedComparisonVariable = "median_household_income";
  },

  watch: {
    /**
     * When selected comparison variable changes, pull new data
     */
    selectedComparisonVariable(value) {
      // Chart isn't ready
      this.chartReady = false;

      // Fetch
      this.fetchData(value).then((data) => {
        this.dataCache[value] = this.comparisonData = data;
        this.chartReady = true;
      });
    },

    /**
     * Get the selected demographic data when value changes
     */
    selectedDemographicVariable(value) {
      if (value) {
        // Chart isn't ready
        this.chartReady = false;

        // Fetch
        this.fetchData(value).then((data) => {
          this.dataCache[value] = this.demographicData = data;
          this.chartReady = true;
        });
      } else {
        this.demographicData = null;
      }
    },
  },
  computed: {
    tickFormatter() {
      // Format $
      if (this.selectedComparisonVariable === "median_household_income")
        return this.getIncomeFormatter(0);
      else if (this.selectedComparisonVariable === "poverty_rate")
        return this.getPercentFormatter(0);
      else if (this.selectedComparisonVariable === "unemployment_rate")
        return this.getPercentFormatter(0);
    },
    labelFormatter() {
      // Format $
      if (this.selectedComparisonVariable === "median_household_income")
        return this.getIncomeFormatter(1);
      else if (this.selectedComparisonVariable === "poverty_rate")
        return this.getPercentFormatter(1);
      else if (this.selectedComparisonVariable === "unemployment_rate")
        return this.getPercentFormatter(1);
    },

    /**
     * Selected SPI data
     */
    selectedSPIData() {
      if (this.selectedSPIVariable) return this.data[this.selectedSPIVariable];
    },

    selectedData() {
      // Need these datasets to show chart
      if (!this.selectedSPIData || !this.comparisonData) return;

      // Copy
      let out = this.selectedSPIData.map((a) => {
        return { ...a };
      });

      // Set up the map
      let m = new Map();
      // Insert all entries keyed by ID into the Map, filling in placeholder
      out.forEach(function (x) {
        x.comparison = null;
        m.set(x.geoid, x);
      });

      // For values in comparison', insert them if missing, otherwise, update existing values:
      this.comparisonData.forEach((x) => {
        let existing = m.get(x.geoid);
        if (existing) Object.assign(existing, { comparison: x.estimate });
      });

      // Extract resulting combined objects from the Map as an Array
      return Array.from(m.values()).map((d) => {
        return {
          y: d.value, // SPI value
          x: d.comparison, // Comparison value
          name: `${d.neighborhood_name} ${+d.tract_id}`,
          geoid: d.geoid,
        };
      });
    },

    visibleTracts() {
      if (this.selectedData) {
        if (this.hiddenIds.length === 0) return this.selectedData.length;
        else
          return this.selectedData.filter(
            (d) => !this.hiddenIds.includes(d.geoid)
          ).length;
      }
    },

    hiddenIds() {
      if (!this.selectedData || !this.demographicData) return [];
      if (!this.demographicCutoffValue || !this.selectedDemographicVariable)
        return [];

      let data = this.demographicData;
      return data
        .filter((d) => d.estimate < this.demographicCutoffValue / 100)
        .map((d) => d.geoid);
    },

    SPIVariables() {
      let out = ["social_progress_index"];
      const dimensions = this.metadata.hierarchy["social_progress_index"];

      // Loop over dimensions and components
      for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        out.push(dim);
        const components = this.metadata.hierarchy[dim];
        for (let j = 0; j < components.length; j++) {
          const component = components[j];
          out.push(component);
        }
      }

      return out;
    },
  },
  methods: {
    handleScorecardTractReset() {
      this.$emit("comparison:reset");
      this.$refs.scatterChart.resetRightClickSelection();
    },

    /**
     * Handle right click
     */
    handleRightClick({ name }) {
      if (this.scorecardTracts.includes(name))
        this.$emit("comparison:remove", name);
      else if (this.scorecardTracts.length < 2) {
        this.$emit("comparison:add", name);
      }
    },
    handleDemographicReset() {
      this.$refs.demographicFilterInput.handleClear();
      this.selectedDemographicVariable = null;
    },
    getDropdownIndent(d) {
      if (d == "social_progress_index") return "";
      else if (this.metadata.hierarchy["social_progress_index"].includes(d))
        return " &nbsp; ";
      else return " &nbsp;&nbsp;&nbsp; ";
    },
    getIncomeFormatter(decimals) {
      return (d) => "$" + format(`,.${decimals}f`)(d / 1e3) + "k";
    },
    getPercentFormatter(decimals) {
      return (d) => format(`,.${decimals}f`)(d * 100) + "%";
    },

    /**
     * Fetch data from s3
     */
    fetchData(tag) {
      const url = `${SPI_URL}/${tag}.json`;
      return json(url);
    },
  },
};
</script>

<style scoped>
.disabled {
  @apply tw-cursor-not-allowed tw-opacity-25 hover:tw-bg-neutral-100/50  !important;
}
</style>
