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

const runtimeConfig = useRuntimeConfig();
const requestURL = useRequestURL();
const rootUrl = requestURL.origin + runtimeConfig.app.baseURL.slice(0,-1);

let conferences = ref([]);
let ateliers = ref([]);
let dateJpo = ref("");
let videoJpo = ref("");

let getDateJpo = () => {
  fetch(`${rootUrl}/api/v1/dateJpo`, { method: "GET" }).then(async (res) => dateJpo.value = await res.text())
};

getDateJpo();

let applyDateJpo = async () => {
  let res = await fetch(`${rootUrl}/api/v1/dateJpo`, {method: "PUT", body: JSON.stringify({value: dateJpo.value})});
  getDateJpo();
  if (res.ok) {
    toast({title: "Date mis à jour avec succès"});
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    toast({title: "Une erreur est survenue.",
      description:await res.json().then(data => data.message),
      variant:"destructive"});
  }

};

let getvideJpo = () => {
  fetch(`${rootUrl}/api/v1/videoJpo`, { method: "GET" }).then(async (res) => videoJpo.value = await res.text())
};

getvideJpo();

let applyvideoJpo = async () => {
  let res = await fetch(`${rootUrl}/api/v1/videoJpo`, {method: "PUT", body: JSON.stringify({value: videoJpo.value})});
  getDateJpo();
  if (res.ok) {
    toast({title: "Date mis à jour avec succès"});
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    toast({title: "Une erreur est survenue.",
      description:await res.json().then(data => data.message),
      variant:"destructive"});
  }

};



// Vars to store user entry for conference modification
let modNomEnseignant = ref("");
let modRoom = ref("");
let modDateWhen = ref("");
let modValid = ref(false);

// Vars to store user entry for conference creation
let createNomEnseignant = ref("");
let createRoom = ref("");
let createDateWhen = ref("");
let createValid = ref(false);

// Vars to store user entry for aterlier modification
let modNameA = ref("");
let modRoomA = ref("");
let modDateWhenAStart = ref("");
let modDateWhenAEnd = ref("");
let modValidA = ref(false);

// Vars to store user entry for aterlier creation
let createNameA = ref("");
let createRoomA = ref("");
let createDateWhenAStart = ref("");
let createDateWhenAEnd = ref("");
let createValidA = ref(false);



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

const initModForm = (item) => {
  modNomEnseignant.value = item.who;
  modRoom.value = item.room;
  modDateWhen.value = item.when.slice(0,-3);
};

/**
 * Call the api to create a new conference
 * @param newConference
 * @returns {Promise<void>}
 */
const createConference = async (newConference) => {
  let res = await fetch(`${rootUrl}/api/v1/conference`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newConference)
  });
  if(res.ok) {
    toast({
      title: "Conference created successfully",
    });
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to create event",
      description: msg.message,
      variant: "destructive",
    });
  }};

/**
 * Fill the content related to the conférences
 * @returns {Promise<void>}
 */
const initConferences = async () => {
  let res = await fetch(`${rootUrl}/api/v1/conference`, { method: "GET" });
  let data = await res.json();
  conferences.value = data.content;
};

const editConference = async (modifiedEvent) => {
  let res = await fetch(`${rootUrl}/api/v1/conference`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(modifiedEvent)
  });
  if(res.ok) {
    toast({
      title: "Conference modified successfully",
    });
    await initConferences();
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to modify event",
      description: msg.message,
      variant: "destructive",
    });
  }
};

const deleteConference = async (id) => {
  let res = await fetch(`${rootUrl}/api/v1/conference`, {
    method: "DELETE",
    body: JSON.stringify(id)
  });
  if(res.ok) {
    toast({
      title: "Conference deleted successfully",
    });
    await initConferences();
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to delete event",
      description: msg.message,
      variant: "destructive",
    });
  }
};

const initCreateFormAtelier = () => {
  createNameA.value = "";
  createRoomA.value = "";
  createDateWhenAStart.value = "";
  createDateWhenAEnd.value = "";

};

const initModFormAtelier = (item) => {
  modNameA.value = item.name;
  modRoomA.value = item.room;
  modDateWhenAStart.value = item.start.slice(0,-3);
  modDateWhenAEnd.value = item.end.slice(0,-3);
};

/**
 * Call the api to create a new atelier
 * @param newAtelier
 * @returns {Promise<void>}
 */
const createAtelier = async (newAtelier) => {
  let res = await fetch(`${rootUrl}/api/v1/atelier`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newAtelier)
  });
  if(res.ok) {
    toast({
      title: "Atelier created successfully",
    });
    await fetch(`${rootUrl}/api/v1/session`, {method: "PUT"});
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to create atelier",
      description: msg.message,
      variant: "destructive",
    });
  }};

/**
 * Fill the content related to the ateliers
 * @returns {Promise<void>}
 */
const initAtelier = async () => {
  let res = await fetch(`${rootUrl}/api/v1/atelier`, { method: "GET" });
  let data = await res.json();
  ateliers.value = data.content;
};

const editAtelier = async (modifiedAtelier) => {
  let res = await fetch(`${rootUrl}/api/v1/atelier`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(modifiedAtelier)
  });
  if(res.ok) {
    toast({
      title: "Atelier modified successfully",
    });
    await initAtelier();
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to modify Atelier",
      description: msg.message,
      variant: "destructive",
    });
  }
};

const deleteAtelier = async (id) => {
  let res = await fetch(`${rootUrl}/api/v1/atelier`, {
    method: "DELETE",
    body: JSON.stringify(id)
  });
  if(res.ok) {
    toast({
      title: "Atelier deleted successfully",
    });
    await initAtelier();
  } else {
    let msg = await res.json();
    toast({
      title: "Failed to delete atelier",
      description: msg.message,
      variant: "destructive",
    });
  }
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  let loggedIn = await fetch(`${rootUrl}/api/v1/session`);

  if (!loggedIn.ok) {
    return navigateTo("/login");
  }
  await initAtelier();
  await initConferences();
};

watch([modRoom,modNomEnseignant,modDateWhen], () => {
  modValid.value = (modRoom.value.length > 0 && modNomEnseignant.value.length > 0 && new Date(modDateWhen.value) > 0);
});

watch([createNomEnseignant,createRoom,createDateWhen], () => {
  createValid.value = (createRoom.value.length > 0 && createNomEnseignant.value.length > 0 && new Date(createDateWhen.value) > 0);
});

watch([modRoomA, modNameA, modDateWhenAStart, modDateWhenAEnd], () => {
  modValidA.value = (modRoomA.value.length > 0 && modNameA.value.length > 0 &&
      new Date(modDateWhenAStart.value) > 0 && new Date(modDateWhenAEnd.value) > 0);
});

watch([createRoomA, createNameA, createDateWhenAStart, createDateWhenAEnd], () => {
  createValidA.value = (createRoomA.value.length > 0 && createNameA.value.length > 0 &&
      new Date(createDateWhenAStart.value) > 0 && new Date(createDateWhenAEnd.value) > 0);
});

init();
</script>

<template >
  <div class="grid gap-y-4">
    <Card class="flex flex-col">
      <Toaster />
      <CardHeader>
        <CardTitle>Editer la date de la JPO</CardTitle>
        <CardDescription>Ici vous pouvez editer la date de la JPO.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input name="JPO" type="date" v-model="dateJpo" class="w-full" />
        <Button @click="applyDateJpo()" class="w-full mt-[10px]">Enregistrer</Button>
      </CardContent>
    </Card>
    <Card class="flex flex-col">
      <Toaster />
      <CardHeader>
        <CardTitle>Editer le lien de la video de la jpo</CardTitle>
        <CardDescription>Ici vous pouvez editer le lien de la vidéo de la JPO.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input name="JPO" type="text" v-model="videoJpo" class="w-full" />
        <Button @click="applyvideoJpo()" class="w-full mt-[10px]">Enregistrer</Button>
      </CardContent>
    </Card>
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
                <Button v-show="createValid" @click="createConference({room:createRoom, who: createNomEnseignant , when: createDateWhen.toString()})">Ajouter</Button>
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
              <TableRow v-for="(item, index) in conferences " :key="index">
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
                      <Label for="titleEventModify">Room ({{modRoom.length}}/3)</Label>
                      <Input id="titleEventModify" v-model="modRoom"/>

                      <Label for="descriptionEventModify">Nom Enseignant ({{modNomEnseignant.length}}/30)</Label>
                      <Textarea id="descriptionEventModify" v-model="modNomEnseignant"/>

                      <Label for="beginEventModify">When</Label>
                      <Input id="beginEventModify" type="datetime-local" v-model="modDateWhen" />
                      <DialogClose as-child>
                        <Button v-show="modValid" @click="editConference({id:item.id, room:modRoom, who: modNomEnseignant, when: modDateWhen})">Appliquer</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" @click=deleteConference(item.id)>
                    <LucideTrash2/>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>





    <Card class="w-full">
      <CardHeader>
        <CardTitle class="flex justify-between">
          <div>Editeur d'ateliers</div>
          <Dialog>
            <DialogTrigger>
              <Button @click="initCreateFormAtelier">
                <LucideCirclePlus/>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un atelier</DialogTitle>
                <DialogDescription>Ici vous pouvez ajouter un nouvel atelier.</DialogDescription>
              </DialogHeader>
              <Label for="titleEventModify">Salle ({{createRoomA.length}}/3)</Label>
              <Input id="titleEventModify" v-model="createRoomA"/>

              <Label for="descriptionEventModify">Nom de l'atelier ({{createNameA.length}}/30)</Label>
              <Textarea id="descriptionEventModify" v-model="createNameA"/>

              <Label for="beginEventModify">Date Debut</Label>
              <Input id="beginEventModify" type="datetime-local" v-model="createDateWhenAStart" />

              <Label for="beginEventModify">Date FIN</Label>
              <Input id="beginEventModify" type="datetime-local" v-model="createDateWhenAEnd" />


              <DialogClose as-child>
                <Button v-show="createValidA" @click="createAtelier({room:createRoomA, name: createNameA , start: createDateWhenAStart, end:createDateWhenAEnd})">Ajouter</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription class="text-left">Ici vous pouvez ajouter, supprimer ou éditer des ateliers à afficher.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="text-center">Salle</TableHead>
                <TableHead class="text-center">Nom de l'atelier</TableHead>
                <TableHead class="text-center">Date Debut</TableHead>
                <TableHead class="text-center">Date Fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(item, index) in ateliers " :key="index">
                <TableCell class="text-center">{{ item.room }}</TableCell>
                <TableCell class="text-center">{{ item.name }}</TableCell>
                <TableCell class="text-center">{{ formatDate(item.start) }}</TableCell>
                <TableCell class="text-center">{{ formatDate(item.end) }}</TableCell>
                <TableCell class="text-center flex justify-center">
                  <Dialog>
                    <DialogTrigger>
                      <Button @click="initModFormAtelier(item)">
                        <LucidePen/>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier un atelier</DialogTitle>
                        <DialogDescription>Ici vous pouvez editer un atelier existant. <br/> Note: Les changements doivent être appliqués.</DialogDescription>
                      </DialogHeader>
                      <Label for="titleEventModify">Room ({{modRoomA.length}}/3)</Label>
                      <Input id="titleEventModify" v-model="modRoomA"/>

                      <Label for="descriptionEventModify">Nom de l'atelier ({{modNameA.length}}/30)</Label>
                      <Textarea id="descriptionEventModify" v-model="modNameA"/>

                      <Label for="beginEventModify">Date et heure d'ouverture</Label>
                      <Input id="beginEventModify" type="datetime-local" v-model="modDateWhenAStart" />

                      <Label for="beginEventModify">Date et heure de fermeture</Label>
                      <Input id="beginEventModify" type="datetime-local" v-model="modDateWhenAEnd" />

                      <DialogClose as-child>
                        <Button v-show="modValidA" @click="editAtelier({id:item.id, room:modRoomA, name: modNameA, start: modDateWhenAStart, end:modDateWhenAEnd})">Appliquer</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" @click=deleteAtelier(item.id)>
                    <LucideTrash2/>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>

</style>