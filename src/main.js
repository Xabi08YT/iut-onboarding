import { createApp } from "vue";
import Onboarding from "./Onboarding/Onboarding.vue";
import Dashboard from "./AdminDashboard/Dashboard.vue";
import Setup from "./Setup/Setup.vue";
import fs from "fs";

//const SETUP_SUCCESS = fs.existsSync("./setup_success");

if (new URL(window.location.href).pathname === "/setup" ) {
  createApp(Setup).mount("#setup");
} else if(new URL(window.location.href).pathname !== "/admin" ) {
  createApp(Onboarding).mount("#app");
} else {
  createApp(Dashboard).mount("#admin");
}
