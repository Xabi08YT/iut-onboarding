<script setup>
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import background from "../assets/bg.jpeg";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";
import {ScrollArea} from "../components/ui/scroll-area";
import {Switch} from "../components/ui/switch";
import {Input} from "../components/ui/input";

let slides = ref([]);
let compareSlidesUser = ref([]);


/**
 * Make a deep clone from and object
 * @param o object to clone
 * @returns {any} cloned object
 */
const deepObjectClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};

/**
 * Fill the content related to the slides
 * @returns {Promise<void>}
 */
const initSlides = async () => {
  let res = await fetch("/info/api/v1/slide");
  let data = await res.json();
  slides.value = deepObjectClone(data);
  compareSlidesUser.value = [...deepObjectClone(slides.value)];
};


/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {

  await initSlides();

  watch(compareSlidesUser.value, async () => {
    for(let s of compareSlidesUser.value) {
      if(!JSON.stringify(slides.value).includes(JSON.stringify(s))) {
        slides.value[s.id - 1] = deepObjectClone(s);
        let res = await fetch("/info/api/v1/slide", {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(s)});
        console.log(res);
      }
    }
  });
};

init();

</script>

<template>
  <div id="container" class="w-screen min-h-screen lg:h-screen flex flex-col lg:flex-row p-[25px] justify-center items-center">
    <Card class="my-[25px] mx-0 min-w-1/2 min-h-[400px] lg:my-0 lg:mr-[40px] lg:w-1/2 lg:h-full">
      <CardHeader>
        <CardTitle>Slides actives</CardTitle>
        <CardDescription>Ici vous pouvez editer les slides activées et leur temps d'apparition. Les modifications sont automatiquement appliquées.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="text-center">Nom</TableHead>
                <TableHead class="text-center">Temps (s)</TableHead>
                <TableHead class="text-center">Actif</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                <TableRow v-for="item in compareSlidesUser" :key="item.id - 1">
                  <TableCell class="text-center">{{ item.name }}</TableCell>
                  <TableCell><Input type="number" v-model=item.time class="text-center" /></TableCell>
                  <TableCell class="text-center"><Switch :checked=item.active @update:checked="(value) => {
                    compareSlidesUser[item.id - 1].active = value;
                  }" /></TableCell>
                </TableRow>
              </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
    <div class="flex flex-col justify-center items-center lg:w-1/2 h-full my-0 py-0">
      <Card class="mx-0 lg:mb-[25px] min-w-full min-h-[500px] lg:min-h-0  lg:h-1/2 mb-[25px]">
        <CardHeader>
          <CardTitle>Editeur d'annonces</CardTitle>
          <CardDescription>Ici vous pouvez ajouter, supprimer ou éditer des annonces à afficher.</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
      <Card class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2">
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
