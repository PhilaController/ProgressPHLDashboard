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
          @input="($event) => handleInput($event.target.value)"
        />
      </div>
      <!-- Error -->
      <div
        class="tw-semibold tw-mt-1 tw-text-left tw-text-xs tw-italic tw-text-red-500"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default {
  props: {
    placeholder: { type: String },
    widthClass: { type: String },
  },
  data() {
    return { error: "", search: "" };
  },
  methods: {
    handleClear() {
      this.search = "";
      this.handleInput(this.search);
    },
    handleInput(value) {
      // Clear the error
      this.error = "";

      // No value is fine (cleared)
      if (!value) {
        this.$emit("input", null);
        return;
      }

      // Remove trailing percent
      if (value.endsWith("%")) value = value.substring(0, value.length - 1);

      // Emit
      if (isNumeric(value)) {
        value = parseFloat(value);
        if (value < 0 || value > 100) {
          this.error = "Value should be between 0 and 100";
          return;
        }
        this.$emit("input", value);
      } else {
        this.error = "Input should be a valid number between 0 and 100";
      }
    },
  },
};
</script>


