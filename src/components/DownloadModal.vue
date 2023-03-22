<template>
  <card-modal
    id="downloadModal"
    :showing="showing"
    width-class="tw-max-w-lg"
    @close="$emit('close')"
  >
    <div class="tw-my-4 tw-flex tw-min-h-[300px] tw-w-full tw-flex-col">
      <!-- Title-->
      <div class="tw-text-2xl tw-font-semibold">Download Data</div>

      <div class="tw-mt-2 tw-text-sm">
        By default, data for the social progress index, dimensions, components,
        and underlying data indicators are downloaded for all neighborhood
        tracts. To select a subset of data, use the filters below.
      </div>

      <div class="tw-mt-4">
        <div class="tw-pb-1 tw-text-lg tw-font-semibold">Variables</div>

        <!-- Variables dropdown -->
        <dropdown
          class="tw-max-w-[300px] tw-text-sm"
          id="variable-download-filter"
          :options="variableOptions"
          v-model="selectedVariable"
          :clearable="true"
          placeholder="Choose a variable to download"
        />

        <!-- Geography dropdown -->
        <div class="tw-mt-6">
          <div class="tw-pb-1 tw-text-lg tw-font-semibold">Geography</div>
          <!-- Filter to tract -->
          <label
            class="tw-text-sm"
            :class="{
              'tw-pointer-events-none tw-opacity-50':
                selectedNeighborhood || selectedRegion,
            }"
            v-if="selectedGeographyType == 'tract'"
            for="tract-filter"
          >
            <input type="checkbox" id="tract-filter" v-model="filterToTract" />
            Download current tract ({{ selectedGeographyName }}) only
          </label>

          <!-- Neighborhood dropdown -->
          <dropdown
            class="tw-max-w-[300px] tw-text-sm"
            :class="{
              'tw-pointer-events-none tw-opacity-50':
                filterToTract || selectedRegion,
            }"
            id="neighborhood-download-filter"
            :options="neighborhoodNames"
            v-model="selectedNeighborhood"
            :clearable="true"
            placeholder="Filter by a neighborhood"
          />

          <!-- Region dropdown -->
          <dropdown
            class="tw-mt-2 tw-max-w-[300px] tw-text-sm"
            :class="{
              'tw-pointer-events-none tw-opacity-50':
                filterToTract || selectedNeighborhood,
            }"
            id="region-download-filter"
            :options="regionNames"
            v-model="selectedRegion"
            :clearable="true"
            placeholder="Filter by a region"
          />
        </div>
      </div>

      <!-- Download button -->
      <div class="tw-mt-10 tw-flex tw-w-full tw-justify-center">
        <div
          class="btn-default-colors tw-mt-4 tw-min-w-[100px] tw-rounded tw-border-[1px] tw-border-solid tw-px-3 tw-py-3 tw-text-center tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[2px] sm:tw-w-fit sm:tw-border-[2px] sm:tw-text-xs md:tw-text-sm"
          role="button"
          tabindex="0"
          @click.prevent="downloadData"
          @keydown.enter.prevent="downloadData"
          @keydown.space.prevent="downloadData"
        >
          Download data
        </div>
      </div>
    </div>
  </card-modal>
</template>

<script>
import Dropdown from "./Dropdowns/Dropdown";
import CardModal from "./CardModal";
import { mapState } from "vuex";
import * as Papa from "papaparse";

/**
 * Download the content to the specified file
 */
export function downloadFile(content, contentType, fileName) {
  // Create the link
  const a = document.createElement("a");

  // Create object to download
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);

  // Set the file name
  a.download = fileName;

  // Trigger download
  a.click();
}

export default {
  name: "DownloadModal",
  components: { CardModal, Dropdown },
  props: {
    showing: { type: Boolean },

    /**
     * Is there a currently selected geography?
     * Track both the name and type
     */
    selectedGeographyName: { type: String, default: "" },
    selectedGeographyType: { type: String, default: "" },
  },
  data() {
    return {
      selectedVariable: null,
      selectedNeighborhood: null,
      selectedRegion: null,
      filterToTract: false,
    };
  },
  computed: {
    ...mapState(["data", "metadata", "regionNames", "neighborhoodNames"]),

    /**
     * Variable options for dropdown
     */
    variableOptions() {
      return Object.keys(this.data).map((name) => {
        return { label: this.metadata.aliases[name], value: name };
      });
    },
  },
  methods: {
    /**
     * Download the data as a CSV
     */
    downloadData() {
      // Which variables to download
      let variables;
      if (!this.selectedVariable) variables = Object.keys(this.data);
      else variables = [this.selectedVariable];

      // Concat and add a variable column
      let out = [];
      for (let i = 0; i < variables.length; i++) {
        out = out.concat(
          this.data[variables[i]].map((v) => {
            let d = {
              ...v,
              variable: this.metadata.aliases[variables[i]],
              region_name: v.puma_name,
              tract_name: `${v.neighborhood_name} ${+v.tract_id}`,
            };
            delete d["puma_name"];
            delete d["tract_id"];
            return d;
          })
        );
      }

      // Filter by geography if needed
      if (this.filterToTract) {
        out = out.filter((d) => d.tract_name === this.selectedGeographyName);
      } else if (this.selectedNeighborhood) {
        out = out.filter(
          (d) => d.neighborhood_name === this.selectedNeighborhood
        );
      } else if (this.selectedRegion) {
        out = out.filter((d) => d.region_name === this.selectedRegion);
      }

      let content = Papa.unparse(out);
      let filename = "progressphl_data_download.csv";
      let contentType = "text/plain";
      downloadFile(content, contentType, filename);

      // Close popup
      this.$emit("close");
    },
  },
};
</script>

<style>
#downloadModal {
  overflow: inherit !important;
}
</style>
