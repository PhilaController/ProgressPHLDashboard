import Vue from "vue";
import Router from "vue-router";

// Pages
import LandingPage from "@/views/LandingPage";
import AboutPage from "@/views/AboutPage";
import ScorecardSummary from "@/views/Scorecards/SummaryPage";

import ScorecardComparison from "@/views/Scorecards/ComparisonPage";
import DataExplorer from "@/views/DataExplorer";
import DataDefinitions from "@/views/DataDefinitions";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", component: LandingPage },
    { path: "/about", component: AboutPage },
    { path: "/explorer", component: DataExplorer },
    { path: "/definitions", component: DataDefinitions },
    {
      path: "/scorecards/",
      component: ScorecardSummary,
    },
    {
      path: "/scorecards/:tract1/:tract2",
      component: ScorecardComparison,
    },
    {
      path: "/scorecards/:tract1",
      component: ScorecardComparison,
    },
  ],
});
