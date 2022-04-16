<script lang="ts" setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
    <Navbar></Navbar>
     <div class="container is-widescreen mt-4">
         <div >
             <slot></slot>
         </div>
     </div>
     <Footer></Footer>
</template>