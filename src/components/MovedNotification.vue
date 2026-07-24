<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const newUrl = ref<string | null>(null)
const acknowledged = ref(false)

const show = computed(() => !!newUrl.value && !acknowledged.value)

onMounted(() => {
  acknowledged.value = localStorage.getItem('acknowledged') === 'true'
  const url = new URL(window.location.toString())
  if (url.hostname.indexOf('techlit.app') > -1) {
    newUrl.value = window.location.toString().replace('techlit.app', 'techlit.tools')
  }
})

function acknowledge() {
  localStorage.setItem('acknowledged', 'true')
  acknowledged.value = true
}
</script>

<template>
  <div v-if="show" class="redirect-banner">
    The domain for this app will soon change from techlit.app to techlit.tools. To continue using
    it, please update your link to: <a :href="newUrl!">{{ newUrl }}</a>
    <button @click="acknowledge">x</button>
  </div>
</template>

<style scoped>
.redirect-banner {
  padding: 8px 34px 8px 8px;
  background-color: #ffffa2;
  position: relative;
}

.redirect-banner button {
  position: absolute;
  right: 5px;
  top: 5px;
  border: none;
  width: 24px;
  text-align: center;
}
</style>
