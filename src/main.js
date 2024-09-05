import { createApp } from "vue";
import Onboarding from "./Onboarding/Onboarding.vue";
import Dashboard from "./AdminDashboard/Dashboard.vue";

createApp(Onboarding).mount("#app");
let interval = setInterval(selfRefresh,30000);

let selfRefresh = async () => {
  const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
  if(currentTime === 8 * 60 + 1) {
    clearInterval(interval);
    window.location.reload();
  }
};
createApp(Dashboard).mount("#admin");
