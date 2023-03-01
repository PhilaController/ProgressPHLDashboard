<template>
  <div id="app">
    <router-view
      :key="$route.path"
      :data="data"
      :metadata="metadata"
      :geojson="geojson"
      :controller-nav-height="controllerNavHeight"
      :use-padding="usePadding"
      :nav-bar-height="52"
    />
  </div>
</template>

<script>
import { queryFeatureServer } from "@/utils";
import { json } from "d3-fetch";
import $ from "jquery";

const ARCGIS_URL =
  "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services";
const S3_URL = "https://spi-dashboard-data.s3.amazonaws.com/v1/";

export default {
  name: "App",
  data() {
    return {
      /** Controller navbar height */
      controllerNavHeight: null,
      usePadding: null, // On small screens, controller nav is static, not fixed
      observer: null,

      /**
       * Main, tract-level SPI data
       */
      data: null,

      /**
       * SPI metadata dict
       */
      metadata: null,

      /**
       * Dict of geojson sources
       */
      geojson: null,

      /**
       * Config for downloading geojson layers
       */
      geojsonSourceConfig: [
        {
          name: "tracts",
          url: `${ARCGIS_URL}/SPI_Dashboard_Census_Tracts/FeatureServer/0`,
          outFields: [
            "geoid",
            "neighborhood_name",
            "puma_name",
            "tract_id",
            "missing",
          ],
        },
        {
          name: "cityLimits",
          url: `${ARCGIS_URL}/SPI_Dashboard_City_Limits/FeatureServer/0`,
        },
        {
          name: "hoods",
          url: `${ARCGIS_URL}/SPI_Dashboard_Neighborhoods/FeatureServer/0`,
          outFields: ["neighborhood_name"],
        },
        {
          name: "pumas",
          url: `${ARCGIS_URL}/SPI_Dashboard_PUMAs/FeatureServer/0`,
          outFields: ["puma_name"],
        },
      ],
    };
  },
  computed: {
    /**
     * Names of geojson sources
     */
    geojsonSourceNames() {
      return this.geojsonSourceConfig.map((d) => d.name);
    },
  },

  /**
   * Fetch the data on creation (synchronously)
   */
  created() {
    // Fetch the indicators and metadata
    json(S3_URL + "spi-data.json").then((data) => (this.data = data));
    json(S3_URL + "spi-metadata.json").then((data) => (this.metadata = data));

    // Get the geojson query promises
    let queries = [];
    for (let i = 0; i < this.geojsonSourceConfig.length; i++) {
      let config = this.geojsonSourceConfig[i];
      let promise = queryFeatureServer({
        url: config.url,
        outFields: config.outFields,
      });
      queries.push(promise);
    }

    // Save when all are resolved
    Promise.allSettled(queries).then((results) => {
      // Loop over the results and store them
      let geojson = {};
      results.forEach((result, i) => {
        geojson[this.geojsonSourceNames[i]] = result.value;
      });

      // Save it
      this.geojson = geojson;
    });
  },

  /**
   * When mounted set up observer for nav height
   */
  mounted() {
    // Track the controller.phila.gov nav height
    const observer = new ResizeObserver(() => {
      const el = $("#site-navigation");
      this.controllerNavHeight = el.outerHeight();
      this.usePadding = el.css("position") !== "static";
    });
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
};
</script>

<style>
@import "~maplibre-gl/dist/maplibre-gl.css";

.site-subheader {
  display: none !important;
}

/* Text content */
@media (min-width: 576px) {
  .text-content {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .text-content {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .text-content {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .text-content {
    max-width: 1140px;
  }
}
.text-content {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  text-align: left;
}

/* App-wide settings */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
}
/* Hide the social share */
.addthis-smartlayers {
  display: none !important;
}
/* Help message */
.help-message {
  font-weight: normal !important;
  padding-bottom: 1rem;
}

.v-popper--theme-tooltip {
  max-width: 300px !important;
}
</style>
