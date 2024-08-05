<script setup>

import Home from "@/components/Home.vue";
</script>

<template>
<div id="box">
  <Home/>
</div>
</template>

<style scoped>
body{
  width: 100vw;
  height: 100vh;
}
#box{
  display: flex;
  justify-content: flex-start;
  left: 0;
  width: 100vw;
  padding-left: 0;
  margin-left: 0;
}
</style>
