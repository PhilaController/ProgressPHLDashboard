<template>
  <content-wrapper :is-loading="isLoading">
    <!-- The top section -->
    <div
      class="tw-relative tw-mx-auto tw-mt-4 tw-w-full tw-max-w-5xl tw-pb-10 sm:tw-px-4"
      v-if="!isLoading"
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
  </content-wrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper";
import ScorecardSingle from "./Single";
import ScorecardDouble from "./Double";
import { mapState } from "vuex";

export default {
  name: "ScorecardComparisonPage",
  components: {
    ContentWrapper,
    ScorecardSingle,
    ScorecardDouble,
  },
  computed: {
    ...mapState(["data", "metadata"]),
    isLoading() {
      return this.metadata == null || this.data == null;
    },
  },
};
</script>
