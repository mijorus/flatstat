<script lang="ts" setup>
import Navbar from "../components/Navbar.vue";
</script>

<template>
    <Navbar></Navbar>
    <button class="button is-primary">Sign in</button>
     <slot></slot>
</template>