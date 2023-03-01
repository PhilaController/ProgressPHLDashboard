<template>
  <div class="tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-start">
    <!-- Connector -->
    <div class="tw-flex tw-w-full">
      <!-- Left box -->
      <template v-if="loc == 'left'">
        <div class="tw-flex-grow"></div>
        <div
          class="tw-h-[30px] tw-flex-grow tw-border-t-2 tw-border-l-2"
          :class="connectorColorClass"
        ></div>
      </template>

      <!-- Center box -->
      <template v-else-if="loc == 'center'">
        <template v-if="!hideTopBorders">
          <div
            class="tw-h-[30px] tw-flex-grow tw-border-t-2"
            :class="connectorColorClass"
          ></div>
          <div
            class="tw-h-[30px] tw-flex-grow tw-border-t-2 tw-border-l-2"
            :class="connectorColorClass"
          ></div>
        </template>
        <template v-else>
          <div
            class="tw-h-[30px] tw-flex-grow tw-border-t-0"
            :class="connectorColorClass"
          ></div>
          <div
            class="tw-h-[30px] tw-flex-grow tw-border-t-0 tw-border-l-2"
            :class="connectorColorClass"
          ></div>
        </template>
      </template>
      <!-- Right box -->
      <template v-else>
        <div
          class="tw-h-[30px] tw-flex-grow tw-border-t-2 tw-border-r-2"
          :class="connectorColorClass"
        ></div>
        <div class="tw-flex-grow"></div>
      </template>
    </div>

    <!-- Text box -->
    <div class="tw-flex tw-h-full tw-w-full tw-items-end tw-justify-center">
      <div
        class="tw-ml-[35px] tw-h-1/2 tw-flex-grow tw-border-t-2 tw-border-l-2 tw-border-dotted tw-border-stone-400"
      ></div>
      <div
        class="tw-mx-2 tw-flex tw-h-full tw-w-fit tw-items-center tw-justify-center tw-rounded tw-border-2 tw-px-4 tw-py-2 tw-text-center tw-text-lg tw-font-semibold sm:tw-text-xl"
        :class="`${bgColorClass} ${borderColorClass}`"
      >
        {{ title }}
      </div>
      <div class="tw-flex-grow"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DimensionTextBox",
  props: ["loc", "title", "bgColorClass", "borderColorClass", "hideTopBorders"],
  data() {
    return { connectorColorClass: "tw-border-zinc-800" };
  },
};
</script>
