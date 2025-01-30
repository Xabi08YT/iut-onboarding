<script setup>
import {Toaster} from "../components/ui/toast";
import SlideEditor from "../views/admin/slideEditor.vue";
import EventEditor from "../views/admin/eventEditor.vue";
import UserEditor from "../views/admin/userEditor.vue";

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("/info/api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
};

init();

</script>

<template>
  <div id="container"
       class="w-screen min-h-screen lg:h-screen lg:max-h-screen flex flex-col lg:flex-row p-[25px] justify-center items-center">
    <Toaster/>
    <slideEditor class="my-[25px] mx-0 min-w-1/2 min-h-[400px] lg:my-0 lg:mr-[40px] lg:w-1/2 lg:h-full" />
    <div class="flex flex-col justify-center items-center lg:w-1/2 h-full my-0 py-0">
      <eventEditor class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-0  lg:h-1/2 mb-[25px]" />
      <userEditor class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2" />
    </div>
  </div>
</template>

<style scoped>
#container {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
}
</style>
