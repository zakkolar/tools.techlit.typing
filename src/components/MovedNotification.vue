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
  padding: 10px 40px 10px 16px;
  background: var(--color-warm-tint);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-rule);
  font-family: var(--font-body);
  font-size: 14px;
  position: relative;
}

.redirect-banner a {
  color: var(--color-warm-deep);
  font-weight: 600;
}

.redirect-banner button {
  position: absolute;
  right: 8px;
  top: 8px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-family: var(--font-display);
}

.redirect-banner button:hover {
  background: rgba(42, 38, 33, 0.08);
  color: var(--color-text);
}
</style>
