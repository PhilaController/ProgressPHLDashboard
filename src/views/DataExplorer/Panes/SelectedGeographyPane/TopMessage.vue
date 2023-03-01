<template>
  <!-- Message for selected tract -->
  <div class="tw-flex tw-text-base" v-if="selectedGeographyType === 'tract'">
    <div class="tw-flex tw-items-center tw-justify-center">
      <scorecard-circle
        class="tw-mb-1 tw-inline-block tw-h-10 tw-w-10 tw-align-middle"
        :label="selectedTractData.average_label"
      />
    </div>

    <!-- Message -->
    <div class="tw-ml-2 tw-italic">
      With an SPI score of
      <span class="tw-font-semibold"
        >{{ formatFunction(selectedTractData.value) }} out of 100</span
      >, the
      {{ selectedGeographyName }}
      tract is
      {{ rankDesc }}, ranking {{ selectedTractData.rank
      }}<sup class="tw-text-xs tw-italic">{{
        getNumberSuffix(selectedTractData.rank)
      }}</sup>
      out of {{ uniqueTracts }} neighborhood tracts.
    </div>
  </div>

  <!-- Message for selected regions/neighborhoods -->
  <div class="tw-text-base tw-italic" v-else>
    To view data for a specific neighborhood tract, you can 1) click on a region
    in the map to the left, 2) scroll down to the tract-level SPI scores and
    click on an individual circle, or 3) navigate to a specific
    neighborhood/region/tract using the list above.
  </div>
</template>

<script>
import ScorecardCircle from "@/components/ScorecardCircle";
import { ordinal } from "@/utils";
import { format } from "d3-format";

export default {
  name: "TopMessage",
  props: ["selectedGeographyName", "selectedGeographyType", "spiData"],
  components: { ScorecardCircle },
  computed: {
    /**
     * Rank description for the SPI data
     */
    rankDesc() {
      if (this.selectedTractData) {
        let label = this.selectedTractData.average_label;
        if (label == "Above Average") return "above the city average";
        else if (label == "Below Average") return "below the city average";
        else return "close to the city average";
      }
    },

    /**
     * Number of unique tracts
     */
    uniqueTracts() {
      return this.spiData.length;
    },

    /**
     * SPI data for the selected tract
     */
    selectedTractData() {
      if (this.selectedGeographyType == "tract") {
        return this.spiData.find(
          (d) =>
            `${d.neighborhood_name} ${+d.tract_id}` ==
            this.selectedGeographyName
        );
      }
    },
  },
  methods: {
    getNumberSuffix(v) {
      return ordinal(v);
    },
    formatFunction(v) {
      return format(".1f")(v);
    },
  },
};
</script>
