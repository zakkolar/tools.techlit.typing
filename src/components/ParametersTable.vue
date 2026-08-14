<script setup lang="ts">
import type { ManifestField } from '@/data/settingsFields'

defineProps<{
  fields: ManifestField[]
}>()

function formatDefault(value: unknown) {
  if (value === undefined) {
    return '—'
  }
  return String(value)
}
</script>

<template>
  <div class="parameters-table">
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(field, index) in fields" :key="field.key ?? `heading-${index}`">
          <tr v-if="field.type === 'heading'">
            <td colspan="3" class="table-section-heading">{{ field.title }}</td>
          </tr>
          <tr v-else>
            <td><code>{{ field.key }}</code></td>
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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-rule);
  vertical-align: top;
  line-height: 1.5;
}

th:first-child,
td:first-child {
  padding-left: 0;
}

th:last-child,
td:last-child {
  padding-right: 0;
}

tr:last-child td {
  border-bottom: none;
}

th {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.table-section-heading {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-text);
  background: var(--color-surface);
  padding-top: 14px;
}

.description {
  width: 100%;
  color: var(--color-text-muted);
}

td{
  vertical-align: middle;
}

code {
  font-family: var(--font-display);
  font-size: 13px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  padding: 1px 5px;
  white-space: nowrap;
}
</style>
