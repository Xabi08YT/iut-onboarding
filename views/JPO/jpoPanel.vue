<script setup>

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {ScrollArea} from "~/components/ui/scroll-area";
import {Button} from "~/components/ui/button";
import {toast} from "~/components/ui/toast";
import {deepObjectClone} from "@@/lib/utils";
import {DialogClose, DialogHeader, DialogTrigger, Dialog, DialogContent, DialogTitle, DialogDescription} from "~/components/ui/dialog";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {Textarea} from "~/components/ui/textarea";
let events = ref([]);

// Vars to store user entry for aterlier modification
let modNomEnseignant = ref("");
let modRoom = ref("");
let modDateWhen = ref("");
let modValid = ref(false);



// Vars to store user entry for aterlier creation
let createNomEnseignant = ref("");
let createRoom = ref("");
let createDateWhen = ref("");
let createValid = ref(false);



/**
 * Format a date to a readable format
 * @param date date string
 * @returns string Date in the readable format
 */
const formatDate = (date) => {
  if(date === undefined || date === null){
    return "";
  }
  let dt = date.split("T");
  dt[1] = dt[1].replace("Z", "");
  let dp = dt[0].split("-");
  let newD = `${dp[2]}/${dp[1]}/${dp[0]} `;
  let newT = dt[1].split(".")[0];
  return `${newT} ${newD}`;
};

const initCreateForm = () => {
  createNomEnseignant.value = "";
  createRoom.value = "";
  createDateWhen.value = "";

};

/**
 * Call the api to create a new conference
 * @param newConference
 * @returns {Promise<void>}
 */
const createConference = async (newConference) => {
  let res = await fetch("api/v1/jpo", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newConference)
  });
  if(res.ok) {
    toast({
      title: "Conference created successfully",
    });
    await fetch("api/v1/session", {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to create event",
      description: msg.message,
      variant: "destructive",
    });
  }};

/**
 * Fill the content related to the events
 * @returns {Promise<void>}
 */
const initEvents = async () => {
  let res = await fetch("api/v1/jpo", { method: "GET" }); 
  let data = await res.json();
  events.value = deepObjectClone(data);
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch("api/v1/session");

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }

  await initEvents();
};

watch([modRoom,modNomEnseignant,modDateWhen], () => {
  modValid.value = (modRoom.value.length > 0 && modNomEnseignant.value.length > 0 && new Date(createDateWhen.value) > 0);
});

watch([createNomEnseignant,createRoom,createDateWhen], () => {
  createValid.value = (createRoom.value.length > 0 && createNomEnseignant.value.length > 0 && new Date(createDateWhen.value) > 0);
});

init();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between">
        <div>Editeur des conférences</div>
        <Dialog>
          <DialogTrigger>
            <Button @click="initCreateForm">
              <LucideCirclePlus/>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une conférence</DialogTitle>
              <DialogDescription>Ici vous pouvez ajouter une nouvelle conférence.</DialogDescription>
            </DialogHeader>
            <Label for="titleEventModify">Salle ({{createRoom.length}}/3)</Label>
            <Input id="titleEventModify" v-model="createRoom"/>

            <Label for="descriptionEventModify">Nom Enseignant ({{createNomEnseignant.length}}/30)</Label>
            <Textarea id="descriptionEventModify" v-model="createNomEnseignant"/>

            <Label for="beginEventModify">Date</Label>
            <Input id="beginEventModify" type="datetime-local" v-model="createDateWhen" />
        
            
            <DialogClose as-child>
              <Button v-show="createValid" @click="createConference({room:createRoom, who: createNomEnseignant , when: createDateWhen})">Ajouter</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardTitle>
      <CardDescription class="text-left">Ici vous pouvez ajouter, supprimer ou éditer des conférences à afficher.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Salle</TableHead>
              <TableHead class="text-center">Nom Enseignant</TableHead>
              <TableHead class="text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in events " :key="index">
              <TableCell class="text-center">{{ item.room }}</TableCell>
              <TableCell class="text-center">{{ item.who }}</TableCell>
              <TableCell class="text-center">{{ formatDate(item.when) }}</TableCell>
              <TableCell class="text-center flex justify-center">
                <Dialog>
                  <DialogTrigger>
                    <Button @click="initModForm(item)">
                      <LucidePen/>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier une conférence</DialogTitle>
                      <DialogDescription>Ici vous pouvez editer une conférence existante. <br/> Note: Les changements doivent être appliqués.</DialogDescription>
                    </DialogHeader>
                        <Label for="titleEventModify">Room ({{createRoom.length}}/3)</Label>
                        <Input id="titleEventModify" v-model="createRoom"/>

                        <Label for="descriptionEventModify">Nom Enseignant ({{createNomEnseignant.length}}/30)</Label>
                        <Textarea id="descriptionEventModify" v-model="createNomEnseignant"/>

                        <Label for="beginEventModify">When</Label>
                        <Input id="beginEventModify" type="datetime-local" v-model="createDateWhen" />
                    <DialogClose as-child>
                      <Button v-show="modValid" @click="editEvent({id:item.id, room:createRoom, who: createNomEnseignant, when: createDateWhen})">Appliquer</Button>
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