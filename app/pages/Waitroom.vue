<script setup lang="ts">
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {Button} from "../components/ui/button";
import {toast, Toaster, useToast} from "../components/ui/toast";
import { navigateTo } from "nuxt/app";

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

</script>

<template>
  <div class="flex justify-center items-center gap-2 w-screen h-screen" id="choose">
    <Toaster />
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Choix de la page</CardTitle>
        <CardDescription>Veuillez sélectionner une page vers laquelle vous rediriger.</CardDescription>
      </CardHeader>
      <CardFooter>
        <div class="flex flex-row w-full">
          <Button class="mt-[5px] w-full space" @click="goToAdmin">Admin</Button>
          <Button class="mt-[5px] w-full space" @click="goToCulture">Culture club</Button>
          <Button class="mt-[5px] w-full" @click="goToHP">Hyperplanning setup</Button>
          <Button class="mt-[5px] w-full" @click="goToJPO">JPO setup</Button>
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
