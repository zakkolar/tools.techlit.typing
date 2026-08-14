<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

interface Param {
  key: string
  value: string | null
}

const parsed = computed(() => {
  const hashIndex = props.url.indexOf('#')
  const base = props.url.slice(0, hashIndex)
  const hash = props.url.slice(hashIndex + 1)

  const params: Param[] = hash.split('&').map((segment) => {
    const eqIndex = segment.indexOf('=')
    if (eqIndex === -1) {
      return { key: segment, value: null }
    }
    return { key: segment.slice(0, eqIndex), value: segment.slice(eqIndex + 1) }
  })

  return { base, params }
})
</script>

<template>
  <pre class="url-example"><span class="base">{{ parsed.base }}</span><span class="hash">#</span><template v-for="(param, i) in parsed.params" :key="i"><span v-if="i > 0" class="amp">&amp;</span><span class="key">{{ param.key }}</span><template v-if="param.value !== null">=<span class="value">{{ param.value }}</span></template></template></pre>
</template>

<style scoped>
.url-example {
  font-family: var(--font-display);
  font-size: 14px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  padding: 6px 8px;
  overflow-x: auto;
  white-space: pre;
}

.base {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.hash,
.amp {
  color: var(--color-text);
}

.key {
  color: var(--color-blue-deep);
  font-weight: 700;
}

.value {
  color: var(--color-accent-deep);
  font-weight: 700;
}
</style>
