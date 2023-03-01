<template>
  <div class="tw-flex tw-w-full tw-justify-center">
    <div class="tw-flex tw-w-full tw-flex-col" :class="widthClass">
      <!-- Iinput and submit -->
      <div class="tw-flex tw-w-full tw-flex-row" :class="widthClass">
        <!-- Input -->
        <input
          class="tw-w-full tw-border-b-2 tw-border-neutral-600 tw-bg-white tw-p-1 tw-text-sm placeholder:tw-text-neutral-800/50 focus:tw-outline-none"
          :placeholder="placeholder"
          v-model="search"
          @input="onInput"
        />
      </div>
      <!-- Error -->
      <div
        class="tw-semibold tw-mt-0.5 tw-text-left tw-text-xs tw-italic tw-text-red-500"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["placeholder", "widthClass"],
  data() {
    return {
      search: "",
      error: "",
      timeout: null,
    };
  },
  methods: {
    onInput(event, time = 300) {
      // Clear any existing timeout
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        let value = this.search;
        if (this.search) {
          value = parseFloat(this.search);
        }
        this.$emit("input", value);
      }, time);
    },
  },
};
</script>

<style>
.disabled {
  @apply tw-cursor-not-allowed tw-opacity-50 hover:tw-border-stone-300 hover:tw-bg-stone-100 !important;
}
</style>
