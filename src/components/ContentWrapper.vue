<template>
  <!-- Show a loader -->
  <loading-page v-if="isLoading" />

  <div
    v-else
    class="tw-relative tw-flex tw-flex-col"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <!-- Main content -->
    <div :style="getPaddingTop(navBarHeight)">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import LoadingPage from "./Loading/LoadingPage";
import Navbar from "./Navbar";

export default {
  name: "ContentWrapper",
  props: {
    /**
     * The height of the ProgressPHL navbar in pixels
     */
    navBarHeight: { type: Number },

    /**
     * The height of the controller.phila.gov navbar in pixels
     */
    controllerNavHeight: { type: Number },

    /**
     * Do we need top padding
     */
    usePadding: { type: Boolean },

    /**
     * Is the page loading?
     */
    isLoading: { type: Boolean },
  },
  components: { Navbar, LoadingPage },
  methods: {
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>
