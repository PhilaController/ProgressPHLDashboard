<template>
  <!-- Show a loader -->
  <loading-page v-if="isLoading" />

  <!-- If data is loaded, show the scorecard -->
  <div v-else class="tw-relative tw-flex tw-flex-col">
    <!-- Navbar -->
    <navbar />

    <!-- Header -->
    <div class="tw-mt-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
      <h1
        class="tw-mb-0 tw-w-fit tw-border-b-4 tw-border-b-zinc-800 tw-pb-2 tw-text-center"
      >
        Scorecard: Census Tract {{ selectedTract }}
      </h1>
    </div>

    <div class="tw-mt-10 tw-flex tw-px-4">
      <!-- Intro language -->
      <div class="tw-flex tw-w-1/2 tw-flex-col tw-justify-center tw-text-lg">
        <p>
          The Scorecard shows data for the Social Progress Index and its
          underlying dimensions/components for a particular census tract. Census
          tracts are small geographic regions containing about 4,000 residents
          on average. Typically, there are about eight census tracts in a
          neighborhood, on average.
        </p>
        <p class="tw-mt-6">
          The values for the Index and its components are color-coded according
          to whether the value is:
        </p>
        <ul class="tw-ml-10 tw-mt-2">
          <li>
            <!-- Above average -->
            <scorecard-circle
              class="tw-mb-2 tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
              label="Above Average"
            /><span class="tw-ml-2 tw-italic">Above the city average;</span>
          </li>

          <li>
            <!-- Close to average -->
            <scorecard-circle
              class="tw-mb-2 tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
              label="Average"
            /><span class="tw-ml-2 tw-italic">Close to the city average</span>;
          </li>

          <li>
            <!-- Below average -->
            <scorecard-circle
              class="tw-mb-2 tw-inline-block tw-h-6 tw-w-6 tw-align-middle"
              label="Below Average"
            />
            <span class="tw-ml-2 tw-italic">Below the city average.</span>
          </li>
        </ul>

        <p class="tw-mt-6">
          <!-- Selections -->

          Select a specific
          <span class="tw-font-bold tw-text-violet-500">census tract</span> or
          <span class="tw-font-bold tw-text-sky-500">neighborhood</span> using
          the dropdowns or by clicking on an individual tract in the map to the
          right.
        </p>
      </div>

      <!-- Right side -->
      <div class="tw-ml-8 tw-flex tw-w-1/2 tw-flex-col">
        <!-- Dropdowns -->
        <div class="tw-flex tw-items-end">
          <i
            class="fas fa-map-pin tw-min-w-[30px] tw-text-center tw-text-2xl tw-text-neutral-800"
          ></i>
          <div class="tw-ml-0.5 tw-pb-1 tw-text-sm tw-font-bold tw-italic">
            Current selection:
          </div>
          <div class="tw-ml-2 tw-flex tw-items-end tw-text-sm">
            <Dropdown
              class="tw-ml-2 tw-w-[175px] tw-text-sm tw-text-zinc-500"
              v-model="selectedTract"
              :options="dropdownTractOptions"
              selectButtonClasses="hover:tw-border-zinc-400 focus:tw-border-zinc-400"
              focusedOptionClasses="tw-bg-zinc-100"
              selectButtonLabelClasses="tw-font-bold tw-text-violet-500"
              focusedSelectedOptionClasses="tw-bg-zinc-600"
              selectedOptionClasses="tw-bg-zinc-500"
            />
          </div>
          <div class="tw-ml-2 tw-flex tw-items-end tw-text-sm">
            <Dropdown
              class="tw-ml-2 tw-w-[250px] tw-text-sm tw-text-zinc-500"
              v-model="selectedHood"
              :options="dropdownHoodOptions"
              selectButtonClasses="hover:tw-border-zinc-400 focus:tw-border-zinc-400"
              focusedOptionClasses="tw-bg-zinc-100"
              selectButtonLabelClasses="tw-font-bold tw-text-sky-500"
              focusedSelectedOptionClasses="tw-bg-zinc-600"
              selectedOptionClasses="tw-bg-zinc-500"
            />
          </div>
        </div>

        <!-- Map -->
        <scorecard-map
          :tracts="geojson.tracts"
          :hoods="geojson.hoods"
          :city-limits="geojson.cityLimits"
          :selected-tract="selectedTract"
          :selected-hood="selectedHood"
          :color-weight="colorWeight"
          :neighborhood-color="neighborhoodColor"
          :census-tract-color="censusTractColor"
          @change:tract="(value) => (selectedTract = value)"
          @change:hood="(value) => (selectedHood = value)"
        />
      </div>
    </div>

    <!-- Progress report -->
    <div class="tw-mt-20 tw-px-4">
      <scorecard-viz
        :data="data"
        :metadata="metadata"
        :selected-tract="selectedTract"
        :city-limits="cityLimits"
      />
    </div>
  </div>
</template>

<script>
import ScorecardViz from "./ScorecardViz";
import ScorecardMap from "./ScorecardMap";
import ScorecardCircle from "./ScorecardCircle";
import Navbar from "@/components/Navbar";
import LoadingPage from "@/components/LoadingPage";
import Dropdown from "@/components/Dropdown";

import { allNeighborhoods, tractsByNeighborhood, tractToHood } from "@/data";

export default {
  name: "Scorecard",
  props: ["data", "geojson", "metadata"],
  components: {
    Navbar,
    LoadingPage,
    ScorecardCircle,
    ScorecardMap,
    ScorecardViz,
    Dropdown,
  },
  data() {
    return {
      // State
      selectedTract: null,
      selectedHood: null,

      // Style options
      colorWeight: 500,
      censusTractColor: "violet",
      neighborhoodColor: "sky",
    };
  },
  created() {
    // Check url params
    if (this.censusTractId == undefined) {
      this.selectedHood = "Center City East";
      this.selectedTract = "1";
    } else {
      this.selectedTract = this.censusTractId;
      this.selectedHood = tractToHood.get(this.selectedTract);
    }
  },
  mounted() {},
  watch: {
    selectedHood(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$nextTick(() => {
          let values = tractsByNeighborhood.get(newValue);
          if (!values.includes(this.selectedTract))
            this.selectedTract = this.dropdownTractOptions[0].value;
        });
      }
    },

    selectedTract(newValue, oldValue) {
      if (newValue !== oldValue && this.$route.query.tract !== newValue) {
        this.$router.replace({ query: { tract: newValue } });
      }
    },
  },
  computed: {
    /*
      Tract id from the route path
    */
    censusTractId() {
      return this.$route.query.tract;
    },

    /*
      Has the page fully loaded?
    */
    isLoading() {
      return this.data == null || this.geojson == null;
    },

    /*
      Dropdown tract options
    */
    dropdownTractOptions() {
      let values = tractsByNeighborhood.get(this.selectedHood);

      let out = [];
      for (let i = 0; i < values.length; i++)
        out.push({ label: `Census Tract ${values[i]}`, value: values[i] });

      return out;
    },

    /*
      Dropdown neighborhood options
    */
    dropdownHoodOptions() {
      return allNeighborhoods;
    },
  },
  methods: {},
};
</script>

<style></style>
