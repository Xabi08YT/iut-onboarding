<script setup>
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";
import {ScrollArea} from "../components/ui/scroll-area";
import {Switch} from "../components/ui/switch";
import {Input} from "../components/ui/input";
import {toast, Toaster} from "../components/ui/toast";
import {Button} from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'


let slides = ref([]);
let events = ref([]);
let users = ref([]);
let compareSlidesUser = ref([]);
let compareEvents = ref([]);
let compareUser = ref([]);
const channels = ["Etudiant","Enseignants","DDE","Département"];

/**
 * Make a deep clone from and object
 * @param o object to clone
 * @returns {any} cloned object
 */
const deepObjectClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};

/**
 * Format a date to a readable format
 * @param date date
 * @returns string Date in the readable format
 */
const formatDate = (date) => {
  return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
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

const initEvents = async () => {
  let res = await fetch("/info/api/v1/event");
  let data = await res.json();
  console.log(data);
  events.value = deepObjectClone(data);
  compareEvents.value = [...deepObjectClone(events.value)];
};

const initUsers = async () => {
  let res = await fetch("/info/api/v1/user");
  let data = await res.json();
  users.value = deepObjectClone(data);
  compareUser.value = [...deepObjectClone(users.value)];
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn =  await fetch("/info/api/v1/session");

  if(!loggedIn.ok) {
    return navigateTo("/login");
  }

  await initSlides();
  await initEvents();
  await initUsers();

  watch(compareSlidesUser.value, async () => {
    console.log("Change detected");
    for(let s of compareSlidesUser.value) {
      if(!JSON.stringify(slides.value).includes(JSON.stringify(s))) {
        slides.value[s.id - 1] = deepObjectClone(s);
        let res = await fetch("/info/api/v1/slide", {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(s)});
        if(res.ok) {
          toast({
            title: "Slide updated successfully",
          });
        } else {
          toast({
            title: "Slide was not updated",
            description: (await res.json()).message,
            variant: "destructive",
          });
        }
      }
    }
  });
};

init();

</script>

<template>
  <div id="container" class="w-screen min-h-screen lg:h-screen lg:max-h-screen flex flex-col lg:flex-row p-[25px] justify-center items-center">
    <Toaster />
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
                <TableRow v-for="(item, index) in compareSlidesUser " :key="index" >
                  <TableCell class="text-center">{{ item.name }}</TableCell>
                  <TableCell><Input type="number" v-model=item.time class="text-center min-w-[75px]" /></TableCell>
                  <TableCell class="text-center"><Switch :checked=item.active @update:checked="(value) => {
                    compareSlidesUser[index].active = value;
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
          <CardTitle class="flex justify-between"><div>Editeur d'annonces</div> <Button><LucideCirclePlus /></Button></CardTitle>
          <CardDescription>Ici vous pouvez ajouter, supprimer ou éditer des annonces à afficher.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-center">Titre</TableHead>
                  <TableHead class="text-center">Diffusé du</TableHead>
                  <TableHead class="text-center">Au</TableHead>
                  <TableHead class="text-center">Sur le canal</TableHead>
                  <TableHead class="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in compareEvents " :key="index" >
                  <TableCell class="text-center">{{ item.title }}</TableCell>
                  <TableCell class="text-center">{{ formatDate(new Date(item.startTS)) }}</TableCell>
                  <TableCell class="text-center">{{ formatDate(new Date(item.endTS)) }}</TableCell>
                  <TableCell class="text-center">{{ channels[item.channel] }}</TableCell>
                  <TableCell class="text-center"><Button><LucidePen /></Button> <Button class="bg-red-500"><LucideTrash2 /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card class="mx-0 min-w-full min-h-[500px] lg:min-h-0 lg:h-1/2">
        <CardHeader>
          <CardTitle class="flex justify-between"><div>Administration des utilisateurs</div> <Button><LucideCirclePlus /></Button></CardTitle>
          <CardDescription>Ici vous ajouter, editer et supprimer des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-center">Nom d'utilisateur</TableHead>
                  <TableHead class="text-center">Role</TableHead>
                  <TableHead class="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in compareUser " :key="index" >
                  <TableCell class="text-center">{{ item.username }}</TableCell>
                  <TableCell class="text-center">{{item.role.toString()}}</TableCell>
                  <TableCell class="text-center block max-w-[50px]"><Button><LucidePen /></Button> <Button class="bg-red-500"><LucideTrash2 /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
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
