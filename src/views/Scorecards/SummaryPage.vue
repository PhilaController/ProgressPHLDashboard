<template>
  <!-- Show a loader -->
  <loading-page v-if="isLoading" />

  <!-- If data is loaded, show the definitions content -->
  <div
    v-else
    class="tw-relative tw-flex tw-flex-col"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <!-- The top section -->
    <div
      class="tw-relative tw-mx-auto tw-mt-4 tw-w-full tw-max-w-5xl tw-pb-10 sm:tw-px-4"
      :style="getPaddingTop(navBarHeight)"
    >
      <!-- Title -->
      <div class="tw-flex">
        <div class="tw-text-4xl tw-font-semibold">
          Social Progress Scorecards
        </div>

        <div class="tw-ml-2 tw-flex tw-items-center tw-gap-1.5">
          <scorecard-circle
            class="tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
            label="Above Average"
          /><scorecard-circle
            class="tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
            label="Average"
          /><scorecard-circle
            class="tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
            label="Below Average"
          />
        </div>
      </div>

      <!-- Intro text -->
      <div class="tw-mt-6 tw-text-base">
        <p>
          The social progress scorecard shows how scores for a particular tract
          compare to other tracts in the city, color-coded according to whether
          the value is above the city average
          <scorecard-circle
            class="tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Above Average"
          />, close to the city average
          <scorecard-circle
            class="tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Average"
          />, or below the city average
          <scorecard-circle
            class="tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Below Average"
          />. Values are presented for both the SPI and its dimensions and
          components, as well as the data indicators that make up each
          component.
        </p>

        <p class="tw-mt-4">
          To get started, select one or two tracts in the table below and hit
          the "Go" button.
        </p>
      </div>

      <!-- Filters/buttons -->
      <div class="tw-mt-8 tw-flex tw-flex-row tw-items-end tw-justify-between">
        <!-- Selected -->
        <div
          class="tw-mt-0 tw-text-sm tw-italic tw-text-neutral-500"
          :class="{ 'tw-opacity-0': selectedRows.length == 0 }"
        >
          <span class="">Selected tracts:</span>
          {{ selectedRows.join(", ") }}
        </div>

        <!-- Button group -->
        <div class="tw-w-[300px]">
          <div class="tw-flex tw-flex-row tw-gap-1">
            <div
              class="btn-default-colors-bw tw-w-full tw-rounded tw-border tw-border-solid tw-px-2 tw-py-2 tw-text-center tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[1px]"
              :class="{
                'tw-opacity-30 hover:tw-cursor-not-allowed hover:tw-bg-white focus:tw-bg-white':
                  selectedRows.length == 0,
              }"
              role="button"
              :tabindex="selectedRows.length == 0 ? -1 : 0"
              @click.prevent="clearSelections"
              @keydown.enter.prevent="clearSelections"
              @keydown.space.prevent="clearSelections"
            >
              Clear
            </div>
            <div
              class="btn-default-colors-bw tw-w-full tw-rounded tw-border tw-border-solid tw-px-2 tw-py-2 tw-text-center tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[1px]"
              :class="{
                'tw-opacity-30 hover:tw-cursor-not-allowed hover:tw-bg-white focus:tw-bg-white':
                  selectedRows.length == 0,
              }"
              role="button"
              :tabindex="selectedRows.length == 0 ? -1 : 0"
              @click.prevent="goToScorecard"
            >
              Go
            </div>
          </div>

          <social-progress-dropdown
            class="tw-mt-1 tw-w-full tw-text-sm"
            :hierarchy="metadata.hierarchy"
            :aliases="metadata.aliases"
            :value="selectedVariable"
            direction="down"
            label="Table variable"
            @input="selectedVariable = $event"
          />
        </div>
      </div>

      <!-- the same search UI as the vue-good-table -->
      <div class="tt-search vgt-global-search vgt-clearfix tw-mt-2">
        <div class="vgt-global-search__input vgt-pull-left">
          <span class="input__icon"><div class="magnifying-glass"></div></span>
          <input
            type="text"
            v-model="searchTerm"
            v-on:keyup="searchingTable"
            placeholder="Filter by tract name"
            class="vgt-input vgt-pull-left"
          />
        </div>
        <div class="vgt-global-search__actions vgt-pull-right"></div>
      </div>

      <vue-good-table
        ref="summaryTable"
        :columns="columns"
        :rows="selectedData"
        :select-options="{
          enabled: true,
          disableSelectInfo: true,
          selectOnCheckboxOnly: true,
        }"
        @on-per-page-change="handlePerPageChange"
        @on-page-change="handlePageChange"
        @on-row-click="onRowClick"
        :sort-options="{
          enabled: false,
        }"
        :search-options="{
          enabled: true,
          placeholder:
            'Filter this table by First name, Last name, or registration date',
          externalQuery: searchTerm,
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 50,
          position: 'top',
          jumpFirstOrLast: true,
        }"
      >
        <template slot="table-column" slot-scope="props">
          <template v-if="props.column.label == 'Value'">
            <span>{{ props.column.label }}</span>
            <sort-button
              :label="props.column.label"
              @sort="sortOrder = $event"
            />
          </template>
          <template v-else>
            {{ props.column.label }}
          </template>
        </template>

        <template slot="table-row" slot-scope="props">
          <!-- Update tract name -->
          <span v-if="props.column.field == 'tract_name'">
            <span class="tw-flex tw-items-center"
              ><router-link
                class="tw-ml-2 tw-text-zinc-600 visited:tw-text-zinc-600 hover:tw-underline active:tw-text-zinc-600"
                :to="`/explorer?tract=${props.row[props.column.field]}`"
                :title="`Explorer data for ${props.row[props.column.field]}`"
                >{{ props.row[props.column.field] }}&nbsp;
                <font-awesome-icon
                  icon="fa-solid fa-angle-right" /></router-link
            ></span>
          </span>

          <!-- Average label -->
          <span
            v-else-if="props.column.field == 'average_label'"
            class="d-flex justify-content-center"
          >
            <scorecard-circle
              class="tw-h-6 tw-w-6"
              :label="props.row[props.column.field]"
            />
          </span>
          <span v-else>{{ props.formattedRow[props.column.field] }}</span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import SocialProgressDropdown from "../DataExplorer/components/SocialProgressDropdown";
import LoadingPage from "@/components/Loading/LoadingPage";
import Navbar from "@/components/Navbar";
import ScorecardCircle from "@/components/Scorecard/ScorecardCircle";
import SortButton from "./SortButton";
import { format } from "d3-format";
import { ascending, descending } from "d3-array";
import { VueGoodTable } from "vue-good-table";

export default {
  name: "ScorecardSummary",
  props: [
    "metadata",
    "data",
    "controllerNavHeight",
    "navBarHeight",
    "usePadding",
  ],
  components: {
    LoadingPage,
    Navbar,
    VueGoodTable,
    ScorecardCircle,
    SortButton,
    SocialProgressDropdown,
  },
  created() {
    // Set selected data
    if (!this.isLoading) {
      this.initialize();
    }
  },
  data() {
    return {
      searchTerm: "",
      selectedVariable: "social_progress_index",

      selectedRows: [],
      selectedData: [],
      sortOrder: "desc",
    };
  },

  computed: {
    columns() {
      return [
        {
          label: "Rank",
          field: "rank",
          type: "number",
          sortable: false,
          width: "5%",
        },
        {
          label: "Neighborhood Tract",
          field: "tract_name",
          sortable: false,
        },

        {
          label: this.metadata.aliases[this.selectedVariable],
          field: "value",
          type: "number",
          formatFn: format(".2f"),
          width: "25%",
        },
        {
          label: "",
          field: "average_label",
          sortable: false,
        },
      ];
    },
    isLoading() {
      return this.metadata == null || this.data == null;
    },
  },

  watch: {
    selectedRows(newValue) {
      let currentRouteSelection = this.$route.query.selected;
      let newValueEncoded = JSON.stringify(newValue);

      // Only update if value changed and it's not the current route
      if (currentRouteSelection !== newValueEncoded) {
        let q = {};
        if (newValue && newValue.length > 0) q["selected"] = newValueEncoded;
        this.$router.replace({ query: q });
      }

      // Update the checkboxes
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    isLoading(value) {
      if (!value) this.initialize();
    },

    sortOrder() {
      this.setSelectedData();
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    selectedVariable() {
      this.setSelectedData();
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },
  },

  methods: {
    goToScorecard() {
      let path = this.selectedRows.join("/");
      this.$router.push({
        path: `/scorecards/${path}`,
      });
    },
    handlePerPageChange() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },
    handlePageChange() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },
    initialize() {
      this.setSelectedData();

      // Check query
      let query = this.$route.query.selected;
      if (query !== undefined) {
        this.selectedRows = JSON.parse(query);
      }
    },
    clearSelections() {
      this.selectedRows = [];
    },
    setSelectedData() {
      // Selected variable data
      let data = this.data[this.selectedVariable];

      // Sort function
      let sortFn = this.sortOrder == "desc" ? descending : ascending;

      // Add tract name and sort
      this.selectedData = data
        .map((d) => {
          let out = Object.assign({}, d);
          out["tract_name"] = this.getTractName(d);
          return out;
        })
        .sort((a, b) => sortFn(a.value, b.value));
    },

    isCheckboxEvent(event) {
      if (!event.srcElement) return false;
      return event.srcElement.nodeName === "INPUT";
    },
    updateCheckboxes() {
      let table = this.$refs.summaryTable;
      let start = (table.currentPage - 1) * table.currentPerPage;

      // Loop over all checkboxes
      $("tbody th.vgt-checkbox-col:first-child > input").each((i, el) => {
        // Get the data

        let d = this.$refs.summaryTable.processedRows[0].children[start + i];
        if (d === undefined) return;

        console.log(d.tract_name, this.selectedRows.length === 2);

        // This row is selected
        if (this.selectedRows.includes(d.tract_name)) {
          $(el).prop("checked", true);
          $(el).prop("disabled", false);
        } else {
          $(el).prop("checked", false);
          $(el).prop("disabled", this.selectedRows.length === 2);
        }
      });
    },

    searchingTable() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },
    getTractName(d) {
      return `${d.neighborhood_name} ${+d.tract_id}`;
    },

    onRowClick(params) {
      if (this.isCheckboxEvent(params.event)) {
        let name = this.getTractName(params.row);
        if (!this.selectedRows.includes(name)) {
          this.selectedRows.push(name);
        } else this.selectedRows = this.selectedRows.filter((d) => d !== name);
      } else {
        console.log("FUCK");
        params.event.preventDefault();
        params.event.stopPropagation();
      }
    },

    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>

<style stlye="scss">
@import "vue-good-table/dist/vue-good-table.css";

thead th.vgt-checkbox-col:first-child > input {
  display: none !important;
}

th.vgt-checkbox-col:first-child > input {
  cursor: pointer;
}

th.vgt-checkbox-col:first-child > input:disabled {
  cursor: not-allowed;
}

table.vgt-table tr.clickable:hover {
  background-color: white !important;
}

table.vgt-table tr.clickable {
  cursor: default !important;
}

.footer__row-count__label {
  margin-bottom: 0 !important;
}

.vgt-wrap__footer .footer__row-count__select,
.footer__row-count__label,
.footer__navigation__page-info,
.vgt-wrap__footer .footer__navigation__page-btn span {
  font-size: 1rem !important;
}

div:disabled {
  background-color: red !important;
}

.vgt-checkbox-col {
  pointer-events: none !important;
}

.vgt-checkbox-col > input {
  pointer-events: auto !important;
}

div.footer__navigation.vgt-pull-right > button:nth-child(3) {
  margin-right: 20px !important;
}
</style>
