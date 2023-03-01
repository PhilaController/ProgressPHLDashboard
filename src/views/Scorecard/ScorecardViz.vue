<template>
  <div>
    <!-- Top: SPI Summary-->
    <div
      class="tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-center"
    >
      <!-- Header -->
      <div class="tw-flex tw-flex-col">
        <div class="tw-ml-14 tw-text-sm tw-font-bold">The</div>
        <div class="tw-flex tw-flex-row">
          <scorecard-circle
            class="tw-h-10 tw-w-10"
            :label="SPI.average_label"
          />
          <div
            class="tw-ml-4 tw-mb-1 tw-h-fit tw-w-fit tw-border-b-2 tw-border-b-stone-300 tw-pb-0.5 tw-text-3xl tw-font-bold"
          >
            Social Progress Index
          </div>
        </div>
        <div class="tw-ml-14 tw-text-sm tw-font-bold">
          for Census Tract {{ selectedTract }}
        </div>
      </div>

      <!-- SPI Info -->
      <div class="tw-ml-8 tw-flex">
        <!-- Score -->
        <div
          class="tw-flex tw-flex-col tw-items-start tw-rounded-lg tw-border-2 tw-border-stone-500 tw-py-2 tw-px-4"
        >
          <div
            class="variable-name tw-text-base"
            v-tooltip.right-end="
              'The index score on a scale from 0 to 100, with higher values representing better performance'
            "
          >
            Score
          </div>
          <div class="tw-text-5xl">
            {{ formatFunction(SPI.value) }}
            <span class="tw-opacity-50"> / 100 </span>
          </div>
        </div>

        <!-- Rank -->
        <div
          class="tw-ml-4 tw-flex tw-flex-col tw-items-start tw-rounded-lg tw-border-2 tw-border-stone-500 tw-py-2 tw-px-4"
        >
          <div
            class="variable-name tw-text-base"
            v-tooltip.right-end="
              `How this census tract ranks compares to the total number of tracts (${uniqueTracts}), with rank #1 representing the best-performing tract`
            "
          >
            Rank
          </div>

          <div class="tw-text-5xl">
            {{ SPI.rank
            }}<sup class="tw-text-3xl tw-italic">{{
              getNumberSuffix(SPI.rank)
            }}</sup>
            <span class="tw-opacity-50">
              /
              {{ uniqueTracts }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Subheader for scorecard -->
    <div class="tw-mt-20 tw-ml-2 tw-flex tw-flex-col tw-pb-0.5">
      <div
        class="tw-w-fit tw-border-b tw-border-stone-300 tw-pr-4 tw-text-2xl tw-font-bold"
      >
        Dimensions & Components
      </div>

      <!-- Button group -->
      <div class="tw-mt-3 tw-flex">
        <expand-button
          title="Expand all components"
          text="Expand All"
          :disabled="expandedComponents.length == allComponents.length"
          @click="expandAll()"
        />
        <expand-button
          class="tw-ml-2"
          title="Collapse all components"
          text="Collapse All"
          :disabled="expandedComponents.length == 0"
          @click="collapseAll()"
        />
      </div>

      <!-- Data explorer link -->
      <div class="tw-flex tw-h-fit tw-flex-row tw-items-center">
        <span class="tw-pt-1 tw-text-base tw-italic"
          >See how this tract compares citywide in the
          <router-link
            class="tw-font-bold tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
            @mouseover.native="mouseoverCityLimits = true"
            @mouseleave.native="mouseoverCityLimits = false"
            :to="{ path: '/explorer', query: { tract: selectedTract } }"
            >Data Explorer</router-link
          ></span
        >
        <city-limits-sparkline
          v-if="cityLimits !== null"
          :city-limits="cityLimits"
          :mouseover="mouseoverCityLimits"
          class="tw-h-[35px] tw-w-[35px]"
          color="#0F7582"
        />
      </div>
    </div>

    <!-- Bottom: Three main dimension headers -->
    <div class="tw-mt-10 tw-flex tw-flex-row tw-justify-between">
      <div
        class="tw-grid tw-w-1/3 tw-grid-cols-[min-content_2fr_1fr_min-content_min-content] tw-items-end tw-gap-x-0"
        :class="{ 'tw-mr-8': i < 2 }"
        v-for="(dimension, i) in metadata.hierarchy['social_progress_index']"
      >
        <div class="grid-row-wrapper-1">
          <!-- Circle -->
          <div class="scorecard-cell tw-justify-center"></div>
          <!-- Name -->
          <div class="scorecard-cell tw-font-bold"></div>
          <!-- Value -->
          <div
            class="scorecard-cell tw-items-end tw-justify-end tw-text-sm tw-font-bold tw-text-neutral-500"
          >
            Score/Value
          </div>
          <!-- Rank -->
          <div
            class="scorecard-cell tw-items-end tw-justify-end tw-pl-4 tw-text-sm tw-font-bold tw-text-neutral-500"
          >
            Rank
          </div>
          <div class="scorecard-cell tw-ml-4 tw-w-[18px]"></div>
        </div>
        <div class="grid-row-wrapper-1">
          <!-- Circle -->
          <div class="scorecard-cell tw-justify-center">
            <scorecard-circle
              class="tw-mr-2 tw-h-8 tw-w-8"
              :label="getData(dimension).average_label"
            />
          </div>
          <!-- Name -->
          <div
            class="scorecard-cell tw-border-b tw-border-stone-300 tw-pb-1 tw-font-bold"
          >
            <div class="variable-name tw-text-xl tw-leading-tight">
              {{ metadata.aliases[dimension] }}
            </div>
          </div>
          <!-- Value -->
          <div
            class="scorecard-cell tw-items-end tw-justify-end tw-border-b tw-border-stone-300 tw-pb-1"
          >
            <div class="tw-text-right tw-text-xl">
              {{ formatFunction(getData(dimension).value) }}
            </div>
          </div>
          <!-- Rank -->
          <div
            class="scorecard-cell tw-items-end tw-justify-end tw-border-b tw-border-stone-300 tw-pl-4 tw-pb-1"
          >
            <div class="tw-text-right tw-text-xl tw-opacity-50">
              {{ getData(dimension).rank }}
            </div>
          </div>
          <div class="scorecard-cell tw-ml-4 tw-w-[18px]"></div>
        </div>
      </div>
    </div>

    <!-- One column for each main dimension -->
    <div class="tw-ml-2 tw-flex tw-flex-row tw-justify-between">
      <div
        class="tw-grid tw-h-fit tw-w-1/3 tw-grid-cols-[min-content_2fr_1fr_min-content_min-content] tw-gap-y-0 tw-gap-x-0"
        :class="{ 'tw-mr-8': i < 2 }"
        v-for="(dimension, i) in metadata.hierarchy['social_progress_index']"
      >
        <!-- Components -->
        <template v-for="(component, j) in metadata.hierarchy[dimension]">
          <div class="grid-row-wrapper-2">
            <!-- Circle -->
            <div class="scorecard-cell tw-items-center">
              <scorecard-circle
                class="tw-h-6 tw-w-6"
                :label="getData(component).average_label"
              />
            </div>

            <!-- Name -->
            <div
              class="scorecard-cell tw-ml-2 tw-items-center"
              :class="{ 'tw-border-t tw-border-stone-300': j > 0 }"
            >
              <div class="variable-name tw-text-base tw-leading-none">
                {{ metadata.aliases[component] }}
              </div>
            </div>

            <!-- Value -->
            <div
              class="scorecard-cell tw-items-end tw-justify-end"
              :class="{ 'tw-border-t tw-border-stone-300': j > 0 }"
            >
              <div class="tw-ml-2 tw-text-lg">
                {{ formatFunction(getData(component).value) }}
              </div>
            </div>
            <!-- Rank -->
            <div
              class="scorecard-cell tw-items-end tw-justify-end tw-pl-4"
              :class="{ 'tw-border-t tw-border-stone-300': j > 0 }"
            >
              <div class="tw-text-right tw-text-lg tw-opacity-50">
                {{ getData(component).rank }}
              </div>
            </div>

            <!-- Expand/Collapse icon -->
            <div class="scorecard-cell tw-ml-4 tw-items-center tw-text-lg">
              <expand-icon
                v-if="!isExpanded(component, expandedComponents)"
                direction="down"
                @change="expand(component, expandedComponents)"
              />
              <expand-icon
                v-else
                direction="up"
                @change="collapse(component, expandedComponents)"
              />
            </div>
          </div>

          <!-- Indicators -->
          <div
            class="grid-row-wrapper-3"
            v-for="indicator in metadata.hierarchy[component]"
            :class="{
              'tw-hidden': !isExpanded(component, expandedComponents),
            }"
          >
            <!-- Circle  -->
            <div class="scorecard-cell tw-items-start tw-justify-center">
              <scorecard-circle
                class="tw-h-4 tw-w-4"
                :label="getData(indicator).average_label"
              />
            </div>
            <!-- Name -->
            <div class="scorecard-cell tw-ml-2 tw-items-start">
              <div class="tw-text-sm">
                <span
                  class="variable-name tw-italic tw-underline tw-decoration-dotted"
                  >{{ metadata.aliases[indicator] }}</span
                >
              </div>
            </div>
            <!-- Value -->
            <div class="scorecard-cell tw-items-start tw-justify-end">
              <div class="tw-ml-2 tw-text-sm">
                {{ formatFunction(getData(indicator).value) }}
              </div>
            </div>
            <!-- Rank -->
            <div class="scorecard-cell tw-items-start tw-justify-end tw-pl-4">
              <div class="tw-text-right tw-text-sm tw-opacity-50">
                {{ getData(indicator).rank }}
              </div>
            </div>
            <div class="scorecard-cell"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "d3-format";

import { ordinal } from "@/utils";
import ScorecardCircle from "./ScorecardCircle";
import ExpandIcon from "./ExpandIcon";
import ExpandButton from "./ExpandButton";
import CityLimitsSparkline from "@/components/CityLimitsSparkline";

export default {
  props: ["data", "metadata", "selectedTract", "cityLimits"],
  components: {
    ScorecardCircle,
    ExpandIcon,
    ExpandButton,
    CityLimitsSparkline,
  },
  data() {
    return {
      uniqueTracts: 372,

      // Which components are currently expanded?
      expandedComponents: [],

      mouseoverCityLimits: false,
    };
  },
  computed: {
    SPI() {
      return this.getData("social_progress_index");
    },
    allComponents() {
      let out = [];
      let dimensions = this.metadata.hierarchy["social_progress_index"];
      for (let i = 0; i < dimensions.length; i++) {
        let dim = dimensions[i];
        let components = this.metadata.hierarchy[dim];
        for (let j = 0; j < components.length; j++) out.push(components[j]);
      }
      return out;
    },
  },
  methods: {
    expandAll() {
      this.expandedComponents = [...this.allComponents];
    },
    collapseAll() {
      this.expandedComponents = [];
    },
    getNumberSuffix(v) {
      return ordinal(v);
    },
    getData(variable_name) {
      return this.data[variable_name].find(
        (d) => d.tract_name == this.selectedTract
      );
    },
    formatFunction(v) {
      return format(".1f")(v);
    },
    expand(name, array) {
      array.push(name);
    },
    collapse(name, array) {
      array.splice(array.indexOf(name), 1);
      array = [...array];
    },
    isExpanded(name, array) {
      return array.includes(name);
    },
  },
};
</script>

<style>
.scorecard-cell {
  display: flex;
  flex-direction: row;
  align-items: start;
}
.grid-row-wrapper-1,
.grid-row-wrapper-2,
.grid-row-wrapper-3 {
  display: contents;
}

.grid-row-wrapper-2 > .scorecard-cell {
  padding-top: 3rem !important;
  padding-bottom: 1rem !important;
}

.grid-row-wrapper-3 > .scorecard-cell {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.grid-row-wrapper-3 > .scorecard-cell {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}
</style>
