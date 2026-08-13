<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ManifestField {
  label?: string
  key?: string
  type: string
  default?: unknown
  description?: string
  title?: string
}

const props = defineProps<{
  manifestUrl: string
}>()

const fields = ref<ManifestField[]>([])
const status = ref<'loading' | 'loaded' | 'error'>('loading')

function formatDefault(value: unknown) {
  if (value === undefined) {
    return '—'
  }
  return String(value)
}

onMounted(async () => {
  try {
    const response = await fetch(props.manifestUrl)
    const manifest = await response.json()
    fields.value = manifest.fields ?? []
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
})
</script>

<template>
  <div class="parameters-table">
    <p v-if="status === 'loading'" class="status">Loading parameters…</p>
    <p v-else-if="status === 'error'" class="status error">
      Couldn't load the parameter list from {{ manifestUrl }}.
    </p>
    <table v-else>
      <thead>
        <tr>
          <th>Setting</th>
          <th>Key</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(field, index) in fields" :key="field.key ?? `heading-${index}`">
          <tr v-if="field.type === 'heading'">
            <td colspan="5" class="section-heading">{{ field.title }}</td>
          </tr>
          <tr v-else>
            <td>{{ field.label }}</td>
            <td><code>{{ field.key }}</code></td>
            <td>{{ field.type }}</td>
            <td><code>{{ formatDefault(field.default) }}</code></td>
            <td class="description">{{ field.description }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.parameters-table {
  overflow-x: auto;
}

@media (min-width: 640px) {
  .parameters-table {
    margin-left: -48px;
    margin-right: -32px;
  }
}

.status {
  color: var(--color-ink-soft);
}

.status.error {
  color: var(--color-incorrect);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-rule);
  vertical-align: top;
  line-height: 1.5;
}

th {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-ink-soft);
  white-space: nowrap;
}

.section-heading {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-ink);
  background: var(--color-paper);
  padding-top: 14px;
}

.description {
  width: 100%;
}

code {
  font-family: var(--font-display);
  font-size: 13px;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  padding: 1px 5px;
  white-space: nowrap;
}
</style>
