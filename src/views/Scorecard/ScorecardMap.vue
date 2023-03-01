<template>
  <div class="tw-mt-2 tw-h-[350px]">
    <div class="tw-h-full tw-w-full tw-border-4 tw-border-[#cfd3d4]">
      <div id="scorecard-map"></div>
    </div>
  </div>
</template>

<script>
import maplibregl from "maplibre-gl";
import colors from "tailwindcss/colors";

// turf
import difference from "@turf/difference";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";

export default {
  name: "ScorecardMap",
  props: [
    "tracts",
    "hoods",
    "cityLimits",
    "selectedHood",
    "selectedTract",
    "neighborhoodColor",
    "censusTractColor",
    "colorWeight",
  ],
  data() {
    return {
      // Map Options
      mapOptions: {
        maxZoom: 18,
        minZoom: 10,
        zoom: 11,
        center: [-75.15, 39.985],
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
  created() {
    this.map = null; // Save non-reactive map attribute
  },

  /*
    Initialize the map when loaded
  */
  mounted() {
    let mapContainer = document.getElementById("scorecard-map");
    if (mapContainer !== null) {
      // Iniitalize the map
      let map = new maplibregl.Map({
        container: mapContainer,
        style: require("@/data/style-light.json"),
        ...this.mapOptions,
      });

      // Track if we hovered over the map
      let hoveredTractId = null;

      // Add layers when map is loaded
      map.on("load", () => {
        // Add the layers
        this.addLayers();

        // Zoom to selected neighborhood
        this.zoomToSelectedNeighborhood();

        // Highlighted tract
        this.highlightCensusTract();
      });

      // Handle mouseover
      map.on("mousemove", "census-tract-fills", (e) => {
        if (e.features.length > 0) {
          if (hoveredTractId !== null) {
            map.setFeatureState(
              { source: "census-tract-source", id: hoveredTractId },
              { hover: false }
            );
          }
          hoveredTractId = e.features[0].id;
          if (hoveredTractId !== this.selectedTract)
            map.setFeatureState(
              { source: "census-tract-source", id: hoveredTractId },
              { hover: true }
            );
        }
      });

      // Handle mouseleave
      map.on("mouseleave", "census-tract-fills", () => {
        if (hoveredTractId !== null) {
          map.setFeatureState(
            { source: "census-tract-source", id: hoveredTractId },
            { hover: false }
          );
        }
        hoveredTractId = null;
      });

      // Handle map click
      map.on("click", "census-tract-fills", (e) => {
        if (e.features.length > 0) {
          // The clicked feature
          let f = e.features[0];

          // Emit
          this.$emit("change:tract", f.properties.tract_name);
          this.$emit("change:hood", f.properties.hood_name);

          map.setFeatureState(
            { source: "census-tract-source", id: hoveredTractId },
            { hover: false }
          );
        }
      });

      // Add the tooltip
      this.addTooltip(map);

      // Save the map
      this.map = map;
    }
  },

  methods: {
    addTooltip(map) {
      // Add tooltip
      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20,
      });

      // Add the popup
      map.on("mousemove", "census-tract-fills", (e) => {
        if (e.features.length > 0) {
          let tract = e.features[0];

          // Add popup
          popup
            .setLngLat(e.lngLat)
            .setHTML(this.getTooltipHTML(tract.properties))
            .addTo(map);
        }
      });

      // Remove the popup
      map.on("mouseleave", "census-tract-fills", () => {
        popup.remove();
      });
    },

    getTooltipHTML(d) {
      return `<div class='tw-rounded tw-p-0.5 tw-text-sm'>
            <div><span class='tw-font-bold'>Census Tract</span>: ${d.tract_name}</div>
            <div><span class='tw-font-bold'>Neighborhood</span>: ${d.hood_name}</div>
            </div>`;
    },
    /*
      Add initial layers to the map
    */
    addLayers() {
      // Calculate the mask from the max bounds and city limits
      let bbox = bboxPolygon(this.mapOptions.maxBounds);
      let mask = difference(bbox, this.cityLimits.features[0]);

      // Add source and layer
      this.map.addSource("mask-source", {
        type: "geojson",
        data: mask,
      });
      this.map.addLayer({
        id: "mask",
        source: "mask-source",
        type: "fill",
        paint: {
          "fill-color": "#f5f5f4",
          "fill-opacity": 1.0,
        },
      });

      // Add the census tract source
      this.map.addSource("census-tract-source", {
        type: "geojson",
        data: this.tracts,
        promoteId: "tract_name",
      });

      // Add census tract fills
      this.map.addLayer({
        id: "census-tract-fills",
        type: "fill",
        source: "census-tract-source",
        paint: {
          "fill-color": "#27272a",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.4,
            0,
          ],
        },
      });

      // Add census tract outlines
      this.map.addLayer({
        id: "census-tract-outlines",
        type: "line",
        source: "census-tract-source",
        paint: {
          "line-width": [
            "interpolate",
            ["exponential", 2],
            ["zoom"],
            10,
            0.5,
            17,
            3,
          ],
          "line-color": "#27272a",
        },
      });

      // Add the neighborhood source
      this.map.addSource("nta-source", {
        type: "geojson",
        data: this.hoods,
      });

      // Add neighborhood outlines
      this.map.addLayer({
        id: "nta-outlines",
        type: "line",
        source: "nta-source",
        paint: {
          "line-width": [
            "interpolate",
            ["exponential", 0.5],
            ["zoom"],
            12,
            4,
            15,
            6,
          ],
          "line-color": colors[this.neighborhoodColor][this.colorWeight],
        },
        filter: ["==", ["get", "neighborhood"], this.selectedHood],
      });
    },
    /*
      Trim features to selected neighbohood and zoom
    */
    trimToSelectedNeighborhood() {
      // Trim neighborhood layer
      this.map.setFilter("nta-outlines", [
        "==",
        ["get", "neighborhood"],
        this.selectedHood,
      ]);

      this.zoomToSelectedNeighborhood();
    },

    /*
      Zoom the map to the selected neighborhood
    */
    zoomToSelectedNeighborhood() {
      // Calculate the bbox
      let thisBbox = bbox({
        type: "FeatureCollection",
        features: this.hoods.features.filter(
          (d) => d.properties.neighborhood == this.selectedHood
        ),
      });

      // Zoom
      this.map.fitBounds(thisBbox, {
        padding: { top: 10, bottom: 10 },
      });
    },

    /*
      Highlight the selected census tract
    */
    highlightCensusTract() {
      let layerName;

      // Remove existing
      layerName = "highlighted-tract-fills";
      if (this.map.getLayer(layerName)) this.map.removeLayer(layerName);

      // Add new fills layer
      this.map.addLayer({
        id: layerName,
        type: "fill",
        source: "census-tract-source",
        paint: {
          "fill-color": colors[this.censusTractColor][this.colorWeight - 200],
          "fill-opacity": 0.5,
        },
        filter: ["==", ["get", "tract_name"], this.selectedTract],
      });

      // Remove existing
      layerName = "highlighted-tract-borders";
      if (this.map.getLayer(layerName)) this.map.removeLayer(layerName);

      // Add new border layer
      this.map.addLayer({
        id: layerName,
        type: "line",
        source: "census-tract-source",
        paint: {
          "line-width": [
            "interpolate",
            ["exponential", 0.5],
            ["zoom"],
            12,
            4,
            15,
            6,
          ],
          "line-color": colors[this.censusTractColor][this.colorWeight],
        },
        filter: ["==", ["get", "tract_name"], this.selectedTract],
      });
    },
  },

  watch: {
    /*
      When tract changes, highlight the new tract
    */
    selectedTract(newValue, oldValue) {
      if (newValue !== oldValue) this.highlightCensusTract();
    },

    /*
      When hood changes, highlight the new hood
    */
    selectedHood(newValue, oldValue) {
      if (newValue !== oldValue) this.trimToSelectedNeighborhood();
    },
  },
};
</script>

<style>
#scorecard-map {
  width: 100%;
  height: 100%;
}
</style>
