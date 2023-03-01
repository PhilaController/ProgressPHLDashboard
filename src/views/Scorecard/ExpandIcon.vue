<template>
  <div class="tw-mr-1 tw-h-fit">
    <font-awesome-icon
      class="tw-text-zinc-600 hover:tw-cursor-pointer hover:tw-text-zinc-800 focus:tw-outline-2 focus:tw-outline-offset-2 focus:tw-outline-zinc-600"
      :icon="`fa-solid fa-angle-${direction}`"
      :title="title"
      role="button"
      tabindex="0"
      @click.prevent="$emit('change', action)"
      @keydown.enter.prevent="$emit('change')"
      @keydown.space.prevent="$emit('change')"
    />
  </div>
</template>

<script>
export default {
  name: "ExpandIcon",
  props: ["direction"],
  computed: {
    action() {
      if (this.direction == "down") return "expand";
      else return "collapse";
    },
    title() {
      let t;
      t = this.direction == "down" ? "Expand" : "Collapse";
      return t + " the indicators for this component";
    },
  },
};
</script>
