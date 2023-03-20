<template>
  <div class="tw-text-base">
    <p>
      The social progress scorecard shows how scores for a particular tract
      compare to other tracts in the city, color-coded according to whether the
      value is above the city average
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
</template>

<script>
import ScorecardCircle from "./ScorecardCircle";

export default {
  name: "IntroText",
  components: { ScorecardCircle },
};
</script>
