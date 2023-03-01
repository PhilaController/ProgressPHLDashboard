<template>
  <div class="tw-h-full tw-w-full">
    <!-- Map -->
    <div class="tw-relative tw-mt-6">
      <!-- Map Legend -->
      <div
        v-if="colorScale"
        class="tw-absolute tw-z-[7] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
      >
        <div class="tw-text-sm tw-font-bold tw-text-zinc-800">
          {{ selectedVariable }}
        </div>

        <div
          class="tw-mt-1 tw-flex tw-justify-between tw-text-xs tw-text-zinc-800"
        >
          <div>{{ legendLabelLeft }}</div>
          <div>{{ legendLabelRight }}</div>
        </div>
        <MapLegend
          class="tw-mt-0.5"
          :color="colorScale"
          :tickSize="8"
          :width="275"
          :height="30"
          :marginLeft="5"
          :marginRight="15"
          :marginTop="1"
          :percentage="selectedDefinition.percentage"
        />
      </div>

      <!-- No data message -->
      <div
        class="tw-absolute tw-left-0 tw-bottom-0 tw-z-[7] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
      >
        <div class="tw-flex">
          <div
            class="tw-h-[20px] tw-w-[20px] tw-rounded tw-border tw-border-zinc-800 tw-bg-[#d4d4d4]"
          ></div>
          <div class="tw-ml-2 tw-text-sm tw-font-bold tw-text-zinc-800">
            No data
          </div>
        </div>
      </div>

      <!-- Tract info -->
      <div
        class="tw-absolute tw-right-0 tw-top-0 tw-z-[7] tw-m-2 tw-rounded tw-border tw-border-zinc-800 tw-bg-stone-100 tw-p-2"
        v-if="clickedId || hoveredId"
      >
        <div class="tw-flex tw-min-w-[100px] tw-flex-col" v-if="clickedId">
          <div
            class="tw-mb-4 tw-w-fit tw-border-b tw-border-zinc-800 tw-font-bold"
          >
            Census Tract {{ clickedId }}
          </div>

          <div class="tw-italic">
            Go to:
            <router-link
              class="tw-font-bold tw-not-italic tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
              :to="{ path: '/explorer', query: { tract: clickedId } }"
              >Explorer</router-link
            >
          </div>
          <div class="tw-italic">
            Go to:
            <router-link
              class="tw-font-bold tw-not-italic tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
              :to="{ path: '/scorecard', query: { tract: clickedId } }"
              >Scorecard</router-link
            >
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
  props: [
    "data",
    "geojson",
    "aliases",
    "hierarchy",
    "definitions",
    "selectedVariable",
    "selectedDimension",
  ],
  components: { MapLegend },
  data() {
    return {
      dimensionNames: [
        "basic_human_needs",
        "foundations_of_wellbeing",
        "opportunity",
      ],

      // The hovered and clicked IDs
      hoveredId: null,
      clickedId: null,

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

      legendThresholds: 8,
    };
  },
  computed: {
    selectedDefinition() {
      let i = this.aliasedVariables.indexOf(this.selectedVariable);
      let key = this.variables[i];
      let out = this.definitions[key];
      if (out == undefined) return {};
      else return out;
    },
    legendLabelLeft() {
      let i = this.aliasedVariables.indexOf(this.selectedVariable);
      let key = this.variables[i];

      if (this.isComponent(key)) {
        return "Worse";
      } else if (!this.definitions[key].inverted) {
        return "Worse";
      } else return "Better";
    },
    legendLabelRight() {
      return this.legendLabelLeft == "Better" ? "Worse" : "Better";
    },
    variables() {
      let out = ["social_progress_index"];
      for (let i = 0; i < this.dimensionNames.length; i++) {
        let dimension = this.dimensionNames[i];
        out.push(dimension);
        for (let j = 0; j < this.hierarchy[dimension].length; j++) {
          let component = this.hierarchy[dimension][j];
          out.push(component);

          for (let k = 0; k < this.hierarchy[component].length; k++) {
            let indicator = this.hierarchy[component][k];
            out.push(indicator);
          }
        }
      }
      return out;
    },
    aliasedVariables() {
      return this.variables.map((d) => this.aliases[d]);
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

        //
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
    resetClick() {
      this.map.setFeatureState(
        { source: "census-tracts-source", id: this.clickedId },
        { click: false }
      );
      this.clickedId = null;
    },
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
          this.map.setFeatureState(
            { source: "census-tracts-source", id: id },
            { click: true }
          );
        }
      }
    },

    setClickedId(id) {},
    isComponent(name) {
      if (this.dimensionNames.includes(name)) return true;
      for (let i = 0; i < this.dimensionNames.length; i++) {
        let dim = this.dimensionNames[i];

        if (this.hierarchy[dim].includes(name)) return true;
      }
      return false;
    },
    handleVariableChange() {
      /*-------------------------------------
      Map from tract id to data being shown on the map;
      Allows for fast color setting in the map
    /* -----------------------------------*/
      let i = this.aliasedVariables.indexOf(this.selectedVariable);
      let key = this.variables[i];
      this.selectedMapData = group(this.data[key], (d) => d.geoid);

      // Determine color scheme
      let interpolator;
      if (this.selectedDimension == "basic_human_needs")
        interpolator = interpolateBlues;
      else if (this.selectedDimension == "foundations_of_wellbeing")
        interpolator = interpolateOranges;
      else interpolator = interpolateGreens;

      if (this.isComponent(key)) {
        this.colorScale = scaleSequential()
          .domain([0, 100])
          .interpolator((v) => interpolator(1 - v));
      } else {
        let f = interpolator;
        if (!this.selectedDefinition.inverted) f = (v) => interpolator(1 - v);

        // The color scale
        this.colorScale = scaleSequential()
          .domain(this.selectedDefinition.domain)
          .interpolator(f);
      }
    },

    /*-------------------------------------
      Add layers and sources to the map
    /* -----------------------------------*/
    addLayers(map) {
      /*-----------------------------------
        2. Add the city limits
      /*----------------------------------*/
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

      /*-----------------------------------
        3. Add the census tracts
      /*----------------------------------*/

      // 3A. The source
      map.addSource("census-tracts-source", {
        type: "geojson",
        data: this.geojson.tracts,
        promoteId: "geoid",
      });

      // 3B. Tract fills layer
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

      // 3C. Tract outlines layer
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

    /*-------------------------------------
      Add tooltip to the map
    /* -----------------------------------*/
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

    /*-------------------------------------
      Get the tooltip HTML content
    /* -----------------------------------*/
    getTooltipHTML(d) {
      let v;
      if (d.value == null) v = "No data";
      else v = format(".1f")(d.value);

      return `<div class="tw-rounded tw-p-0.5 tw-text-center">
    <div
      class="tw-flex tw-w-full tw-flex-col tw-items-center tw-border-b-[1px] tw-border-stone-200 tw-pb-0.5"
    >
      <div class="tw-text-base">${d.neighborhood_name} ${d.tract_id}</div>
    </div>
    <div class="tw-mx-auto tw-text-center tw-text-2xl tw-font-bold">
      ${v}
    </div>
  </div>`;
    },

    /*-------------------------------------
      Reset the hovered feature state
    /* -----------------------------------*/
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

    /*-------------------------------------
      Set the hovered feature state
    /* -----------------------------------*/
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

    /*-------------------------------------
      Based on selected map data update "color" and "value" columns
    /* -----------------------------------*/
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
