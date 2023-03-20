<template>
  <content-wrapper :is-loading="isLoading">
    <div
      v-if="!isLoading"
      class="tw-relative tw-mx-auto tw-mt-4 tw-w-full tw-max-w-5xl tw-pb-10 sm:tw-px-4"
    >
      <!-- Title -->
      <scorecard-title />

      <!-- Intro text -->
      <intro-text class="tw-mt-6" />
      <p class="tw-mt-4">
        To get started, select one or two tracts in the table below and hit the
        "Go" button.
      </p>

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
  </content-wrapper>
</template>

<script>
// Local
import ContentWrapper from "@/components/ContentWrapper";
import SocialProgressDropdown from "../DataExplorer/components/SocialProgressDropdown";

// Scorecard components
import ScorecardTitle from "./components/ScorecardTitle";
import SortButton from "./components/SortButton";
import IntroText from "./components/IntroText";
import ScorecardCircle from "./components/ScorecardCircle";

// External
import { mapState } from "vuex";
import { format } from "d3-format";
import { ascending, descending } from "d3-array";
import { VueGoodTable } from "vue-good-table";

export default {
  name: "ScorecardSummary",
  components: {
    ContentWrapper,
    ScorecardTitle,
    VueGoodTable,
    SortButton,
    SocialProgressDropdown,
    IntroText,
    ScorecardCircle,
  },
  created() {
    // Set selected data
    if (!this.isLoading) {
      this.initialize();
    }
  },
  data() {
    return {
      /**
       * Input search
       */
      searchTerm: "",

      /**
       * Selected variable shown in table
       */
      selectedVariable: "social_progress_index",

      /**
       * Track names of selected rows
       */
      selectedRows: [],

      /**
       * Sorted data fed into the table
       */
      selectedData: [],

      /**
       * Sort order, either asc or desc
       */
      sortOrder: "desc",
    };
  },

  computed: {
    ...mapState(["data", "metadata"]),

    /**
     * Config for table columns
     */
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

    /**
     * Can we show the page yet?
     */
    isLoading() {
      return this.metadata == null || this.data == null;
    },
  },

  watch: {
    /**
     * When selected rows change, update route and checkboxes
     */
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

    /**
     * Initialize on load
     */
    isLoading(value) {
      if (!value) this.initialize();
    },

    /**
     * Handle changes to the sort order
     */
    sortOrder() {
      this.refreshTable();
    },

    /**
     * Handle changes to the data variable
     */
    selectedVariable() {
      this.refreshTable();
    },
  },

  methods: {
    /**
     * Refresh the table (data annd checkboxes)
     */
    refreshTable() {
      // Update the selected data
      this.setSelectedData();

      // After render, update checkboxes
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    /**
     * Go to the scorecards for the selected rows
     */
    goToScorecard() {
      let path = this.selectedRows.join("/");
      this.$router.push({
        path: `/scorecards/${path}`,
      });
    },

    /**
     * Update the checkboxes if per page option is changed
     */
    handlePerPageChange() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    /**
     * Update checkboxes when page chan ges
     */
    handlePageChange() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    /**
     * Initialize the table
     */
    initialize() {
      // Set the data
      this.setSelectedData();

      // Check query
      let query = this.$route.query.selected;
      if (query !== undefined) {
        this.selectedRows = JSON.parse(query);
      }
    },

    /**
     * Clear the selected rows
     */
    clearSelections() {
      this.selectedRows = [];
    },

    /**
     * Sort the data for the selected variable and set it
     */
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

    /**
     * Update the checkboxes using jquery
     */
    updateCheckboxes() {
      let table = this.$refs.summaryTable;
      let start = (table.currentPage - 1) * table.currentPerPage;

      // Loop over all checkboxes
      $("tbody th.vgt-checkbox-col:first-child > input").each((i, el) => {
        // Get the data

        let d = this.$refs.summaryTable.processedRows[0].children[start + i];
        if (d === undefined) return;

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

    /**
     * Update checkboxes after input search changes
     */
    searchingTable() {
      this.$nextTick(() => {
        this.updateCheckboxes();
      });
    },

    /**
     * Get the tract name
     */
    getTractName(d) {
      return `${d.neighborhood_name} ${+d.tract_id}`;
    },

    /**
     * Is the event related to the row's checkbox?
     */
    isCheckboxEvent(event) {
      if (!event.srcElement) return false;
      return event.srcElement.nodeName === "INPUT";
    },

    /**
     * Handle row clicks
     */
    onRowClick(params) {
      // Make sure its from the checkbox
      if (this.isCheckboxEvent(params.event)) {
        // Update the selected rows array
        let name = this.getTractName(params.row);
        if (!this.selectedRows.includes(name)) {
          this.selectedRows.push(name);
        } else this.selectedRows = this.selectedRows.filter((d) => d !== name);
      }
      // Do nothing
      else {
        params.event.preventDefault();
        params.event.stopPropagation();
      }
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
