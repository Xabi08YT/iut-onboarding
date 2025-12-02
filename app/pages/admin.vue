<script setup>
import {Toaster} from "~/components/ui/toast";
import SlideEditor from "~~/views/admin/slideEditor.vue";
import EventEditor from "~~/views/admin/eventEditor.vue";
import UserEditor from "~~/views/admin/userEditor.vue";
import DiscordEditor from "~~/views/admin/discordEditor.vue";
import { navigateTo } from "nuxt/app";
import {Button} from "~/components/ui/button";
import AdminTopBar from "../components/AdminTopBar.vue";

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL.slice(0,-1);
const nuxtApp = useNuxtApp();

let fullaccess = ref(false);
let redirect = false;
let bde = ref(false);

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch(`${rootUrl}/api/v1/session`);

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (roles.includes("BDE")) {
    bde.value = true;
  }
  if (roles.includes("ADMIN") || roles.includes("MAINTAINER")) {
    admin.value = true;
  } else if (!(roles.includes("BDE") || roles.includes("ENSEIGNANT")) && roles.includes("CULTURE")) {
    nuxtApp.runWithContext(() => {
      navigateTo('/culturepanel');
    });
    return
  } else if (!(roles.includes("BDE") || roles.includes("ENSEIGNANT"))) {
    redirect = true;
  }

  if (redirect) {
    nuxtApp.runWithContext(() => {
      navigateTo('/login');
    });
  }
};

const goToCulture = () => {
  return navigateTo("/culturepanel");
};

const goToHP = () => {
  return navigateTo("/hp");
};

const goToJPO = () => {
  return navigateTo("/jpo");
};

init();

</script>

<template>
  <AdminTopBar :access="admin"/>
  <div id="container"
       class="w-screen min-h-screen lg:h-dvh lg:max-h-dvh flex flex-col lg:flex-row p-[25px] justify-center items-center">
    <Toaster/>
    <slideEditor class="my-[25px] mx-0 min-w-1/2 min-h-[400px] lg:my-0 lg:mr-[40px] lg:w-1/2 lg:h-full" v-if="admin === true" />
    <div class="flex flex-col justify-center items-center lg:w-1/2 h-full my-0 py-0" id="adminvert">
      <eventEditor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-0  lg:h-1/2 mb-[25px]" />
      <userEditor class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2" v-if="admin === true" />
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
