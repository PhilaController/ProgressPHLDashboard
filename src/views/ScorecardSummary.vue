<template>
  <div class="tw-h-fit tw-w-full tw-bg-[#efefef]/25 tw-pl-20 tw-pr-20 tw-pt-20">
    <div class="tw-text-center tw-text-6xl tw-font-bold">SPI Scorecard</div>

    <div id="tractMap" class="tw-w-[50px]"></div>

    <div class="tw-mt-20 tw-flex tw-flex-col">
      <!-- Header -->
      <div class="tw-flex tw-flex-row tw-items-end tw-justify-between">
        <!-- Which variable? -->
        <div class="tw-ml-1 tw-text-lg">
          Viewing data for: &nbsp;<span class="tw-font-bold">{{
            selectedVariableFormatted
          }}</span>
        </div>

        <!-- Filters -->
        <div>
          <Dropdown
            class="tw-ml-1 tw-min-w-[300px] tw-max-w-full tw-text-zinc-800"
            v-model="selectedNeighborhood"
            placeholder="Select a neighborhood"
            :options="neighborhoods"
          />
        </div>

        <div class="tw-flex tw-flex-col">
          <div id="component-filter">
            <div class="tw-gray-500 tw-text-sm tw-font-semibold">
              SPI Component
            </div>
            <Dropdown
              class="tw-ml-1 tw-min-w-[300px] tw-max-w-full tw-text-zinc-800"
              v-model="selectedComponent"
              placeholder="Select an SPI component"
              :options="components['social_progress_index'] || []"
            />
          </div>
          <div id="dimension-filter" class="tw-mt-2">
            <div
              class="tw-gray-500 tw-text-sm tw-font-semibold disabled:tw-opacity-40"
              :class="{ 'tw-opacity-40': selectedComponent === null }"
            >
              Dimension
            </div>
            <Dropdown
              class="tw-ml-1 tw-min-w-[300px] tw-max-w-full tw-text-zinc-800"
              v-model="selectedDimension"
              placeholder="Select a dimension"
              :disabled="selectedComponent === null"
              :options="components[selectedComponent] || []"
            />
          </div>
          <div id="indicator-filter" class="tw-mt-2">
            <div
              class="tw-gray-500 tw-text-sm tw-font-semibold"
              :class="{ 'tw-opacity-40': selectedDimension === null }"
            >
              Indicator
            </div>
            <Dropdown
              class="tw-ml-1 tw-min-w-[300px] tw-max-w-full tw-text-zinc-800"
              v-model="selectedIndicator"
              placeholder="Select an indicator"
              :disabled="selectedDimension === null"
              :options="components[selectedDimension] || []"
            />
          </div>
        </div>
      </div>

      <!-- Table -->
      <VueGoodTable
        class="tw-mt-3"
        :columns="columns"
        :rows="selectedData"
        :sort-options="{
          enabled: true,
          initialSortBy: { field: 'value', type: 'desc' },
        }"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'tract_name'">
            <span class="tw-flex tw-items-center"
              ><span class="census-tract-sparkline tw-w-[40px]"></span
              ><router-link
                class="tw-ml-2 tw-text-zinc-600 visited:tw-text-zinc-600 hover:tw-underline active:tw-text-zinc-600"
                :to="`/scorecard/${props.row[props.column.field]}`"
                :title="`See scorecard for Census Tract ${
                  props.row[props.column.field]
                }`"
                >Census Tract {{ props.row[props.column.field] }}&nbsp;
                <font-awesome-icon
                  icon="fa-solid fa-angle-right" /></router-link
            ></span>
          </span>
          <span v-else-if="props.column.field == 'hood_name'">
            <span class="tw-flex tw-items-center"
              ><span class="hood-sparkline tw-w-[40px]"></span
              ><span class="tw-ml-2">{{
                props.row[props.column.field]
              }}</span></span
            >
          </span>
          <span
            v-else-if="props.column.field == 'average_label'"
            class="d-flex justify-content-center"
          >
            <div
              class="tw-h-6 tw-w-6 tw-rounded-full tw-border-2"
              :class="getCircleColor(props.row[props.column.field])"
              :title="props.row[props.column.field]"
            ></div>
          </span>
          <span v-else>{{ props.formattedRow[props.column.field] }}</span>
        </template></VueGoodTable
      >
    </div>
  </div>
</template>

<script>
import { select } from "d3-selection";
import { geoMercator, geoPath } from "d3-geo";
import { ascending } from "d3-array";
import { format } from "d3-format";
import { VueGoodTable } from "vue-good-table";
import $ from "jquery";

import { onlyUnique } from "@/utils";
import Dropdown from "@/components/Dropdown";

export default {
  name: "ScorecardSummary",
  components: { VueGoodTable, Dropdown },
  props: ["data", "geojson"],
  data() {
    return {
      aliases: require("@/data/aliases.json"),
      components: require("@/data/components.json"),
      selectedNeighborhood: null,
      selectedComponent: null,
      selectedIndicator: null,
      selectedDimension: null,
      columns: [
        {
          label: "Census Tract",
          field: "tract_name",
          sortable: false,
        },
        {
          label: "Neighborhood",
          field: "hood_name",
          sortable: false,
        },
        {
          label: "Rank",
          field: "rank",
          type: "number",
          sortable: false,
        },
        {
          label: "Value",
          field: "value",
          type: "number",
          formatFn: format(".2f"),
        },
        {
          label: "",
          field: "average_label",
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    $(".census-tract-sparkline").each((i, el) => {
      if ($(el).find("svg").length == 0) {
        let data = this.selectedData[i];
        let tract_name = data.tract_name;
        let hood_name = data.hood_name;

        let width = 100;
        let height = 100;

        var svg = select(el)
          .append("svg")
          .attr("width", height)
          .attr("height", width)
          .attr("viewBox", [-20, -20, width + 20, height + 20])
          .attr("style", "width: 100%; height: auto; height: intrinsic;");

        let hood_geo = this.geojson.hoods.features.find(
          (d) => d.properties.neighborhood == hood_name
        );
        let tract_geo = this.geojson.tracts.features.find(
          (d) => d.properties.tract_name == tract_name
        );

        let projection = geoMercator().fitSize([width, height], tract_geo);
        let path = geoPath().projection(projection);

        // Add the tract
        svg
          .selectAll()
          .data([tract_geo])
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill-opacity", 0)
          .attr("stroke", "#8b5cf6")
          .attr("stroke-width", 4);
      }
    });

    $(".hood-sparkline").each((i, el) => {
      if ($(el).find("svg").length == 0) {
        let data = this.selectedData[i];
        let hood_name = data.hood_name;

        let width = 100;
        let height = 100;

        var svg = select(el)
          .append("svg")
          .attr("width", height)
          .attr("height", width)
          .attr("viewBox", [-20, -20, width + 20, height + 20])
          .attr("style", "width: 100%; height: auto; height: intrinsic;");

        let hood_geo = this.geojson.hoods.features.find(
          (d) => d.properties.neighborhood == hood_name
        );

        let projection = geoMercator().fitSize([width, height], hood_geo);
        let path = geoPath().projection(projection);

        // Add the neighborhood first
        svg
          .selectAll()
          .data([hood_geo])
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill-opacity", 0)
          .attr("stroke", "#0ea5e9")
          .attr("stroke-width", 4);
      }
    });
  },
  methods: {
    getCircleColor(label) {
      if (label == "Above Average")
        return "tw-bg-emerald-500 tw-border-emerald-700";
      else if (label == "Average")
        return "tw-bg-yellow-300 tw-border-yellow-500";
      else return "tw-bg-red-500 tw-border-red-700";
    },
  },
  computed: {
    selectedVariable() {
      if (this.selectedIndicator) return this.selectedIndicator;
      if (this.selectedDimension) return this.selectedDimension;
      if (this.selectedComponent) return this.selectedComponent;
      return "social_progress_index";
    },
    selectedVariableFormatted() {
      return this.aliases[this.selectedVariable];
    },
    selectedData() {
      // Filter by the selected variable
      let out = this.data.filter((d) => d.variable == this.selectedVariable);
      if (this.selectedNeighborhood)
        out = out.filter((d) => d.hood_name == this.selectedNeighborhood);

      return out;
    },
    neighborhoods() {
      return this.data
        .map((d) => d.hood_name)
        .filter(onlyUnique)
        .sort((a, b) => ascending(a, b));
    },
  },
};
</script>

<style stlye="scss">
@import "vue-good-table/dist/vue-good-table.css";
</style>
