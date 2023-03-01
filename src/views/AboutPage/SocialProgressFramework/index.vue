<template>
  <div>
    <!-- Header -->
    <div class="tw-mx-4 tw-flex tw-justify-center">
      <div
        class="tw-mb-0 tw-w-fit tw-border-b-2 tw-pb-1 tw-text-2xl tw-font-semibold"
        :class="connectorColorClass"
      >
        Social Progress Index
      </div>
    </div>
    <div class="tw-flex tw-w-full tw-justify-center">
      <div class="tw-h-[50px] tw-border-l-2" :class="connectorColorClass"></div>
    </div>

    <!-- Main 3 Dimensions -->
    <template v-if="$mq !== 'mobile'">
      <div class="tw-mb-[2px] tw-grid tw-grid-cols-3 tw-grid-rows-1">
        <!-- Basic Human Needs -->
        <dimension-text-box
          loc="left"
          title="Basic Human Needs"
          bg-color-class="tw-bg-sky-200"
          border-color-class="tw-border-sky-400"
        />

        <!-- Foundations of Wellbeing -->
        <dimension-text-box
          loc="center"
          title="Foundations of Wellbeing"
          bg-color-class="tw-bg-orange-200"
          border-color-class="tw-border-orange-400"
        />

        <!-- Opportunity -->
        <dimension-text-box
          loc="right"
          title="Opportunity"
          bg-color-class="tw-bg-green-200"
          border-color-class="tw-border-green-400"
        />
      </div>

      <!-- Components -->
      <div class="tw-grid tw-grid-cols-3 tw-grid-rows-4">
        <component-text-box
          v-for="(component, i) in data"
          :key="component.title"
          :component="component"
          :show-bottom-connector="i < 9"
        />
      </div>
    </template>
    <template v-else>
      <!-- Basic Human Needs -->
      <dimension-text-box
        loc="center"
        title="Basic Human Needs"
        bg-color-class="tw-bg-sky-200"
        border-color-class="tw-border-sky-400"
        :hide-top-borders="true"
      />
      <component-text-box
        v-for="(component, i) in data.filter((c, j) =>
          [0, 3, 6, 9].includes(j)
        )"
        :key="component.title"
        :component="component"
      />

      <!-- Foundations of Wellbeing -->
      <dimension-text-box
        class="tw-mt-6"
        loc="center"
        title="Foundations of Wellbeing"
        bg-color-class="tw-bg-orange-200"
        border-color-class="tw-border-orange-400"
        :hide-top-borders="true"
      />
      <component-text-box
        v-for="(component, i) in data.filter((c, j) =>
          [1, 4, 7, 10].includes(j)
        )"
        :key="component.title"
        :component="component"
      />

      <!-- Opportunity -->
      <dimension-text-box
        class="tw-mt-6"
        loc="center"
        title="Opportunity"
        bg-color-class="tw-bg-green-200"
        border-color-class="tw-border-green-400"
        :hide-top-borders="true"
      />
      <component-text-box
        v-for="(component, i) in data.filter((c, j) =>
          [2, 5, 8, 11].includes(j)
        )"
        :key="component.title"
        :component="component"
      />
    </template>
  </div>
</template>

<script>
import DimensionTextBox from "./DimensionTextBox";
import ComponentTextBox from "./ComponentTextBox";

export default {
  name: "SocialProgressFramework",
  props: ["data"],
  components: { DimensionTextBox, ComponentTextBox },
  data() {
    return { connectorColorClass: "tw-border-zinc-800" };
  },
};
</script>
