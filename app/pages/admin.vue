<script setup>
import {Toaster} from "~/components/ui/toast";
import SlideEditor from "~~/views/admin/slideEditor.vue";
import EventEditor from "~~/views/admin/eventEditor.vue";
import UserEditor from "~~/views/admin/userEditor.vue";
import DiscordEditor from "~~/views/admin/discordEditor.vue";
import { navigateTo } from "nuxt/app";

let fullaccess = ref(false);
let redirect = false;
let bde = ref(false);

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (roles.includes("BDE")) {
    bde.value = true;
  }
  if (roles.includes("ADMIN") || roles.includes("MAINTAINER")) {
    fullaccess.value = true;
  } else if (!(roles.includes("BDE") || roles.includes("ENSEIGNANT")) && roles.includes("CULTURE")) {
    return navigateTo("/culturepanel");
  } else if (!(roles.includes("BDE") || roles.includes("ENSEIGNANT"))) {
    redirect = true;
  }

  if (redirect) {
    return navigateTo("/login");
  }
};

const goToCulture = () => {
  return navigateTo("/culturepanel");
};

init();

</script>

<template>
  <div class="flex justify-center m-2">
    <Button v-if="fullaccess" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToCulture()">Culture Panel</Button>
  </div>
  <div id="container"
       class="w-screen min-h-screen lg:h-dvh lg:max-h-dvh flex flex-col lg:flex-row p-[25px] justify-center items-center">
    <Toaster/>
    <slideEditor class="my-[25px] mx-0 min-w-1/2 min-h-[400px] lg:my-0 lg:mr-[40px] lg:w-1/2 lg:h-full" v-if="fullaccess === true" />
    <div class="flex flex-col justify-center items-center lg:w-1/2 h-full my-0 py-0" id="adminvert">
      <eventEditor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-0  lg:h-1/2 mb-[25px]" />
      <userEditor class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2" v-if="fullaccess === true" />
      <discordEditor class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2" v-if="bde === true" />
    </div>
  </div>
</template>

<style scoped>
#container {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}
</style>
