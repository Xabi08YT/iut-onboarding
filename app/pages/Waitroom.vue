<script setup lang="ts">
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {Button} from "../components/ui/button";
import {toast, Toaster, useToast} from "../components/ui/toast";
import { navigateTo } from "nuxt/app";
import { ref } from "vue";

let admin = ref(false);
let bde = ref(false);
let maintainer = ref(false);
let enseignant = ref(false);
let culture = ref(false);
let dde = ref(false);

const goToAdmin = () => {
  return navigateTo("/admin");
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

const init = async () => {
    let loggedIn = await fetch("api/v1/session");
    if (!loggedIn.ok) {
        console.log("issue !!!");
    }
    let {roles} = await loggedIn.json();
    if (roles.includes("ADMIN")) {
        admin.value = true;
    }
    if (roles.includes("ENSEIGNANT")) {
        enseignant.value = true;
    }
    if (roles.includes("MAINTAINER")) {
        maintainer.value = true;
    }
    if (roles.includes("BDE")) {
        bde.value = true;
    }
    if (roles.includes("CULTURE")) {
        culture.value = true;
    }
    if (roles.includes("DDE")) {
        dde.value = true;
    }
};

init();

</script>

<template>
  <div class="flex justify-center items-center gap-2 w-screen h-screen" id="choose">
    <Toaster />
    <Card>
      <CardHeader>
        <CardTitle>Choix de la page</CardTitle>
        <CardDescription>Veuillez sélectionner une page vers laquelle vous rediriger.</CardDescription>
      </CardHeader>
      <CardFooter>
        <div class="flex flex-row w-full">
          <Button v-if="admin || maintainer || enseignant || dde" class="mt-[5px] w-full space" @click="goToAdmin">Admin</Button>
          <Button v-if="admin || maintainer || culture" class="mt-[5px] w-full space" @click="goToCulture">Culture club</Button>
          <Button v-if="admin || maintainer || dde" class="mt-[5px] w-full space" @click="goToHP">Hyperplanning setup</Button>
          <Button v-if="admin || maintainer || enseignant || bde" class="mt-[5px] w-full space" @click="goToJPO">JPO setup</Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
#choose {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
  height: 100dvh;
}

.space {
  margin-right: 10px;
}
</style>
