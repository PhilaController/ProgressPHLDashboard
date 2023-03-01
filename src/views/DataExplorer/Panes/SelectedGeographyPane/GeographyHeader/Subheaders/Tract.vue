<template>
  <div class="tw-px-4 tw-text-sm sm:tw-px-8">
    In the
    <geography-breadcrumb
      :name="data.neighborhood_name"
      type="neighborhood"
      @click="$emit('geography:select', $event)"
      @mouseover="$emit('geography:highlight', $event)"
      @mouseout="$emit('geography:unhighlight')"
    />
    neighborhood in the
    <geography-breadcrumb
      :name="data.puma_name"
      type="region"
      @click="$emit('geography:select', $event)"
      @mouseover="$emit('geography:highlight', $event)"
      @mouseout="$emit('geography:unhighlight')"
    />
    region
  </div>
</template>

<script>
import GeographyBreadcrumb from "./GeographyBreadcrumb";

export default {
  name: "TractSubheader",
  components: { GeographyBreadcrumb },
  props: {
    /**
     * Properties for the selected tract
     */
    data: { type: Object, required: true },
  },
};
</script>
