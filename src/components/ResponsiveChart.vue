<script>
import { select } from "d3-selection";
import $ from "jquery";

const translation = function (x, y) {
  return `translate(${x},${y})`;
};

export default {
  name: "ResponsiveChart",
  data() {
    return {
      /**
       * The svg element
       */
      svg: null,

      /**
       * Track width of parent
       */
      parentWidth: null,
      observer: null,
    };
  },
  mounted() {
    // Track width of parent
    const observer = new ResizeObserver(() => {
      const el = $(this.$el.parentElement);
      this.parentWidth = el.width();
    });
    observer.observe(this.$el.parentElement);
    this.observer = observer;
  },

  computed: {
    /** Width of the chart */
    width() {
      if (this.parentWidth) {
        if (!this.maxWidth) return this.parentWidth;
        else return Math.min(this.parentWidth, this.maxWidth);
      }
    },
  },
  watch: {
    width(newValue, oldValue) {
      // Remove existing and then update
      if (this.svg) {
        this.svg.select(".padding-group").selectAll("*").remove();
        this.setupChart();
      }
      this.updateChart();
    },
  },

  methods: {
    /**
     * Do nothing by default
     */
    setupChart() {},

    /**
     * Create the SVG for the chart
     */
    createPaddedSVG() {
      const margin = this.margin;

      // Create the SVG
      // Translates origin to top left
      this.svg = select(this.$el)
        .append("svg")
        .attr("class", this.chartClass)
        .attr("width", this.width)
        .attr("height", this.height);

      // Padding group
      return this.svg
        .append("g")
        .attr("class", "padding-group")
        .attr("transform", translation(margin.left, margin.top));
    },
  },
};
</script>
