import { createApp } from "vue";
import Onboarding from "./Onboarding/Onboarding.vue";
import Dashboard from "./AdminDashboard/Dashboard.vue";

if(new URL(window.location.href).pathname !== "/admin")
  createApp(Onboarding).mount("#app");
else {
  createApp(Dashboard).mount("#admin");
}
