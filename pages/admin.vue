<script setup>
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
</script>

<template>
  <div id="container" class="w-screen h-screen flex p-[25px] justify-center items-center">
    <Card class="mr-[25px] w-1/2 h-full">
      <CardHeader>
        <CardTitle>Slides actives</CardTitle>
        <CardDescription>Ici vous pouvez editer les slides activées et leur temps d'apparition.</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
    <div class="h-full flex flex-col justify-center items-center w-1/2">
      <Card class="mb-[25px] h-[50%] w-full">
        <CardHeader>
          <CardTitle>Editeur d'annonces</CardTitle>
          <CardDescription>Ici vous pouvez ajouter, supprimer ou éditer des annonces à afficher.</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
      <Card class="h-[50%] w-full">
        <CardHeader>
          <CardTitle>Administration des utilisateurs</CardTitle>
          <CardDescription>Ici vous ajouter, editer et supprimer des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
#container {
  background-image: url("/assets/bg.jpeg");
  background-size: cover;
}
</style>