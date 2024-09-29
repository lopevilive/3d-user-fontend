
<template>
  <div id="scene">
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
// import {init} from '@/example/wardrobe'
import {init} from '@/example/test'
// import {init} from '/src/example/tmp'

onMounted(init)

</script>


<style scoped>
#info {
	position: absolute;
	top: 10px;
	width: 100%;
	text-align: center;
	z-index: 100;
	display:block;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
