<template>
  <div
    id="dimension-summary"
    class="tw-flex tw-flex-col tw-items-start sm:tw-flex-row sm:tw-justify-evenly"
  >
    <!-- First Dimension -->
    <dimension-block
      :data="data.filter((c, i) => [0, 3, 6, 9].includes(i))"
      title="Basic Human Needs"
      subtitle="Are Philadelphians' most essential needs being met?"
      :shadow-color="['sky', 400]"
    />

    <!-- Second Dimension -->
    <dimension-block
      class="tw-mt-8 sm:tw-mt-0"
      :data="data.filter((c, i) => [1, 4, 7, 10].includes(i))"
      title="Foundations of Wellbeing"
      subtitle="Are the building blocks in place for Philadelphians to enhance and sustain their wellbeing?"
      :shadow-color="['orange', 400]"
    />

    <!-- Third Dimension -->
    <dimension-block
      class="tw-mt-8 sm:tw-mt-0"
      :data="data.filter((c, i) => [2, 5, 8, 11].includes(i))"
      title="Opportunity"
      subtitle="Is there opportunity for all Philadelphians to reach their full potential?"
      :shadow-color="['green', 400]"
    />
  </div>
</template>

<script>
import DimensionBlock from "./DimensionBlock";

export default {
  name: "DimensionSummary",
  props: ["data"],
  components: { DimensionBlock },
};
</script>
