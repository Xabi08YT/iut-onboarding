import { createApp } from "vue";
import Onboarding from "./Onboarding/Onboarding.vue";
import Dashboard from "./AdminDashboard/Dashboard.vue";

createApp(Onboarding).mount("#app");
createApp(Dashboard).mount("#admin");
