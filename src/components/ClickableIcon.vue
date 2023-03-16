<template>
  <div
    class="hover:tw-cursor-pointer"
    :class="`${colorClass} ${hoverColorClass}`"
    :title="title"
    role="button"
    tabindex="0"
    @click.prevent="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <i :class="icon"></i>
  </div>
</template>

<script>
export default {
  name: "ClickableIcon",
  props: {
    /**
     * Font awesome icon classes
     */
    icon: { type: String, required: true },

    /**
     * Title attribute for button
     */
    title: { type: String },

    /**
     * Default color for icon
     */
    colorClass: { type: String, default: "tw-text-gray-400 " },

    /**
     * Default hover color
     */
    hoverColorClass: { type: String, default: "hover:tw-text-gray-800" },
  },
};
</script>
