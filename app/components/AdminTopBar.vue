<script setup lang="ts">
import { navigateTo } from 'nuxt/app';
import { ref } from 'vue';

let admin = ref(false);
let bde = ref(false);
let maintainer = ref(false);
let enseignant = ref(false);
let culture = ref(false);
let dde = ref(false);

const goToAdmin = () => {
    return navigateTo("/admin");
};

const goToHP = () => {
    return navigateTo("/hp");
};

const goToCulture = () => {
    return navigateTo("/culturepanel");
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

init()
</script>

<template>
    <div class="flex justify-center m-2 gap-x-2">
        <Button v-if="admin || maintainer || enseignant || dde" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToAdmin()">Admin Panel</Button>
        <Button v-if="admin || maintainer || culture" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToCulture()">Culture Panel</Button>
        <Button v-if="admin || maintainer || dde" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToHP()">Hyperplanning Panel</Button>
        <Button v-if="admin || maintainer || enseignant || bde" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToJPO()">JPO Panel</Button>
    </div>
</template>