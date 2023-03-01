<template>
  <div class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center">
    <!-- Explore button -->
    <div
      class="btn-default btn-default-colors tw-relative sm:tw-mr-6"
      role="button"
      :class="{ 'tw-pointer-events-none': isLoading }"
      :tabindex="isLoading ? -1 : 0"
      @click.prevent="goTo('/explorer')"
      @keydown.enter.prevent="goTo('/explorer')"
      @keydown.space.prevent="goTo('/explorer')"
    >
      <div
        v-if="isLoading"
        class="tw-absolute tw-top-0 tw-left-0 tw-z-10 tw-h-full tw-w-full"
      >
        <div class="loader-wrapper items-center tw-flex tw-justify-center">
          <span>Loading data</span><span class="loader tw-ml-2"></span>
        </div>
      </div>
      <span :class="{ 'tw-opacity-0': isLoading }">Explore the data</span>
    </div>

    <!-- Learn more button -->
    <div
      class="btn-default btn-default-colors tw-mt-4 sm:tw-mt-0 sm:tw-ml-6"
      role="button"
      tabindex="0"
      @click.prevent="goTo('/about')"
      @keydown.enter.prevent="goTo('/about')"
      @keydown.space.prevent="goTo('/about')"
    >
      Learn More
    </div>
  </div>
</template>

<script>
export default {
  name: "Buttons",
  props: ["data", "geojson"],
  computed: {
    isLoading() {
      return this.data == null || this.geojson == null;
    },
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.loader {
  width: 20px;
  height: 20px;
  border: 2.5px solid #0f7582;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader-wrapper {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
