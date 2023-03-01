<template>
  <span
    class="tw-font-medium tw-underline hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-outline-none"
    tabindex="0"
    @click.prevent="goTo"
    @keydown.enter.prevent="goTo"
    @keydown.space.prevent="goTo"
    @mouseover="$emit('mouseover', geographyParams)"
    @mouseout="$emit('mouseout')"
    >{{ displayName }}</span
  >
</template>

<script>
export default {
  props: ["type", "name"],
  computed: {
    geographyParams() {
      return { name: this.name, type: this.type };
    },
    displayName() {
      if (this.type === "tract") return this.getLastWord(this.name);
      else return this.name;
    },
  },
  methods: {
    getLastWord(words) {
      let n = words.split(" ");
      return n[n.length - 1];
    },
    goTo() {
      // Create the query
      let query = {};
      query[this.type] = this.name;

      // Update the router
      this.$router.replace({ query: query });

      // Emit the event
      this.$emit("click", this.geographyParams);
    },
  },
};
</script>
