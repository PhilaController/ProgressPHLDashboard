<template>
  <div class="tw-flex tw-h-[1000px] tw-w-full tw-flex-col">
    <!-- Section title -->
    <div class="tw-flex tw-items-end tw-border-b tw-border-stone-300 tw-pb-1">
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
      <div class="tw-ml-2 tw-text-2xl tw-font-bold">SPI Correlations</div>
    </div>

    <!-- Intro text -->
    <div class="tw-mt-3 tw-text-sm">
      <p>
        This section shows how the Philadelphia SPI compares to three
        traditional economic indicators: household income, poverty rate, and
        unemployment rate. Although the Philadelphia SPI is designed to measure
        quality of life independent of economic data, comparisons to typical
        economic indicators provide insight into how neighborhoods fare at
        turning their economic status into improved social outcomes.
      </p>

      <div class="tw-font-base tw-mt-6 tw-font-semibold tw-underline">
        What the chart shows
      </div>
      <p class="tw-mt-1">
        The chart below includes one circle for each of the city's 372 populated
        neighborhood tracts, with the y-axis showing each tract's SPI score and
        the x-axis showing the value of each tract's comparison indicator. Use
        the dropdowns to choose which indicators are shown on the chart and
        explore how the relationship between the variables changes.
      </p>
      <p class="tw-mt-4">
        <template v-if="selectedGeographyType == 'tract'">
          The score for the
          <span class="tw-font-medium">{{ selectedGeographyName }}</span>
          tract is selected and highlighted in red. To view data for a different
          tract, hover over and click on a specific circle in the chart.
        </template>
        <template v-else>
          The scores for the
          <span class="tw-font-medium">{{ focusedIds.length }} tracts</span>
          in the
          <span class="tw-font-medium"
            >{{ selectedGeographyName }} {{ selectedGeographyType }}</span
          >
          are highlighted in red. To view data for an individual tract, hover
          over and click on a specific circle in the chart.
        </template>
      </p>
      <p class="tw-mt-4">
        A good exercise is to identify tracts with similar
        <span class="tw-font-medium"
          >{{
            comparisonAliases[selectedComparisonVariable].toLowerCase()
          }}
          values (on the x-axis)</span
        >
        and compare their
        <span class="tw-font-medium">SPI scores (on the y-axis)</span> to
        identify those tracts that have been able to overperform and achieve
        higher levels of social progress than others.
      </p>
    </div>

    <div class="tw-mt-10">
      <!-- Title -->
      <div class="tw-pb-2 tw-text-base tw-font-semibold">Chart Options</div>

      <div class="tw-flex tw-w-full tw-flex-row tw-gap-10">
        <!-- X/Y dropdowns -->
        <div
          class="tw-max-w-1/2 tw-flex tw-flex-grow tw-flex-col tw-justify-evenly"
        >
          <!-- x-axis dropdown  -->
          <div class="tw-max-w-[400px]">
            <div
              for="dropdown-x-axis"
              class="tw-mb-1 tw-text-xs tw-italic tw-text-neutral-500"
            >
              Select the variable on the x-axis
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
              Select the variable on the y-axis
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
        <div class="tw-max-w-1/2 tw-flex tw-flex-grow tw-flex-col">
          <div class="tw-max-w-[400px]">
            <div
              role="label"
              for="dropdown-demographic-cut"
              class="tw-mb-0.5 tw-text-xs tw-italic tw-text-neutral-500"
            >
              Filter visible tracts by a specific demographic variable
            </div>
            <dropdown
              id="dropdown-demographic-cut"
              class="tw-text-sm"
              v-model="selectedDemographicVariable"
              :clearable="true"
              placeholder="Select a demographic variable"
              :options="
                demographicVariables.map((d) => {
                  return { label: comparisonAliases[d], value: d };
                })
              "
            />
          </div>
          <input-button
            class="tw-mt-2.5 tw-max-w-[400px]"
            placeholder="Cutoff value, e.g. 50%"
            @input="demographicCutoffValue = $event"
          />
          <!-- <div class="tw-mt-2.5 tw-flex tw-flex-row tw-gap-2">
            <div
              class="tw-border-2 tw-border-neutral-600 tw-bg-white tw-p-1 tw-text-sm hover:tw-cursor-pointer hover:tw-bg-neutral-600 hover:tw-text-white focus:tw-outline-none"
              role="button"
              :class="{ disabled: demographicButtonDisabled }"
              :tabindex="demographicButtonDisabled ? -1 : 0"
              @click="handleDemographicFilterSubmit"
            >
              Filter
            </div>
            <div
              class="tw-border-2 tw-border-neutral-600 tw-bg-white tw-p-1 tw-text-sm hover:tw-cursor-pointer hover:tw-bg-neutral-600 hover:tw-text-white focus:tw-outline-none"
              :class="{
                disabled: !isDemographicFilter,
              }"
              role="button"
              @click="resetDemographicFilter"
            >
              Reset Filter
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="tw-mt-10 tw-flex tw-w-full tw-justify-start">
      <scatter-chart
        v-if="selectedData"
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
        @mouseover="$emit('geography:hover', $event)"
        @mouseleave="$emit('geography:unhover')"
      />
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import ScatterChart from "./ScatterChart";
import InputButton from "./InputButton";
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
  ],
  components: { ScatterChart, Dropdown, InputButton },
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
    };
  },

  created() {
    // Set the default variables
    this.selectedSPIVariable = "social_progress_index";
    this.selectedComparisonVariable = "median_household_income";
  },

  watch: {
    selectedComparisonVariable(newValue) {
      this.setComparisonData(newValue);
    },
    selectedDemographicVariable(newValue) {
      this.setDemographicData(newValue);
    },
  },
  computed: {
    demographicButtonDisabled() {
      return (
        this.selectedDemographicVariable === null ||
        this.demographicCutoffValue === null
      );
    },
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

    hiddenIds() {
      if (!this.selectedData) return [];
      if (!this.demographicCutoffValue || !this.selectedDemographicVariable)
        return [];

      let data = this.dataCache[this.selectedDemographicVariable];
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
     * Get the comparison data
     */
    setComparisonData(value) {
      if (value !== null) {
        // Get the data from the cache
        let data = this.dataCache[value];

        // Pull the data if we need to
        if (!data) {
          const url = `${SPI_URL}/${value}.json`;
          json(url).then((data) => {
            this.dataCache[value] = this.comparisonData = data;
          });
        }
        // Or use the cached data
        else {
          this.comparisonData = data;
        }
      }
    },

    setDemographicData(value) {
      if (value !== null) {
        // Get the data from the cache
        let data = this.dataCache[value];

        // Pull the data if we need to
        if (!data) {
          const url = `${SPI_URL}/${value}.json`;
          json(url).then((data) => {
            this.dataCache[value] = this.demographicData = data;
          });
        }
        // Or use the cached data
        else {
          this.demographicData = data;
        }
      }
    },
  },
};
</script>

<style scoped>
.disabled {
  @apply tw-cursor-not-allowed tw-opacity-50 hover:tw-border-neutral-600 hover:tw-bg-white hover:tw-text-inherit !important;
}
</style>
