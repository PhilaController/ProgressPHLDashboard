<template>
  <div class="tw-absolute tw-top-0 tw-right-0 tw-z-[7]">
    <div class="tw-flex tw-flex-col">
      <div class="tw-text-center tw-text-sm tw-font-semibold">
        {{ title }}
      </div>
      <svg></svg>
    </div>
  </div>
</template>

<script>
import { select } from "d3-selection";
import { format } from "d3-format";

const translation = function (x, y) {
  return `translate(${x},${y})`;
};

export default {
  props: ["radiusScale", "width", "sizes", "height", "title"],
  data() {
    return {
      chartClass: "circle-legend",
      margin: { right: 40, bottom: 0, left: 40, top: 0 },
      svg: null,
    };
  },
  mounted() {
    this.draw();
  },
  watch: {
    radiusScale(newValue) {
      if (newValue) {
        this.draw();
      }
    },
  },
  methods: {
    /**
     * Create the SVG for the chart
     */
    createPaddedSVG() {
      const margin = this.margin;

      // Create the SVG
      // Translates origin to top left
      this.svg = select(this.$el)
        .select("svg")
        .attr("class", this.chartClass)
        .attr("width", this.width)
        .attr("height", this.height);

      // Padding group
      return this.svg
        .append("g")
        .attr("class", "padding-group")
        .attr("transform", translation(margin.left, margin.top));
    },
    draw() {
      // Create the SVG if we need to
      if (!this.svg) this.createPaddedSVG();

      // Size the svg
      const margin = this.margin;
      const height = this.height - margin.top - margin.bottom;
      const width = this.width - margin.left - margin.right;

      // Set the size attributes
      const svg = this.svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select(".padding-group");

      // The radius scale
      let radiusScale = this.radiusScale;

      const getXOffset = function (i) {
        return 25;
      };

      // add circles
      let cx = 0;
      svg
        .selectAll("circle")
        .data(this.sizes)
        .join("circle")
        .attr("r", (d) => radiusScale(d))
        .attr("cy", (d) => height / 2 - radiusScale(d))
        .attr("cx", (d, i) => {
          let out = cx + radiusScale(d) + getXOffset(i);
          cx = out + radiusScale(d);
          return out;
        })
        .style("fill", "#a3a3a3")
        .style("stroke", "#262626")
        .attr("stroke-width", 1.5);

      // add labels
      cx = 0;
      svg
        .selectAll("text")
        .data(this.sizes)
        .enter()
        .append("text")
        .text((d) => `${format(".0f")(d * 100)}%`)
        .attr("fill", "#2c3e50")
        .attr("opacity", "0.6")
        .attr("font-size", "0.8rem")
        .attr("font-family", "sans-serif")
        .attr("x", (d, i) => {
          let out = cx + radiusScale(d) + getXOffset(i);
          cx = out + radiusScale(d);
          return out;
        })
        .attr("y", height / 2)
        .attr("dy", "1rem")
        .attr("dx", "0.25rem")
        .attr("text-anchor", "middle");
    },
  },
};
</script>

<style>
.radius-label {
  font: italic 13px sans-serif;
}
</style>
