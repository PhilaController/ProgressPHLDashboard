<template>
  <span class="map-sparkline tw-h-[25px] tw-w-[25px] tw-pb-2"></span>
</template>

<script>
import $ from "jquery";
import { select } from "d3-selection";
import { geoMercator, geoPath } from "d3-geo";

export default {
  name: "CityLimitsSparkline",
  props: ["cityLimits", "color", "mouseover"],
  mounted() {
    let width = 100;
    let height = 100;

    var svg = select(this.$el)
      .append("svg")
      .attr("width", height)
      .attr("height", width)
      .attr("viewBox", [-20, -20, width + 20, height + 20])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");

    let CL = this.cityLimits.features[0];
    let projection = geoMercator().fitSize([width, height], CL);
    let path = geoPath().projection(projection);

    // Add the tract
    svg
      .selectAll()
      .data([CL])
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill-opacity", 0)
      .attr("stroke", this.color)
      .attr("fill", this.color)
      .attr("stroke-width", 6);
  },
  watch: {
    mouseover(newValue) {
      if (newValue) select(this.$el).selectAll("path").attr("fill-opacity", 1);
      else select(this.$el).selectAll("path").attr("fill-opacity", 0);
    },
  },
};
</script>
