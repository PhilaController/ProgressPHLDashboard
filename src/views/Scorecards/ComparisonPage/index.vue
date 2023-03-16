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
      <scorecard-single
        v-if="!$route.params.tract2"
        :data="data"
        :metadata="metadata"
        :tract-name="$route.params.tract1"
      />
      <scorecard-double
        v-else
        :data="data"
        :metadata="metadata"
        :tract-name-first="$route.params.tract1"
        :tract-name-second="$route.params.tract2"
      />
    </div>
  </div>
</template>

<script>
import LoadingPage from "@/components/Loading/LoadingPage";
import Navbar from "@/components/Navbar";
import ScorecardSingle from "./ScorecardSingle";
import ScorecardDouble from "./ScorecardDouble";

export default {
  name: "Scorecard",
  props: [
    "metadata",
    "data",
    "geojson",
    "controllerNavHeight",
    "navBarHeight",
    "usePadding",
  ],
  components: {
    LoadingPage,
    Navbar,
    ScorecardSingle,
    ScorecardDouble,
  },
  computed: {
    isLoading() {
      return this.metadata == null || this.data == null;
    },
  },
  methods: {
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>
