<template>
  <button class="sort-button tw-ml-1.5" @click="handleClick">
    <span class="sr-only">
      Sort table by {{ label }} in {{ type }}ending order
    </span>
    <div
      class="tw-flex tw-h-fit tw-flex-col tw-justify-center tw-text-sm tw-text-neutral-500 focus:tw-text-neutral-500"
    >
      <div class="-tw-mb-1.5" :class="{ 'tw-text-sky-500': type == 'asc' }">
        <font-awesome-icon icon="fa-solid fa-caret-up" />
      </div>
      <div class="-tw-mt-1.5" :class="{ 'tw-text-sky-500': type == 'desc' }">
        <font-awesome-icon icon="fa-solid fa-caret-down" />
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "SortButton",
  props: ["label"],
  data() {
    return { type: "desc" };
  },
  methods: {
    handleClick() {
      if (this.type == "desc") this.type = "asc";
      else this.type = "desc";
      this.$emit("sort", this.type);
    },
  },
};
</script>

<style>
.sort-button {
  border-width: 0 !important;
}
.sort-button:hover,
.sort-button:active,
.sort-button:focus {
  background-color: transparent !important;
  outline-width: 0px !important;
}
</style>
