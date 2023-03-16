<template>
  <div class="tw-mt-0.5 tw-flex tw-items-center tw-gap-0.5 tw-text-base">
    <!-- Definition -->
    <clickable-icon
      icon="fas fa-info-circle"
      title="Go to definition"
      color-class="tw-text-gray-300"
      hover-color-class="hover:tw-text-gray-600"
      @click="goToDefinition"
    />

    <!-- Change map variable -->
    <clickable-icon
      icon="far fa-eye"
      title="Show variable on map"
      color-class="tw-text-gray-300"
      hover-color-class="hover:tw-text-gray-600"
      @click="changeMappedVariable"
    />

    <!-- Change map variable -->
    <clickable-icon
      v-if="selectedGeographyType == 'tract'"
      icon="fas fa-table"
      title="See data indicators"
      color-class="tw-text-gray-300"
      hover-color-class="hover:tw-text-gray-600"
      @click="showScorecard"
    />
  </div>
</template>

<script>
import ClickableIcon from "@/components/ClickableIcon";

export default {
  name: "OptionsMenu",
  props: {
    /**
     * The variable name
     */
    variable: { type: String, required: true },

    /**
     * The type of the selected geography
     */
    selectedGeographyType: { type: String, required: true },
  },
  components: { ClickableIcon },
  methods: {
    /**
     * Go the specified definition page
     */
    goToDefinition() {
      this.$router.push({
        path: "/definitions",
        query: { value: this.variable },
      });
    },

    /**
     * Change the variable shown on the map
     */
    changeMappedVariable() {
      this.$emit("update:map-variable", this.variable);
    },

    /**
     * Emit the event to show the scorecard
     */
    showScorecard() {
      this.$emit("scorecard", this.variable);
    },
  },
};
</script>
