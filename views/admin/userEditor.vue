<script setup>

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {ScrollArea} from "~/components/ui/scroll-area";
import {Button} from "~/components/ui/button";
import {deepObjectClone} from "@@/lib/utils";
import {toast} from "~/components/ui/toast";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {DialogClose, DialogHeader, DialogTrigger, Dialog, DialogContent, DialogTitle, DialogDescription} from "~/components/ui/dialog";

let users = ref([]);

// Vars to store user entry for account creation
let cUsername = ref("");
let cPassword = ref("");
let cPasswordConfirm = ref("");
let cRoles = ref([""]);
let cValid = ref(false);

// Vars to store user entry for account modification
let mUsername = ref("");
let mPassword = ref("");
let mPasswordConfirm = ref("");
let mRoles = ref([""]);
let mValid = ref(false);

/**
 * Fill the content related to the users
 * @returns {Promise<void>}
 */
const initUsers = async () => {
  let res = await fetch("api/v1/user");
  let data = await res.json();
  users.value = deepObjectClone(data);
};

/**
 * Create a new user from the passed JSON
 * @param user
 * @returns {Promise<void>}
 */
const createUser = async (user) => {
  let res = await fetch("api/v1/user", {
    method: "POST",
    body: JSON.stringify(user),
  });
  if(res.ok) {
    toast({
      title: "User created successfully",
    });
    await fetch("api/v1/session", {method: "PUT"});
  } else {
    toast({
      title: "Unable to create user",
      description: await res.json().then(data => data.message),
      variant: "destructive"
    });
  }

  await initUsers();
};

/**
 * Edit the user replacing existing data by the new JSON
 * @param user
 * @returns {Promise<void>}
 */
const editUser = async (user) => {
  let res = await fetch("api/v1/user", {
    method: "PUT",
    body: JSON.stringify(user),
  });
  if(res.ok) {
    toast({
      title: "User modified successfully",
    });
    await fetch("api/v1/session", {method: "PUT"});
  } else {
    toast({
      title: "Unable to modify user",
      description: await res.json().then(data => data.message),
      variant: "destructive"
    });
  }

  await initUsers();
};

/**
 * Remove a user that has the passed ID
 * @param id
 * @returns {Promise<void>}
 */
const deleteUser = async (id) => {
  let res = await fetch("api/v1/user", {
    method: "DELETE",
    body: id,
  });
  if(res.ok) {
    toast({
      title: "User deleted successfully",
    });
    await fetch("api/v1/session", {method: "PUT"});
  } else {
    toast({
      title: "Unable to delete user",
      description: await res.json().then(data => data.message),
      variant: "destructive"
    });
  }

  await initUsers();
};

/**
 * Initializes the page
 * @returns {Promise<void>}
 */
const init = async () => {
  await initUsers();
};

watch([cUsername, cPassword, cPasswordConfirm, cRoles], () => {
  cValid.value = (cUsername.value !== "" && cPassword.value !== "" && cPassword.value === cPasswordConfirm.value);
});

watch([mUsername, mPassword, mPasswordConfirm, mRoles], () => {
  mValid.value = (mUsername.value !== "" && mPassword.value === mPasswordConfirm.value);
});

const initCreate = () => {
  [cUsername.value, cPassword.value, cPasswordConfirm.value] = ["","",""];
};

const initModify = (item) => {
  [mUsername.value, mPassword.value, mPasswordConfirm.value,mRoles.value] = [item.username,"", "",item.role];
};

init();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between">
        <div>Administration des utilisateurs</div>
        <Dialog>
          <DialogTrigger>
            <Button @click="initCreate">
              <LucideCirclePlus/>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>Ici vous pouvez ajouter un nouvel utilisateur.</DialogDescription>
            </DialogHeader>
            <Label for="usernameCreate">Nom d&apos;utilisateur ({{cUsername.length}}/100)</Label>
            <Input id="usernameCreate" v-model="cUsername"/>
            <Label for="passwordCreate">Mot de Passe</Label>
            <Input id="passwordCreate" v-model="cPassword" type="password"/>
            <Label for="passwordCreateConfirm">Confirmer le Mot de Passe</Label>
            <Input id="passwordCreateConfirm" v-model="cPasswordConfirm" type="password" />
            <Label for="roleCreate">Roles (ADMIN, MAINTAINER, BDE, ENSEIGNANT, CULTURE)</Label>
            <Input id="roleCreate" v-model="cRoles" />
            <DialogClose as-child>
              <Button v-show="cValid" @click="createUser({username:cUsername, password: cPassword, role: cRoles})">Ajouter</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardTitle>
      <CardDescription class="text-left">Ici vous ajouter, editer et supprimer des utilisateurs</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea class="h-[250px] sm:h-[250px] md:h-[250px] lg:h-[200px] xl:h-[300px] 2xl:h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Identifiant</TableHead>
              <TableHead class="text-center">Role</TableHead>
              <TableHead class="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in users " :key="index">
              <TableCell class="text-center">{{ item.username }}</TableCell>
              <TableCell class="text-center">{{ item.role.toString() }}</TableCell>
              <TableCell class="text-center block max-w-[50px] sm:max-w-full">
                <Dialog>
                  <DialogTrigger>
                    <Button @click="initModify(item)">
                      <LucidePen/>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editer un utilisateur</DialogTitle>
                      <DialogDescription>Ici vous pouvez editer un utilisateur. Les changements doivent être appliqués manuellement.</DialogDescription>
                    </DialogHeader>
                    <Label for="usernameModify">Nom d&apos;utilisateur ({{mUsername.length}}/100)</Label>
                    <Input id="usernameModify" v-model="mUsername"/>
                    <Label for="passwordModify">Mot de Passe</Label>
                    <Input id="passwordModify" v-model="mPassword" type="password"/>
                    <Label for="passwordModifyConfirm">Confirmer le Mot de Passe</Label>
                    <Input id="passwordModifyConfirm" v-model="mPasswordConfirm" type="password" />
                    <Label for="roleModify">Roles (ADMIN, MAINTAINER, BDE, ENSEIGNANT, CULTURE)</Label>
                    <Input id="roleModify" v-model="mRoles" />
                    <DialogClose as-child>
                      <Button v-show="mValid" @click="editUser(mPassword.value !== '' ? {id: item.id, username:mUsername, password: mPassword, role: mRoles} :{id: item.id, username:mUsername, role: mRoles.split(',')})">Appliquer</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" @click="deleteUser(item.id)">
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
