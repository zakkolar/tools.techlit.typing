<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { gameSettingsFields, wordField } from '@/data/settingsFields'
import GameSettingsForm from '@/components/GameSettingsForm.vue'

const word = ref('')

const settings = reactive<Record<string, unknown>>(
  Object.fromEntries(gameSettingsFields.map((field) => [field.key, field.default])),
)

const previewUrl = computed(() => {
  const origin = window.location.origin
  const params = [`word=${encodeURIComponent(word.value.trim())}`]
  for (const field of gameSettingsFields) {
    params.push(`${field.key}=${encodeURIComponent(String(settings[field.key!]))}`)
  }
  return `${origin}/play#${params.join('&')}`
})

const canBuild = computed(() => word.value.trim().length > 0)
const copied = ref(false)
let copiedTimeout: ReturnType<typeof setTimeout> | null = null

function openPreview() {
  if (!canBuild.value) return
  window.open(previewUrl.value, '_blank')
}

async function copyLink() {
  if (!canBuild.value) return
  await navigator.clipboard.writeText(previewUrl.value)
  copied.value = true
  if (copiedTimeout) clearTimeout(copiedTimeout)
  copiedTimeout = setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="single-link-builder">
    <p class="form-intro">Set the username and settings, then copy the link to share.</p>
    <div class="form-row">
      <label class="form-row-label" for="single-link-word">
        <span class="form-row-name">{{ wordField.label }}</span>
        <span class="form-row-description">{{ wordField.description }}</span>
      </label>
      <input
        id="single-link-word"
        type="text"
        class="text-field word-input"
        placeholder="EmmaWalker"
        v-model="word"
      />
    </div>

    <GameSettingsForm :fields="gameSettingsFields" v-model="settings" />

    <div class="builder-actions">
      <button type="button" class="btn btn-primary" :disabled="!canBuild" @click="openPreview">
        Preview link
      </button>
      <button type="button" class="btn btn-secondary" :disabled="!canBuild" @click="copyLink">
        {{ copied ? 'Copied!' : 'Copy link' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.single-link-builder {
  display: flex;
  flex-direction: column;
}

.form-intro {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 0 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-rule);
}

.text-field.word-input {
  flex-shrink: 0;
  width: 200px;
}

.builder-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
</style>
