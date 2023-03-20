<template>
  <!-- Title -->
  <div class="tw-flex">
    <div class="tw-text-4xl tw-font-semibold">Social Progress Scorecards</div>

    <div class="tw-ml-2 tw-flex tw-items-center tw-gap-0.5">
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
</template>

<script>
import ScorecardCircle from "@/components/Scorecard/ScorecardCircle";

export default {
  name: "ScorecardTitle",
  components: { ScorecardCircle },
};
</script>
