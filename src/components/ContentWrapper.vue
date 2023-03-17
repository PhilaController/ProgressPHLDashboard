<template>
  <!-- Show a loader -->
  <loading-page v-if="isLoading" />

  <div
    v-else
    class="tw-relative tw-flex tw-flex-col"
    :class="wrapperClass"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <!-- Main content -->
    <div
      class="tw-relative tw-flex tw-h-full tw-w-full"
      :class="contentClass"
      :style="getPaddingTop(navBarHeight)"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingPage from "./Loading/LoadingPage";
import Navbar from "./Navbar";

export default {
  name: "ContentWrapper",
  props: {
    /**
     * Is the page loading?
     */
    isLoading: { type: Boolean },

    /**
     * Extra classes for content wrapper
     */
    contentClass: { type: String, default: "" },

    /**
     * Extra classes for div wrapper
     */
    wrapperClass: { type: String, default: "" },
  },
  components: { Navbar, LoadingPage },
  computed: {
    ...mapState(["navBarHeight", "controllerNavHeight", "usePadding"]),
  },
  methods: {
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>
