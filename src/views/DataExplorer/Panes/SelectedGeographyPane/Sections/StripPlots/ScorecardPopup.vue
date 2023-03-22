<template>
  <card-modal
    :showing="showing"
    widthClass="tw-max-w-3xl"
    @close="$emit('close')"
  >
    <!-- Content start -->
    <div class="tw-my-4 tw-flex tw-h-full tw-w-full tw-flex-col">
      <!-- Title-->
      <div class="tw-flex tw-items-end tw-pb-1 tw-leading-none">
        <div class="tw-text-2xl">
          <i class="fas fa-table"></i>
        </div>
        <div class="tw-ml-2 tw-text-2xl tw-font-semibold">
          Scorecard Preview
        </div>
      </div>

      <!-- Intro text -->
      <div class="tw-mt-0 tw-text-sm">
        <p class="tw-italic">
          Scorecard values are color-coded according to whether the value is
          above the city average
          <scorecard-circle
            class="tw-ml-0 tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Above Average"
          />, close to the city average
          <scorecard-circle
            class="tw-ml-0 tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Average"
          />, or below the city average
          <scorecard-circle
            class="tw-ml-0 tw-mb-2 tw-inline-block tw-h-4 tw-w-4 tw-align-middle"
            label="Below Average"
          />.
        </p>
      </div>

      <!-- Scorecard -->
      <div class="tw-mt-8 tw-flex tw-flex-col tw-justify-between tw-gap-8">
        <!-- Grid start-->
        <div class="scorecard-grid">
          <header-row-single />

          <!-- Show dimension if we need to -->

          <data-row-single
            v-if="isDimension"
            class="grid-row-wrapper-1"
            :data="data"
            :metadata="metadata"
            :variable="variable"
            :tract-name="tractName"
            circle-size="8"
            :show-border="true"
            font-size="tw-text-xl"
            variable-classes="tw-font-semibold"
          />

          <!-- Do all of the components -->
          <template v-for="component in componentsToDo">
            <data-row-single
              class="grid-row-wrapper-2"
              :data="data"
              :metadata="metadata"
              :variable="component"
              :tract-name="tractName"
              circle-size="6"
              :show-border="false"
              font-size="tw-text-lg"
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

    <!-- Go to scorecard button -->
    <div class="tw-flex tw-w-full tw-justify-center">
      <div
        class="btn-default-colors tw-mt-4 tw-min-w-[100px] tw-rounded tw-border-[1px] tw-border-solid tw-px-3 tw-py-3 tw-text-center tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[2px] sm:tw-w-fit sm:tw-border-[2px] sm:tw-text-xs md:tw-text-sm"
        role="button"
        tabindex="0"
        @click.prevent="goToScorecard"
        @keydown.enter.prevent="goToScorecard"
        @keydown.space.prevent="goToScorecard"
      >
        See full scorecard
      </div>
    </div>
  </card-modal>
</template>

<script>
import HeaderRowSingle from "@/views/Scorecards/ComparisonPage/Single/HeaderRow";
import DataRowSingle from "@/views/Scorecards/ComparisonPage/Single/DataRow";
import CardModal from "@/components/CardModal";
import ScorecardCircle from "@/views/Scorecards/components/ScorecardCircle";

export default {
  name: "ScorecardPopup",
  props: {
    showing: { type: Boolean, required: true },

    /**
     * SPI data
     */
    data: { type: Object, required: true },

    /**
     * Metadata for SPI
     */
    metadata: { type: Object, required: true },

    /**
     * Tract name
     */
    tractName: { type: String },

    /**
     * Variable name
     */
    variable: { type: String },
  },
  components: { ScorecardCircle, CardModal, HeaderRowSingle, DataRowSingle },

  computed: {
    isDimension() {
      return this.metadata.hierarchy["social_progress_index"].includes(
        this.variable
      );
    },
    componentsToDo() {
      if (!this.isDimension) return [this.variable];
      else return this.metadata.hierarchy[this.variable];
    },
  },

  methods: {
    goToScorecard() {
      this.$router.push({
        path: `scorecards/${this.tractName}`,
      });
    },
  },
};
</script>
