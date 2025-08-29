<script setup>
import CEventEditor from "../views/culturepanel/cEventEditor.vue";

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("/info/api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  let {roles} = await loggedIn.json();
  if (!roles.includes("ADMIN") && !roles.includes("MAINTAINER") && !roles.includes("CULTURE")) {
    return navigateTo("/login");
  }
};

init();
</script>

<template>
  <div id="culturepanel" class="w-screen h-screen flex justify-center items-center">
    <div class="w-1/2 h-[90%]">
      <c-event-editor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-full mb-[25px]  "/>
    </div>
  </div>
</template>

<style scoped>
#culturepanel {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
}
</style>
