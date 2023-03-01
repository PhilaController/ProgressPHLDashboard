import Vue from "vue";
import App from "@/App";
import router from "@/plugins/router";
import vClickOutside from "./directives/vClickOutside.js";
import "@/main.css";
import $ from "jquery";
import VueMq from "vue-mq";

Vue.use(VueMq, {
  breakpoints: {
    mobile: 600,
    sm: 768,
    md: 1024,
    lg: Infinity,
  },
});

// Tooltips
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

// Fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faAngleRight,
  faSquarePlus,
  faCalculator,
  faBalanceScaleLeft,
  faTint,
  faWifi,
  faHandFist,
  faHome,
  faHeartbeat,
  faProjectDiagram,
  faShieldAlt,
  faLeaf,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faAngleDown,
  faAngleUp,
  faAngleRight,
  faSquarePlus,
  faCalculator,
  faBalanceScaleLeft,
  faTint,
  faWifi,
  faHandFist,
  faHome,
  faHeartbeat,
  faProjectDiagram,
  faShieldAlt,
  faLeaf,
  faGraduationCap
);

/* add font awesome icon component */
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Set up scroll to
let VueScrollTo = require("vue-scrollto");
Vue.use(VueScrollTo);

// Don't show tip
Vue.config.productionTip = false;

// Directives
Vue.directive("click-outside", vClickOutside);

// Tooltips
Vue.use(FloatingVue);

// load and set the HTML template we are using
let content = $("#main");
content.html(`<div id="app"></div>`);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// When document is loaded --> turn off FA tracking
$(document).ready(function () {
  if (window.FontAwesome) {
    window.FontAwesome.config.observeMutations = false;
    window.FontAwesome.config.searchPseudoElements = false;
  }
});
