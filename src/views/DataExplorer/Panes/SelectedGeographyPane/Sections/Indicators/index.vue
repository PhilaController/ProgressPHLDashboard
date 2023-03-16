<template>
  <div>
    <!-- Section Title -->
    <div
      class="tw-flex tw-items-end tw-border-b tw-border-stone-300 tw-pb-1 tw-leading-none"
    >
      <i class="far fa-chart-bar tw-mr-1.5 tw-text-3xl"></i>

      <div class="tw-text-2xl tw-font-bold">{{ title }}</div>
    </div>

    <!-- Intro text -->
    <div class="tw-mt-2 tw-text-sm">
      <p>
        This section shows key demographic and socioeconomic indicators for the
        <span class="tw-font-medium"
          >{{ selectedGeographyName }} {{ selectedGeographyType }}</span
        >.
      </p>
    </div>

    <!-- Section content -->
    <div class="tw-mt-6 tw-w-full">
      <!-- Overlay if no data yet-->
      <div v-if="data == null" class="tw-relative tw-min-h-[500px] tw-w-full">
        <loading-overlay />
      </div>

      <!-- Content if we have data -->
      <div v-else class="tw-grid tw-grid-cols-12 tw-gap-4">
        <!-- Top row: section titles -->
        <div
          class="tw-font-base tw-col-span-12 tw-col-start-1 tw-row-start-1 tw-font-semibold xl:tw-col-span-5"
        >
          Population
        </div>

        <div
          class="tw-font-base tw-col-span-12 tw-row-start-3 tw-font-semibold sm:tw-col-span-6 xl:tw-col-span-4 xl:tw-col-start-6 xl:tw-row-start-1"
        >
          Median Household Income
        </div>

        <div
          class="tw-font-base tw-col-span-12 tw-row-start-5 tw-font-semibold sm:tw-col-span-6 sm:tw-row-start-3 xl:tw-col-span-3 xl:tw-col-start-10 xl:tw-row-start-1"
        >
          Poverty Rate
        </div>

        <!-- Second row: content -->
        <div class="tw-contents">
          <!-- Population -->
          <div
            class="tw-col-span-12 tw-row-start-2 tw-flex tw-h-full tw-w-full tw-items-start tw-justify-evenly tw-rounded tw-border tw-border-stone-300 xl:tw-col-span-5"
          >
            <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
              <div class="tw-text-3xl tw-font-semibold">
                {{ formatPopulation(population_2010) }}
              </div>
              <div class="tw-mt-2 tw-text-center tw-text-sm">2010 Census</div>
            </div>

            <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
              <div class="tw-text-3xl tw-font-semibold">
                {{ formatPopulation(population) }}
              </div>
              <div class="tw-mt-2 tw-text-center tw-text-sm">
                2014-2019 Estimate
                <span class="tw-text-gray-500">({{ population_change }})</span>
              </div>
            </div>
          </div>

          <!-- Median-household income -->
          <div
            class="tw-col-span-12 tw-row-start-4 tw-flex tw-h-full tw-w-full tw-items-start tw-justify-center tw-rounded tw-border tw-border-stone-300 sm:tw-col-span-6 xl:tw-col-span-4 xl:tw-row-start-2"
          >
            <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
              <div class="tw-text-3xl tw-font-semibold">
                {{ formatIncome(median_household_income) }}
              </div>
              <div class="tw-mt-2 tw-text-center tw-text-sm">
                in 2019 inflation-adjusted dollars
              </div>
            </div>
          </div>

          <!-- Poverty Rate -->
          <div
            class="tw-col-span-12 tw-row-start-6 tw-flex tw-h-full tw-w-full tw-items-start tw-justify-center tw-rounded tw-border tw-border-stone-300 sm:tw-col-span-6 sm:tw-row-start-4 xl:tw-col-span-3 xl:tw-row-start-2"
          >
            <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
              <div class="tw-text-3xl tw-font-semibold">
                {{ formatPercent(poverty_rate * 100) }}
              </div>
              <div class="tw-mt-2 tw-text-center tw-text-sm">
                of residents live below the poverty line
              </div>
            </div>
          </div>
        </div>

        <!-- Race/Ethnicity  -->
        <div
          class="tw-col-span-12 tw-flex tw-w-full tw-flex-col xl:tw-col-span-4"
        >
          <div class="tw-font-base tw-mb-2 tw-font-semibold">
            Race & Hispanic Origin
          </div>
          <div
            class="tw-flex tw-w-full tw-justify-center tw-rounded tw-border tw-border-stone-300"
          >
            <race-ethnicity-chart
              :data="raceEthnicityData"
              :height="175"
              :max-width="700"
              :xmax="1.0"
            />
          </div>
        </div>

        <!-- Age/Sex -->
        <div
          class="tw-col-span-12 tw-flex tw-w-full tw-flex-col xl:tw-col-span-8"
        >
          <div class="tw-font-base tw-mb-2 tw-font-semibold">
            Population by Age
          </div>
          <div
            class="tw-flex tw-w-full tw-justify-center tw-rounded tw-border tw-border-stone-300"
          >
            <age-sex-chart :data="ageSexData" :height="175" :max-width="700" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Local
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import RaceEthnicityChart from "./RaceEthnicityChart";
import AgeSexChart from "./AgeSexChart";

// d3
import { format } from "d3-format";
import { group } from "d3-array";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
  name: "IndicatorsSection",
  props: ["data", "selectedGeographyName", "selectedGeographyType"],
  components: { LoadingOverlay, RaceEthnicityChart, AgeSexChart },

  methods: {
    getVariable(variable) {
      return this.data.find((d) => d.indicator === variable)["estimate"];
    },
    formatPopulation(value) {
      let fmt = ",.1f";
      if (value < 1e4) fmt = ",.2f";
      return format(fmt)(value / 1e3) + "k";
    },
    formatIncome(value) {
      return "$" + format(",.0f")(value);
    },
    formatPercent(value) {
      return format(".1f")(value) + "%";
    },
  },
  computed: {
    title() {
      return "Indicators"; //capitalizeFirstLetter(this.selectedGeographyType) + " Indicators";
    },
    population_2010() {
      return this.getVariable("population_2010");
    },
    median_household_income() {
      return this.getVariable("median_household_income");
    },
    population() {
      return this.getVariable("population");
    },
    population_change() {
      let pct = 100 * (this.population / this.population_2010 - 1);
      let out = format(".1f")(Math.abs(pct));
      if (pct >= 0) out = "+" + out;
      else out = "\u2212" + out;
      return out + "%";
    },
    poverty_rate() {
      return this.getVariable("poverty_rate");
    },
    raceEthnicityData() {
      let variables = [
        "percent_white",
        "percent_black",
        "percent_asian",
        "percent_other",
        "percent_hispanic",
      ];
      let labels = [
        "White (Non-Hispanic)",
        "Black (Non-Hispanic)",
        "Asian (Non-Hispanic)",
        "Other Race (Non-Hispanic)",
        "Hispanic (of any race)",
      ];
      let out = [];
      for (let i = 0; i < variables.length; i++) {
        let variable = variables[i];
        let label = labels[i];
        let value = this.getVariable(variable);
        let formattedValue = this.formatPercent(value * 100);
        out.push({ value: value, group: `${label} | ${formattedValue}` });
      }
      return out;
    },

    ageSexData() {
      let data = this.data.filter(
        (d) =>
          d.indicator.startsWith("male") || d.indicator.startsWith("female")
      );
      let out = [];
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        if (d.indicator.startsWith("female"))
          out.push({
            value: d.estimate,
            sex: "female",
            indicator: d.indicator.replace("female_", ""),
          });
        else
          out.push({
            value: d.estimate,
            sex: "male",
            indicator: d.indicator.replace("male_", ""),
          });
      }
      let m = group(
        out,
        (d) => d.indicator,
        (d) => d.sex
      );

      let final_groups = [
        "under_18",
        "18_to_34",
        "35_to_49",
        "50_to_64",
        "65_and_over",
      ];

      out = [];
      for (let i = 0; i < final_groups.length; i++) {
        let group = final_groups[i];
        let submap = m.get(group);
        let r = { group: group };
        for (const [sex, d] of submap) {
          r[sex] = d[0].value;
        }
        out.push(r);
      }
      return out;
    },
  },
};
</script>
