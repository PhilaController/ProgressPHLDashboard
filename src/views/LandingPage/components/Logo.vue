<template>
  <div
    class="tw-absolute tw-right-0 tw-top-0 tw-z-[2]"
    :class="`tw-h-[${height}px] tw-w-[${width}px]`"
  ></div>
</template>

<script>
// d3
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";

// Load local data
import { cityLimits } from "../data/CityLimits.js";
import { censusTracts } from "../data/Tracts.js";

export default {
  name: "Logo",
  props: {
    /**
     * Width of the logo in pixels
     */
    width: { type: Number, default: 600 },

    /**
     * Height of the logo in pixels
     */
    height: { type: Number, default: 600 },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    /**
     * Create and draw the logo
     */
    initialize() {
      // Add the svg
      let svg = select(this.$el)
        .append("svg")
        .attr("width", this.height)
        .attr("height", this.width)
        .attr("viewBox", [-20, -20, this.width + 20, this.height + 20])
        .attr("style", "width: 100%; height: auto;");

      // Get the city limits boundary
      let CL = cityLimits.features[0];

      // Initialize the geo path
      let projection = geoMercator().fitSize([this.width, this.height], CL);
      let d = geoPath().projection(projection);

      // Add city limits background
      svg
        .selectAll()
        .data([CL])
        .enter()
        .append("path")
        .attr("d", d)
        .attr("fill", "#cfcfcf")
        .attr("fill-opacity", 0.2)
        .attr("stroke-width", 1)
        .attr("stroke", "#cfcfcf");

      // Add the tracts, colored by SPI
      svg
        .selectAll()
        .data(censusTracts.features)
        .enter()
        .append("path")
        .attr("d", d)
        .attr("fill", (d) => d.properties.color)
        .attr("fill-opacity", 0.25)
        .attr("stroke-width", 0)
        .attr("stroke", "#fca5a5");
    },
  },
};
</script>
