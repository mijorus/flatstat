<script lang="ts" setup>
import Navbar from "../components/Navbar.vue";
</script>

<template>
    <Navbar></Navbar>
     <div class="container is-widescreen">
         <div>
             <slot></slot>
         </div>
     </div>
</template>