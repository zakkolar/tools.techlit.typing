<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="info-icon" tabindex="0" :data-tooltip="text">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  </span>
</template>

<style scoped>
.info-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.info-icon:hover,
.info-icon:focus-visible {
  color: var(--color-accent-deep);
  outline: none;
}

.info-icon[data-tooltip]:hover::after,
.info-icon[data-tooltip]:focus-visible::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 9px);
  left: -6px;
  width: 240px;
  padding: 9px 11px;
  background: var(--color-text);
  color: var(--color-surface-raised);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(42, 38, 33, 0.22);
  pointer-events: none;
  z-index: 10;
  white-space: normal;
  text-align: left;
  text-transform: none;
  letter-spacing: normal;
}

.info-icon[data-tooltip]:hover::before,
.info-icon[data-tooltip]:focus-visible::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 4px);
  left: 6px;
  border: 5px solid transparent;
  border-top-color: var(--color-text);
  z-index: 10;
}
</style>
