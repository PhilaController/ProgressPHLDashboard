<template>
  <div class="tw-rounded-full tw-border-2" :class="getCircleColor()"></div>
</template>

<script>
export default {
  props: ["label"],
  methods: {
    getCircleColor() {
      if (this.label == "Above Average")
        return "tw-bg-emerald-500 tw-border-emerald-700";
      else if (this.label == "Average")
        return "tw-bg-yellow-300 tw-border-yellow-500";
      else return "tw-bg-red-500 tw-border-red-700";
    },
  },
};
</script>
