<template>
  <div class="tw-flex tw-h-full tw-w-full tw-flex-col">
    <!-- Title section-->
    <div class="t tw-flex tw-flex-col tw-border-b tw-border-stone-300 tw-pb-2">
      <div class="tw-mb-2 tw-flex">
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
      <!-- Tract names -->
      <div class="tw-flex tw-items-center tw-gap-2">
        <div class="tw-mt-0.5 tw-text-2xl">{{ tractName }}</div>

        <a
          href="#"
          @click.prevent="goToSelection"
          @keydown.enter.prevent="goToSelection"
          @keydown.space.prevent="goToSelection"
          class="tw-ml-4 tw-border-l-2 tw-border-gray-300 tw-pl-2 tw-text-base tw-font-medium tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
        >
          Add Comparison
        </a>
        <a
          href="#"
          class="tw-ml-2 tw-border-l-2 tw-border-gray-300 tw-pl-2 tw-text-base tw-font-medium tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
          @click.prevent="goToExplorer"
          @keydown.enter.prevent="goToExplorer"
          @keydown.space.prevent="goToExplorer"
        >
          Explore <i class="fas fa-search tw-ml-0.5"></i>
        </a>
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
        components, as well as the data indicators that make up each component.
      </p>
    </div>

    <!-- SPI row -->
    <div class="scorecard-grid tw-mt-10">
      <header-row-single />
      <data-row-single
        class="grid-row-wrapper-1"
        :data="data"
        :metadata="metadata"
        variable="social_progress_index"
        :tract-name="tractName"
        circle-size="10"
        :show-border="true"
        font-size="tw-text-xl"
        variable-classes="tw-font-semibold"
      />
    </div>

    <!-- Scorecard for dimensions/components/indicators -->
    <div class="tw-mt-10 tw-flex tw-flex-col tw-justify-between tw-gap-8">
      <!-- One grid for each dimension -->
      <div
        class="scorecard-grid"
        v-for="dimension in metadata.hierarchy['social_progress_index']"
      >
        <!-- Dimension row with headers -->
        <header-row-single />
        <data-row-single
          class="grid-row-wrapper-1"
          :data="data"
          :metadata="metadata"
          :variable="dimension"
          :tract-name="tractName"
          circle-size="8"
          :show-border="true"
          font-size="tw-text-xl"
          variable-classes="tw-font-semibold"
        />

        <!-- Do all of the components -->
        <template v-for="(component, j) in metadata.hierarchy[dimension]">
          <data-row-single
            class="grid-row-wrapper-2"
            :data="data"
            :metadata="metadata"
            :variable="component"
            :tract-name="tractName"
            circle-size="6"
            :show-border="j > 0"
            border-direction="t"
            font-size="tw-text-lg"
            :show-help="true"
          />

          <!-- Do all of the indicators too -->
          <data-row-single
            v-for="(indicator, k) in metadata.hierarchy[component]"
            class="grid-row-wrapper-3"
            :class="{
              last: k === metadata.hierarchy[component].length - 1,
            }"
            :data="data"
            :metadata="metadata"
            :variable="indicator"
            :tract-name="tractName"
            circle-size="4"
            :show-border="false"
            font-size="tw-text-sm"
            variable-classes="tw-italic"
            :show-help="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ClickableIcon from "@/components/ClickableIcon";
import ScorecardCircle from "@/components/Scorecard/ScorecardCircle";
import HeaderRowSingle from "@/components/Scorecard/HeaderRowSingle";
import DataRowSingle from "@/components/Scorecard/DataRowSingle";

export default {
  name: "ScorecardSection",
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
     * Selected tract name
     */
    tractName: { type: String, required: true },
  },
  components: {
    ScorecardCircle,
    ClickableIcon,
    DataRowSingle,
    HeaderRowSingle,
  },
  computed: {
    /**
     * Number of unique tracts with data
     */
    uniqueTracts() {
      return this.data["social_progress_index"].length;
    },
  },
  methods: {
    /**
     * Go to the explorer page with specified tract
     */
    goToExplorer() {
      this.$router.push({
        path: "/explorer",
        query: { tract: this.tractName },
      });
    },

    goToSelection() {
      let selected = JSON.stringify([this.tractName]);
      this.$router.push({
        path: "/scorecards",
        query: { selected: selected },
      });
    },
  },
};
</script>
