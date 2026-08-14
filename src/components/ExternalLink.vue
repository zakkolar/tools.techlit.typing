<script setup lang="ts"></script>

<template>
  <a class="external-link" target="_blank">
    <slot />
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="external-link-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  </a>
</template>

<style scoped>
.external-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2em;
}

.external-link-icon {
  align-self: center;
  width: 0.85em;
  height: 0.85em;
}
</style>
