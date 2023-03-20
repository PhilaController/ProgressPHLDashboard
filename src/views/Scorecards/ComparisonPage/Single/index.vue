<template>
  <div class="tw-flex tw-h-full tw-w-full tw-flex-col">
    <!-- Title section-->
    <div class="t tw-flex tw-flex-col tw-border-b tw-border-stone-300 tw-pb-2">
      <scorecard-title class="tw-mb-2" />

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
    <intro-text class="tw-mt-6" />

    <!-- SPI row -->
    <div class="scorecard-grid tw-mt-10">
      <header-row />
      <data-row
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
        <header-row />
        <data-row
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
          <data-row
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
          <data-row
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
import ScorecardTitle from "../../components/ScorecardTitle";
import IntroText from "../../components/IntroText";
import HeaderRow from "./HeaderRow";
import DataRow from "./DataRow";
import { mapState } from "vuex";

export default {
  name: "ScorecardSingle",
  props: {
    /**
     * Selected tract name
     */
    tractName: { type: String, required: true },
  },
  components: {
    ScorecardTitle,
    ClickableIcon,
    HeaderRow,
    DataRow,
    IntroText,
  },
  computed: {
    ...mapState(["data", "metadata"]),
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

    /**
     * Go to scorecard for selection
     */
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
