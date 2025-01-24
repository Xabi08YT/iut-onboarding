<script setup>
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import background from "../assets/bg.jpeg";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";
import {ScrollArea} from "../components/ui/scroll-area";
import {Switch} from "../components/ui/switch";
import {Input} from "../components/ui/input";

/**
 * Make a deep clone from and object
 * @param o object to clone
 * @returns {any} cloned object
 */
const deepObjectClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};

const slides = ref([
  {
    id: 0,
    name: "Test1",
    time: 10,
    active: true,
  },
  {
    id: 1,
    name: "Test2",
    time: 10,
    active: true,
  },
  {
    id: 2,
    name: "Test3",
    time: 10,
    active: true,
  },
  {
    id: 3,
    name: "Test4",
    time: 10,
    active: true,
  },
  {
    id: 4,
    name: "Test5",
    time: 10,
    active: true,
  },
  {
    id: 5,
    name: "Test6",
    time: 10,
    active: true,
  },
  {
    id: 6,
    name: "Test7",
    time: 10,
    active: true,
  },
  {
    id: 7,
    name: "Test8",
    time: 10,
    active: true,
  },
  {
    id: 8,
    name: "Test9",
    time: 10,
    active: true,
  },
  {
    id: 9,
    name: "Test10",
    time: 10,
    active: true,
  },
  {
    id: 10,
    name: "Test11",
    time: 10,
    active: true,
  },
  {
    id: 11,
    name: "Test12",
    time: 10,
    active: true,
  },
  {
    id: 12,
    name: "Test13",
    time: 10,
    active: true,
  },
  {
    id: 13,
    name: "Test14",
    time: 10,
    active: true,
  }
]);

let _tmp = deepObjectClone(slides.value);
let compareSlidesUser = ref([..._tmp]);

watch(compareSlidesUser.value, () => {
  for(let s of compareSlidesUser.value) {
    if(!JSON.stringify(slides.value).includes(JSON.stringify(s))) {
      console.log(s);
      slides.value[s.id] = deepObjectClone(s);
    }
  }
});
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
                <TableRow v-for="item in compareSlidesUser" :key="item.id">
                  <TableCell class="text-center">{{ item.name }}</TableCell>
                  <TableCell><Input type="number" v-model=item.time class="text-center" /></TableCell>
                  <TableCell class="text-center"><Switch :checked=item.active @update:checked="(value) => {
                    compareSlidesUser[item.id].active = value;
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
