<template>
  <div class="tw-h-full tw-w-full">
    <!-- Map -->
    <div class="tw-relative tw-mt-6">
      <!-- Map Legend -->
      <div
        v-if="colorScale"
        class="tw-absolute tw-z-[7] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
      >
        <div class="tw-text-sm tw-font-semibold tw-text-zinc-800">
          {{ selectedVariableAlias }}
        </div>

        <div
          class="tw-mt-1 tw-flex tw-justify-between tw-text-xs tw-text-zinc-800"
        >
          <div>{{ legendLabelLeft }}</div>
          <div>{{ legendLabelRight }}</div>
        </div>

        <map-legend
          class="tw-mt-0.5"
          :color="colorScale"
          :tick-size="8"
          :width="275"
          :height="30"
          :margin-left="5"
          :margin-right="15"
          :margin-top="1"
          :percentage="selectedDefinition.percentage"
          :tick-format="selectedTickFormat"
        />
      </div>

      <!-- No data message -->
      <div
        class="tw-absolute tw-left-0 tw-bottom-0 tw-z-[6] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
      >
        <div class="tw-flex">
          <div
            class="tw-h-[20px] tw-w-[20px] tw-rounded tw-border tw-border-zinc-800 tw-bg-[#d4d4d4]"
          ></div>
          <div class="tw-ml-2 tw-text-sm tw-font-semibold tw-text-zinc-800">
            No data
          </div>
        </div>
      </div>

      <!-- Tract info -->
      <div
        class="tw-absolute tw-right-0 tw-top-0 tw-z-[7] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
        v-if="clickedId || hoveredId"
      >
        <div
          class="tw-flex tw-min-w-[100px] tw-flex-col tw-items-center"
          v-if="clickedId"
        >
          <div
            class="tw-mb-4 tw-w-fit tw-border-b tw-border-zinc-800 tw-font-semibold"
          >
            {{ clickedName }}
          </div>

          <div>
            <router-link
              class="tw-font-semibold tw-not-italic tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
              :to="{ path: '/explorer', query: { tract: clickedName } }"
              >Explorer</router-link
            ><i class="fas fa-search tw-ml-1"></i>
          </div>
          <div>
            <router-link
              class="tw-font-semibold tw-not-italic tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
              :to="{ path: `/scorecards/${clickedName}` }"
              >Scorecard</router-link
            ><i class="fas fa-table tw-ml-1"></i>
          </div>
        </div>
        <div
          v-else
          class="tw-max-w-[150px] tw-text-center tw-text-sm tw-italic"
        >
          Click on the tract for more data options
        </div>
      </div>

      <!-- Map -->
      <div class="tw-h-[700px]">
        <div
          class="tw-h-full tw-w-full tw-rounded tw-border-2 tw-border-stone-200"
        >
          <div id="definitions-map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Maplibre GL JS
import maplibregl from "maplibre-gl";

// d3
import { scaleSequential } from "d3-scale";
import {
  interpolateGreens,
  interpolateBlues,
  interpolateOranges,
} from "d3-scale-chromatic";
import { format } from "d3-format";
import { group } from "d3-array";

// Local
import MapLegend from "./MapLegend";

export default {
  name: "IndicatorMap",
  props: {
    /**
     * The geojson collections
     */
    geojson: { type: Object },

    /**
     * SPI data
     */
    data: { type: Object },

    /**
     * Mapping from variable to its components
     */
    hierarchy: { type: Object, required: true },

    /**
     * Definitions for each variable
     */
    definitions: { type: Object, required: true },

    /**
     * Aliases for each variable
     */
    aliases: { type: Object, required: true },

    /**
     * Selected variable to show
     */
    selectedVariable: { type: String },

    /**
     * Selected dimension
     */
    selectedDimension: { type: String },
  },

  components: { MapLegend },
  data() {
    return {
      // The hovered and clicked IDs
      hoveredId: null,
      clickedId: null,
      clickedName: null,

      // Color scale
      colorScale: null,
      selectedMapData: null,

      // Map options
      mapOptions: {
        maxZoom: 12,
        minZoom: 10,
        zoom: 10,
        center: [-75.12, 40.0],
        maxPitch: 0,
        pitchWithRotate: false,
        dragRotate: false,
        touchPitch: false,
        attributionControl: false,
        maxBounds: [
          -75.47684326171915, 39.80088227118165, -74.82315673828148,
          40.19853877259828,
        ],
      },
    };
  },
  computed: {
    /**
     * Alias for selected variable
     */
    selectedVariableAlias() {
      return this.aliases[this.selectedVariable];
    },

    /**
     * Tick format for selected variable
     */
    selectedTickFormat() {
      if (!this.isIndicator) return ".0f";
      else {
        let fmt = this.selectedDefinition.fmt;
        if (fmt.startsWith(".2")) return ".1f";
        else return ".0f";
      }
    },

    /**
     * Is the selected variable an indicator?
     */
    isIndicator() {
      // Check dimensions
      let dimensions = this.hierarchy["social_progress_index"];
      if (dimensions.includes(this.selectedVariable)) return false;

      // Check components
      for (let i = 0; i < dimensions.length; i++) {
        let dim = dimensions[i];
        if (this.hierarchy[dim].includes(this.selectedVariable)) return false;
      }

      // It's an indicator
      return true;
    },

    /**
     * Definition for selected variable
     */
    selectedDefinition() {
      let out = this.definitions[this.selectedVariable];
      if (out == undefined) return {};
      else return out;
    },

    /**
     * Label for left part of legend
     */
    legendLabelLeft() {
      if (!this.isIndicator) {
        return "Worse";
      } else if (!this.selectedDefinition.inverted) {
        return "Worse";
      } else return "Better";
    },

    /**
     * Label for right part of legend
     */
    legendLabelRight() {
      return this.legendLabelLeft == "Better" ? "Worse" : "Better";
    },
  },
  created() {
    this.map = null; // Save non-reactive map
  },

  mounted() {
    // Get the map container
    let mapContainer = document.getElementById("definitions-map");

    //  Initialize it
    if (mapContainer !== null) {
      // Create the map
      let map = new maplibregl.Map({
        container: mapContainer,
        style: require("@/data/style-light.json"),
        ...this.mapOptions,
      });

      // When map is loaded, initialize it
      map.on("load", async () => {
        // Add layers
        this.addLayers(map);

        // Add tooltip
        this.addTooltip(map);

        // Handle a change in the selected variable
        this.handleVariableChange();

        // Update choropleth colors
        this.updateColorValues();

        // Show census tracts
        map.setLayoutProperty("tract-fills", "visibility", "visible");
        map.setLayoutProperty("tract-outlines", "visibility", "visible");

        // Loaded
        this.$emit("loaded");
      });

      // Handle hover tracking
      map.on("mousemove", "tract-fills", this.setHoverState);
      map.on("mouseleave", "tract-fills", this.resetHoverState);
      map.on("click", "tract-fills", this.handleMapClick);

      // Save the map
      this.map = map;
    }
  },
  methods: {
    /**
     * Reset the clicked id
     */
    resetClick() {
      this.map.setFeatureState(
        { source: "census-tracts-source", id: this.clickedId },
        { click: false }
      );
      this.clickedId = null;
      this.clickedName = null;
    },

    /**
     * Handle a click on the map
     */
    handleMapClick(e) {
      if (e.features.length > 0) {
        // The clicked feature
        let tract = e.features[0];
        let id = tract.id;

        // Do nothing if missing
        if (tract.properties.missing) return;

        // This tract was already clicked so reset
        if (this.clickedId == id) {
          this.resetClick();

          // Need to set a new ID
        } else {
          // Reset the old one
          if (this.clickedId !== null) {
            this.map.setFeatureState(
              { source: "census-tracts-source", id: this.clickedId },
              { click: false }
            );
          }

          // Set the new one
          this.clickedId = id;
          this.clickedName = `${tract.properties.neighborhood_name} ${+tract
            .properties.tract_id}`;
          this.map.setFeatureState(
            { source: "census-tracts-source", id: id },
            { click: true }
          );
        }
      }
    },

    /**
     * Update the map when the selected variable changes
     */
    handleVariableChange() {
      /**
       * Map from tract id to data being shown on the map;
       * Allows for fast color setting in the map
       */
      this.selectedMapData = group(
        this.data[this.selectedVariable],
        (d) => d.geoid
      );

      // Determine color scheme
      let interpolator;
      if (this.selectedDimension == "basic_human_needs")
        interpolator = interpolateBlues;
      else if (this.selectedDimension == "foundations_of_wellbeing")
        interpolator = interpolateOranges;
      else interpolator = interpolateGreens;

      // If not an indicator, it goes from 0 to 100
      if (!this.isIndicator) {
        this.colorScale = scaleSequential()
          .domain([0, 100])
          .interpolator((v) => interpolator(1 - v));
      }
      // Set the domain based on the definition
      else {
        let f = interpolator;
        if (!this.selectedDefinition.inverted) f = (v) => interpolator(1 - v);

        // The color scale
        this.colorScale = scaleSequential()
          .domain(this.selectedDefinition.domain)
          .interpolator(f);
      }
    },

    /**
     * Add layers and sources to the map
     */
    addLayers(map) {
      /**
       * Add city limits
       */
      map.addSource("city-limits-source", {
        type: "geojson",
        data: this.geojson.cityLimits,
      });
      map.addLayer({
        id: "city-limits",
        source: "city-limits-source",
        type: "line",
        paint: {
          "line-color": "#27272a",
          "line-width": 2,
        },
      });

      /**
       * Add the census tracts
       */
      map.addSource("census-tracts-source", {
        type: "geojson",
        data: this.geojson.tracts,
        promoteId: "geoid",
      });
      map.addLayer(
        {
          id: "tract-fills",
          source: "census-tracts-source",
          type: "fill",
          layout: { visibility: "none" },
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "focus"], true],
              0.7,
              0.1,
            ],
          },
        },
        "Road/label/Local"
      );
      map.addLayer(
        {
          id: "tract-outlines",
          source: "census-tracts-source",
          type: "line",
          layout: { visibility: "none" },
          paint: {
            "line-width": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              4,
              ["boolean", ["feature-state", "hover"], false],
              2,
              0.25,
            ],
            "line-color": "#27272a",
          },
        },
        "Road/label/Local"
      );
    },

    /**
     * Add tooltip to map
     */
    addTooltip(map) {
      // Add tooltip
      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20,
      });

      // Add the popup
      map.on("mousemove", "tract-fills", (e) => {
        if (e.features.length > 0) {
          let tract = e.features[0];

          // If missing, do nothing
          if (tract.properties.missing) {
            popup.remove();
            return;
          }

          // Add popup
          popup
            .setLngLat(e.lngLat)
            .setHTML(this.getTooltipHTML(tract.properties))
            .addTo(map);
        }
      });

      // Remove the popup
      map.on("mouseleave", "tract-fills", () => {
        popup.remove();
      });
    },

    /**
     * Get the tooltip HTML content
     */
    getTooltipHTML(d) {
      let v;
      let def = this.selectedDefinition;
      if (d.value == null) v = "No data";
      else if (!this.isIndicator) {
        v = `${format(".1f")(d.value)} / 100`;
      } else {
        let fmt = format(def.fmt);
        v = fmt(d.value);
        if (def.percentage) v += "%";
        else if (def.units) v += ` ${def.units}`;
      }

      return `<div class="tw-rounded tw-p-0.5 tw-text-center">
    <div
      class="tw-flex tw-w-full tw-flex-col tw-items-center tw-border-b-[1px] tw-border-stone-200 tw-pb-0.5"
    >
      <div class="tw-text-base">${d.neighborhood_name} ${d.tract_id}</div>
    </div>
    <div class="tw-mx-auto tw-text-center tw-text-2xl tw-font-semibold">
      ${v}
    </div>
  </div>`;
    },

    /**
     * Reset the hovered feature state
     */
    resetHoverState() {
      // Reset existing hovered tract
      if (this.hoveredId !== null) {
        this.map.setFeatureState(
          { source: "census-tracts-source", id: this.hoveredId },
          { hover: false }
        );
      }

      // Nothing hovered right now
      this.hoveredId = null;
    },

    /**
     * Set the hovered feature state
     */
    setHoverState(e) {
      if (e.features.length > 0) {
        // The feature
        let tract = e.features[0];

        // Reset existing hovered tract
        if (this.hoveredId !== null) {
          this.map.setFeatureState(
            { source: "census-tracts-source", id: this.hoveredId },
            { hover: false }
          );
        }

        // If missing, do nothing else
        if (tract.properties.missing) {
          return;
        }

        // Update hover state if not clicked
        if (tract.state.click !== true) {
          this.hoveredId = tract.id;
          this.map.setFeatureState(
            { source: "census-tracts-source", id: tract.id },
            { hover: true }
          );
        }
      }
    },

    /**
     * Based on selected map data update "color" and "value" columns
     */
    updateColorValues() {
      // Source data for census tracts
      let data = Object.assign({}, this.geojson.tracts);

      // Loop over each source feature
      for (let i = 0; i < data.features.length; i++) {
        // The feature
        let feature = data.features[i];

        // The value of the geoid column
        let id = feature.properties.geoid;

        // Get the value and color
        let match = this.selectedMapData.get(`${id}`);

        // If no match, we don't have data for this tract
        if (!match) {
          feature.properties["color"] = "#d4d4d4";
          feature.properties["value"] = null;

          // Get the color and value from the data
        } else {
          let value = match[0].value || 0;
          let color = this.colorScale(value);

          // Update the data
          feature.properties["color"] = color;
          feature.properties["value"] = value;
        }
      }

      // Update the map's data source
      this.map.getSource("census-tracts-source").setData(data);
    },
  },
  watch: {
    /**
     * When the variable changes, update the map
     */
    selectedVariable(newValue, oldValue) {
      if (newValue != oldValue) {
        this.handleVariableChange();
        this.$nextTick(() => {
          this.updateColorValues();
        });
      }
    },
  },
};
</script>

<style>
#definitions-map {
  width: 100%;
  height: 100%;
}
</style>
