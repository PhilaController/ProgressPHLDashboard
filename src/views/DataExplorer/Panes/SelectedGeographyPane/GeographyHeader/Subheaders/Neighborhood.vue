<template>
  <div class="tw-px-4 tw-text-sm sm:tw-px-8">
    Includes tracts
    <!-- Tracts -->
    <template v-for="i in neighborhoodSize">
      <geography-breadcrumb
        :name="`${name} ${i}`"
        type="tract"
        @click="$emit('geography:select', $event)"
        @mouseover="$emit('geography:highlight', $event)"
        @mouseout="$emit('geography:unhighlight')"
      /><span v-if="i === neighborhoodSize - 1">,&nbsp;and&nbsp; </span>
      <span v-else-if="i < neighborhoodSize">,&nbsp;</span>
    </template>
    <span
      >&nbsp;and is <span v-if="regions.length > 1">split between</span
      ><span v-else>contained within</span> the</span
    >
    <!-- Regions -->
    <template v-for="(name, i) of regions">
      <span v-if="i == 0">&nbsp;</span>
      <geography-breadcrumb
        type="region"
        :name="name"
        @click="$emit('geography:select', $event)"
        @mouseover="$emit('geography:highlight', $event)"
        @mouseout="$emit('geography:unhighlight')"
      />
      <span v-if="regions.length == 2 && i === 0"> and </span>
      <span v-else-if="regions.length > 2 && i == regions.length - 2"
        >, and
      </span>
      <span v-else-if="regions.length > 2 && i < regions.length - 2"
        >, &nbsp;</span
      >
    </template>
    <span v-if="regions.length > 1"> regions</span><span v-else> region</span>
  </div>
</template>

<script>
import GeographyBreadcrumb from "./GeographyBreadcrumb";

export default {
  name: "NeighborhoodSubheader",
  components: { GeographyBreadcrumb },
  props: {
    /**
     * Name of selected neighborhood
     */
    name: { type: String, required: true },

    /**
     * Number of tracts in this neighborhoods
     */
    neighborhoodSize: { type: Number, required: true },

    /**
     * Regions for this neighborhood
     */
    regions: { type: Array, required: true },
  },
};
</script>
