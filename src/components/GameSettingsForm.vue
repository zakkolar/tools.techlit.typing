<script setup lang="ts">
import type { ManifestField } from '@/data/settingsFields'

defineProps<{
  fields: ManifestField[]
}>()

const settings = defineModel<Record<string, unknown>>({ required: true })

function onNumberInput(key: string, event: Event) {
  const value = (event.target as HTMLInputElement).valueAsNumber
  settings.value[key] = Number.isNaN(value) ? 0 : value
}
</script>

<template>
  <div class="game-settings-form">
    <div class="form-row" v-for="field in fields" :key="field.key">
      <label class="form-row-label" :for="`setting-${field.key}`">
        <span class="form-row-name">{{ field.label }}</span>
        <span class="form-row-description">{{ field.description }}</span>
      </label>
      <input
        v-if="field.type === 'boolean'"
        :id="`setting-${field.key}`"
        type="checkbox"
        class="checkbox-field"
        v-model="settings[field.key!] as boolean"
      />
      <input
        v-else-if="field.type === 'number'"
        :id="`setting-${field.key}`"
        type="number"
        class="text-field setting-number"
        :value="settings[field.key!] as number"
        @input="onNumberInput(field.key!, $event)"
      />
      <input
        v-else
        :id="`setting-${field.key}`"
        type="text"
        class="text-field setting-text"
        v-model="settings[field.key!] as string"
      />
    </div>
  </div>
</template>

<style scoped>
.game-settings-form {
  display: flex;
  flex-direction: column;
}

.form-row:last-child {
  border-bottom: none;
}

.text-field.setting-number,
.text-field.setting-text {
  flex-shrink: 0;
}

.text-field.setting-number {
  width: 72px;
  text-align: right;
}

.text-field.setting-text {
  width: 200px;
}
</style>
