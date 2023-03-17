<template>
  <div id="app">
    <router-view :key="$route.path" />
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "App",
  data() {
    return {
      /** Controller navbar height */
      controllerNavHeight: null,
      usePadding: null, // On small screens, controller nav is static, not fixed
      observer: null,

      /**
       * Data cache for indicators
       */
      indicatorsDataCache: {},
    };
  },

  /**
   * Fetch the data on creation (synchronously)
   */
  created() {
    const fetchers = ["fetchSPIData", "fetchSPIMetadata", "fetchGeojson"];
    fetchers.map((functionName) => this.$store.dispatch(functionName));
  },

  /**
   * When mounted set up observer for nav height
   */
  mounted() {
    // Track the controller.phila.gov nav height
    const observer = new ResizeObserver(() => {
      // Get the controller nav
      const el = $("#site-navigation");

      // Save the height
      this.$store.commit("setValue", {
        key: "controllerNavHeight",
        value: el.outerHeight(),
      });

      // Do we need to use padding? — depends on controller layout / mobile
      this.$store.commit("setValue", {
        key: "usePadding",
        value: el.css("position") !== "static",
      });
    });

    // Set up the observer
    observer.observe(document.getElementById("site-navigation"));
    this.observer = observer;
  },

  /**
   * Unobserve before destorying
   */
  beforeDestroy() {
    if (this.observer)
      this.observer.unobserve(document.getElementById("site-navigation"));
  },

  methods: {
    /**
     * Get the census data indicators
     */
    // async getIndicatorData(name) {
    //   // Get the data from the cache
    //   let data = this.indicatorsDataCache[name];
    //   // Pull the data if we need to
    //   if (!data) {
    //     const url = `${S3_URL}/census-data/${name}.json`;
    //     this.indicatorsDataCache[name] = await json(url);
    //   }
    // },
  },
};
</script>
