<template>
  <div class="tw-px-4 tw-text-sm sm:tw-px-8">
    Includes
    <span v-for="label in labels" v-if="neighborhoods[label].length > 0">
      <span v-if="label !== 'All'">;&nbsp;</span>
      <span>{{ label.toLowerCase() }} of</span>
      <template v-for="(name, i) of neighborhoods[label]">
        <span v-if="i == 0">&nbsp;</span>
        <geography-breadcrumb
          :name="name"
          type="neighborhood"
          @click="$emit('geography:select', $event)"
          @mouseover="$emit('geography:highlight', $event)"
          @mouseout="$emit('geography:unhighlight')"
        /><span v-if="i !== neighborhoods[label].length - 1">, &nbsp;</span>
      </template>
    </span>
  </div>
</template>

<script>
import GeographyBreadcrumb from "./GeographyBreadcrumb";

export default {
  name: "RegionSubheader",
  components: { GeographyBreadcrumb },
  props: {
    /**
     * Map from region to neighborhoods
     */
    neighborhoods: { type: Object, required: true },
  },
  data() {
    return {
      /**
       * Label for how neighborhoods overlap with regions
       */
      labels: ["All", "Most", "Some"],
    };
  },
};
</script>
