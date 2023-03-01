<template>
  <div></div>
</template>

<script>
import { select } from "d3-selection";
import { interpolateRound } from "d3-interpolate";
import { axisBottom } from "d3-axis";
import { format } from "d3-format";

function ramp(color, n = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = n;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }

  return canvas;
}

export default {
  name: "MapLegend",
  props: {
    color: { type: Function, required: true },
    tickSize: { type: Number, default: 4 },
    width: { type: Number, default: 320 },
    height: { type: Number, default: 44 },
    marginTop: { type: Number, default: 18 },
    marginRight: { type: Number, default: 15 },
    marginLeft: { type: Number, default: 10 },
    marginBottom: { type: Number, default: 16 },
    tickFormat: { type: String, default: ".0f" },
    percentage: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  computed: {
    totalHeight() {
      return this.height + this.tickSize;
    },
    totalWidth() {
      return this.width;
    },
    margin() {
      let bottom = this.marginBottom + this.tickSize;
      return {
        top: this.marginTop,
        bottom: bottom,
        left: this.marginLeft,
        right: this.marginRight,
      };
    },
  },
  mounted() {
    this.addLegend();
  },

  watch: {
    color(newValue) {
      if (newValue) {
        select(this.$el).select("svg").remove();
        this.addLegend();
      }
    },
  },

  methods: {
    addLegend() {
      let width = this.totalWidth;
      let height = this.totalHeight;
      let margin = this.margin;

      // Create the SVG
      let svg = select(this.$el)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set up the x axis
      let x = Object.assign(
        this.color
          .copy()
          .interpolator(interpolateRound(margin.left, width - margin.right)),
        {
          range() {
            return [margin.left, width - margin.right];
          },
        }
      );

      // Outline
      svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill-opacity", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // Add color image
      svg
        .append("image")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(this.color.interpolator()).toDataURL());

      // Add the ticks
      let ticks = 6;
      let tickFormat = format(this.tickFormat);
      if (this.percentage) {
        tickFormat = (d) => format(this.tickFormat)(d) + "%";
      }
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          axisBottom(x)
            .ticks(ticks)
            .tickFormat(tickFormat)
            .tickSize(this.tickSize)
        )
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick text").attr("font-size", 12));
    },
  },
};
</script>
