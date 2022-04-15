<template>
    <router-view></router-view>
</template>

<style lang="scss">

@import "./style/bulma.config.scss";
@import "@vuepic/vue-datepicker/dist/main.css";

</style>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    background-color:gainsboro;
    border-radius: 8px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: darkgray; 
  border-radius: 8px;
}

</style>
