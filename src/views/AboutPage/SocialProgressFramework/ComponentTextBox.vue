<template>
  <div class="tw-ml-4 tw-flex">
    <div class="tw-flex tw-h-full tw-flex-col tw-items-center">
      <!-- Top Connector -->
      <div
        class="tw-flex-grow tw-border-l-2 tw-border-dotted tw-border-stone-400 tw-pt-8"
      ></div>

      <!-- Icon -->
      <div
        class="tw-mt-1 tw-min-w-[40px] tw-flex-grow tw-text-center tw-text-3xl"
      >
        <font-awesome-icon
          :icon="`fa-solid ${component.icon}`"
          :class="`${component.iconColor} `"
        />
      </div>

      <!-- Bottom Connector -->
      <div
        v-if="showBottomConnector"
        class="tw-flex-grow tw-border-l-2 tw-border-dotted tw-border-stone-400"
      ></div>
    </div>

    <!-- Title and question -->
    <div class="tw-pt-8">
      <div class="tw-ml-2 tw-text-base tw-font-semibold">
        {{ component.title }}
      </div>
      <div class="tw-mx-4 tw-mt-0 tw-text-sm tw-italic">
        {{ component.question }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentTextBox",
  props: ["component", "showBottomConnector"],
};
</script>
