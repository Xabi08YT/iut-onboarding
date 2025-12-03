<script setup lang="ts">

import { ref, watch } from "vue";
import { navigateTo, useRequestURL, useRuntimeConfig } from "nuxt/app";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../app/components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../app/components/ui/card";
import {ScrollArea} from "../../app/components/ui/scroll-area";
import {Button} from "../../app/components/ui/button";
import {toast} from "../../app/components/ui/toast";
import {DialogClose, DialogHeader, DialogTrigger, Dialog, DialogContent, DialogTitle, DialogDescription} from "../../app/components/ui/dialog";
import {Input} from "../../app/components/ui/input";
import {Label} from "../../app/components/ui/label";
import {Textarea} from "../../app/components/ui/textarea";
import { deepObjectClone } from "../../lib/utils";

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL.slice(0,-1);

let events = ref([]);

// Vars to store user entry for event modification
let modTitle = ref("");
let modDescription = ref("");
let modDateBeg = ref("");
let modDateEnd = ref("");
let modIMGURL = ref("");
let modValid = ref(false);

// Vars to store user entry for event creation
let createTitle = ref("");
let createDescription = ref("");
let createDateBeg = ref("");
let createDateEnd = ref("");
let createIMGURL = ref("");
let createValid = ref(false);

const channels = ["Etudiant", "Enseignants", "DDE", "Département"];

/**
 * Format a date to a readable format
 * @param date date string
 * @returns string Date in the readable format
 */
const formatDate = (date): string => {
  let dt = date.split("T");
  dt[1] = dt[1].replace("Z", "");
  let dp = dt[0].split("-");
  let newD = `${dp[2]}/${dp[1]}/${dp[0]} `;
  let newT = dt[1].split(".")[0];
  return `${newT} ${newD}`;
};

/**
 * Fill the content related to the events
 * @returns {Promise<void>}
 */
const initEvents = async () => {
  let res = await fetch(`${rootUrl}/api/v1/event`);
  let data = await res.json();
  events.value = deepObjectClone(data);
};

/**
 * Call the api to delete the event with the furnished id
 * @param id
 * @returns {Promise<void>}
 */
const deleteEvent = async (id) => {
  let res = await fetch(`${rootUrl}/api/v1/event`, {
    method: "DELETE",
    body: JSON.stringify(id)
  });
  if(res.ok) {
    toast({
      title: "Event deleted successfully",
    });
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to delete event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

const initModForm = (item) => {
  modTitle.value = item.title;
  modDescription.value = item.description;
  modDateBeg.value = item.startTS.slice(0,-3);
  modDateEnd.value = item.endTS.slice(0,-3);
  modIMGURL.value = item.image;
};

const initCreateForm = () => {
  createTitle.value = "";
  createDescription.value = "";
  createDateBeg.value = "";
  createIMGURL.value = "";
  createDateEnd.value = "";
};

/**
 * Call the api to modify the event and replace it with the furnished object
 * @param modified
 * @returns {Promise<void>}
 */
const editEvent = async (modified) => {
  let res = await fetch(`${rootUrl}/api/v1/event`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(modified)
  });
  if(res.ok) {
    toast({
      title: "Event Modified successfully",
    });
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to modify event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

/**
 * Call the api to create a new event
 * @param newEvent
 * @returns {Promise<void>}
 */
const addEvent = async (newEvent) => {
  let res = await fetch(`${rootUrl}/api/v1/event`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newEvent)
  });
  if(res.ok) {
    toast({
      title: "Event created successfully",
    });
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to create event",
      description: msg.message,
      variant: "destructive",
    });
  }

  await initEvents();
};

watch([modTitle,modDescription,modDateEnd,modDateBeg], () => {
  modValid.value = (
    new Date(modDateBeg.value) < new Date(modDateEnd.value) &&
    modTitle.value.length > 0 &&
    modTitle.value.length < 101 &&
    modDescription.value.length > 0 &&
    modDescription.value.length < 201
  );
});

watch([createTitle,createDescription,createDateEnd,createDateBeg], () => {
  createValid.value = (
    new Date(createDateBeg.value) < new Date(createDateEnd.value) &&
    createTitle.value.length > 0 &&
    createTitle.value.length < 101 &&
    createDescription.value.length > 0 &&
    createDescription.value.length < 201
  );
});

initEvents();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between">
        <div>Editeur d'annonces</div>
        <Dialog>
          <DialogTrigger>
            <Button @click="initCreateForm">
              <LucideCirclePlus/>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une annonce</DialogTitle>
              <DialogDescription>Ici vous pouvez ajouter une nouvelle annonce.</DialogDescription>
            </DialogHeader>
            <Label for="titleEventModify">Titre ({{createTitle.length}}/100)</Label>
            <Input id="titleEventModify" v-model="createTitle"/>
            <Label for="descriptionEventModify">Description ({{createDescription.length}}/200)</Label>
            <Textarea id="descriptionEventModify" v-model="createDescription"/>
            <Label for="beginEventModify">Date de début de l'affichage</Label>
            <Input id="beginEventModify" type="datetime-local" v-model="createDateBeg" />
            <Label for="endEventModify">Date de fin de l'affichage</Label>
            <Input id="endEventModify" type="datetime-local" v-model="createDateEnd" />
            <Label for="imageURLEventCreate">URL d'une image (Hébergée sur IMGUR par exemple)</Label>
            <Input id="imageURLEventCreate" type="text" v-model="createIMGURL"/>
            <DialogClose as-child>
              <Button v-show="createValid" @click="addEvent({title:createTitle, description: createDescription, startTS: createDateBeg, endTS: createDateEnd, image: createIMGURL.valueOf(), channel: 1})">Ajouter</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardTitle>
      <CardDescription class="text-left">Ici vous pouvez ajouter, supprimer ou éditer des annonces à afficher.
      </CardDescription>
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
            <TableRow v-for="(item, index) in events " :key="index">
              <TableCell class="text-center">{{ item.title }}</TableCell>
              <TableCell class="text-center">{{ formatDate(item.startTS) }}</TableCell>
              <TableCell class="text-center">{{ formatDate(item.endTS) }}</TableCell>
              <TableCell class="text-center">{{ channels[item.channel] }}</TableCell>
              <TableCell class="text-center flex justify-center">
                <Dialog>
                  <DialogTrigger>
                    <Button @click="initModForm(item)">
                      <LucidePen/>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier une annonce</DialogTitle>
                      <DialogDescription>Ici vous pouvez editer une annonce existante. <br/> Note: Les changements doivent être appliqués.</DialogDescription>
                    </DialogHeader>
                    <Label for="titleEventModify">Titre ({{modTitle.length}}/100)</Label>
                    <Input id="titleEventModify" v-model="modTitle"/>
                    <Label for="descriptionEventModify">Description ({{modDescription.length}}/200)</Label>
                    <Textarea id="descriptionEventModify" v-model="modDescription"/>
                    <Label for="beginEventModify">Date de début de l'affichage</Label>
                    <Input id="beginEventModify" type="datetime-local" v-model="modDateBeg"/>
                    <Label for="endEventModify">Date de fin de l'affichage</Label>
                    <Input id="endEventModify" type="datetime-local" v-model="modDateEnd"/>
                    <Label for="imageURLEventModify">URL d'une image (Hébergée sur IMGUR par exemple)</Label>
                    <Input id="imageURLEventModify" type="text" v-model="modIMGURL"/>
                    <DialogClose as-child>
                      <Button v-show="modValid" @click="editEvent({id:item.id, title:modTitle, description: modDescription, startts: modDateBeg, endts: modDateEnd, image: modIMGURL.valueOf(), channel: 1})">Appliquer</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" @click=deleteEvent(item.id)>
                  <LucideTrash2/>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
