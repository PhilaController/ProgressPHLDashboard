import Vue from "vue";
import Router from "vue-router";
import LandingPage from "@/views/LandingPage";
import AboutPage from "@/views/AboutPage";
// import Scorecard from "@/views/Scorecard";
import DataExplorer from "@/views/DataExplorer";
import DataDefinitions from "@/views/DataDefinitions";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", component: LandingPage },
    { path: "/about", component: AboutPage },
    { path: "/explorer", component: DataExplorer },
    { path: "/definitions", component: DataDefinitions },
    // {
    //   path: "/scorecard/",
    //   component: Scorecard,
    // },
  ],
  scrollBehavior(to, from) {
    if (to.path == from.path) return false;
    if (to.path != from.path) return { x: 0, y: 0 };
    if (to.query.tract && from.query.tract) return false;

    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});
