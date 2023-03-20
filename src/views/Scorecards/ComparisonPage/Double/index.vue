<template>
  <div class="tw-flex tw-h-full tw-w-full tw-flex-col">
    <!-- Title section-->
    <div class="t tw-flex tw-flex-col tw-border-b tw-border-stone-300 tw-pb-2">
      <scorecard-title class="mb-2" />

      <!-- Tract names -->
      <div class="tw-flex tw-flex-row tw-items-center">
        <div class="tw-italic">vs.</div>

        <div class="tw-ml-2 tw-flex tw-flex-col">
          <div
            v-for="(tractName, i) in tractNames"
            class="tw-mt-0.5 tw-flex tw-items-center"
          >
            <div class="tw-text-2xl">{{ tractName }}</div>

            <a
              href="#"
              @click.prevent="resetSelection(i)"
              @keydown.enter.prevent="resetSelection(i)"
              @keydown.space.prevent="resetSelection(i)"
              class="tw-ml-4 tw-border-l-2 tw-border-gray-300 tw-pl-2 tw-text-base tw-font-medium tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
            >
              Change
            </a>
            <a
              href="#"
              class="tw-ml-2 tw-border-l-2 tw-border-gray-300 tw-pl-2 tw-text-base tw-font-medium tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none active:tw-text-[#0F7582]"
              @click.prevent="goToExplorer(tractName)"
              @keydown.enter.prevent="goToExplorer(tractName)"
              @keydown.space.prevent="goToExplorer(tractName)"
            >
              Explore <i class="fas fa-search"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Intro text -->
    <intro-text class="tw-mt-6" />

    <!-- SPI row -->
    <div class="scorecard-grid-double tw-mt-20">
      <header-row
        :tract-name-first="tractNameFirst"
        :tract-name-second="tractNameSecond"
      />
      <data-row
        class="grid-row-wrapper-1"
        :data="data"
        :metadata="metadata"
        variable="social_progress_index"
        :tract-name-first="tractNameFirst"
        :tract-name-second="tractNameSecond"
        circle-size="8"
        :show-border="true"
        font-size="tw-text-xl"
        variable-classes="tw-font-semibold"
      />
    </div>

    <!-- Scorecard for dimensions/components/indicators -->
    <div class="tw-mt-10 tw-flex tw-flex-col tw-justify-between tw-gap-8">
      <!-- One grid for each dimension -->
      <div
        class="scorecard-grid-double"
        v-for="dimension in metadata.hierarchy['social_progress_index']"
      >
        <!-- Dimension row with headers -->
        <header-row
          :tract-name-first="tractNameFirst"
          :tract-name-second="tractNameSecond"
        />
        <data-row
          class="grid-row-wrapper-1"
          :data="data"
          :metadata="metadata"
          :variable="dimension"
          :tract-name-first="tractNameFirst"
          :tract-name-second="tractNameSecond"
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
            :tract-name-first="tractNameFirst"
            :tract-name-second="tractNameSecond"
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
            :tract-name-first="tractNameFirst"
            :tract-name-second="tractNameSecond"
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
  name: "ScorecardDouble",
  props: {
    /**
     * First tract name
     */
    tractNameFirst: { type: String, required: true },

    /**
     * Second tract name
     */
    tractNameSecond: { type: String, required: true },
  },
  components: {
    ScorecardTitle,
    ClickableIcon,
    HeaderRow,
    DataRow,
    IntroText,
  },
  computed: {
    // Map state from store
    ...mapState(["data", "metadata"]),

    /**
     * Tract names
     */
    tractNames() {
      return [this.tractNameFirst, this.tractNameSecond];
    },
  },
  methods: {
    /**
     * Go to the explorer page with specified tract
     */
    goToExplorer(tractName) {
      this.$router.push({
        path: "/explorer",
        query: { tract: tractName },
      });
    },

    resetSelection(i) {
      let name = i == 0 ? this.tractNames[1] : this.tractNames[0];
      let selected = JSON.stringify([name]);
      this.$router.push({
        path: "/scorecards",
        query: { selected: selected },
      });
    },
  },
};
</script>
