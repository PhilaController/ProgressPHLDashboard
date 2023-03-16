<template>
  <div class="tw-contents">
    <div class="grid-row-wrapper-header">
      <!-- Name -->
      <div class="scorecard-cell"></div>
      <div
        class="scorecard-cell tw-col-span-3 tw-items-end tw-justify-end tw-text-base tw-font-semibold tw-text-neutral-500"
      >
        {{ tractNameFirst }}
      </div>
      <div
        class="scorecard-cell tw-col-span-3 tw-items-end tw-justify-end tw-text-base tw-font-semibold tw-text-neutral-500"
      >
        {{ tractNameSecond }}
      </div>
    </div>
    <div class="grid-row-wrapper-header">
      <!-- Name -->
      <div class="scorecard-cell"></div>
      <template v-for="_ in [0, 1]">
        <!-- Value -->
        <div
          class="scorecard-cell tw-items-end tw-justify-end tw-text-sm tw-text-neutral-500"
        >
          Value
        </div>
        <!-- Rank -->
        <div
          class="scorecard-cell tw-items-end tw-justify-end tw-pl-4 tw-text-sm tw-text-neutral-500"
        >
          Rank
        </div>
        <!-- Circle-->
        <div class="scorecard-cell tw-justify-center"></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tractNameFirst", "tractNameSecond"],
};
</script>

<style scoped>
.grid-row-wrapper-header:first-child > .scorecard-cell {
  margin-bottom: 10px;
}
</style>
