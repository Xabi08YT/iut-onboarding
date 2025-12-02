<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

defineProps<{ access: boolean }>();

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
</script>

<template>
    <div class="flex justify-center m-2 gap-x-2">
        <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToAdmin()">Admin Panel</Button>
        <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToCulture()">Culture Panel</Button>
        <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToHP()">Hyperplanning Panel</Button>
        <Button class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200" @click="goToJPO()">JPO Panel</Button>
    </div>
</template>