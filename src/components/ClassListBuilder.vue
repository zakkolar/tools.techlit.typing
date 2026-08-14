<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { gameSettingsFields, listPageFields } from '@/data/settingsFields'
import GameSettingsForm from '@/components/GameSettingsForm.vue'
import RosterInput, { type RosterStudent } from '@/components/RosterInput.vue'

const titleField = listPageFields.find((f) => f.key === 'title')!
const instructionsField = listPageFields.find((f) => f.key === 'instructions')!
const showCopyButtonsField = listPageFields.find((f) => f.key === 'showCopyButtons')!

const title = ref(String(titleField.default))
const instructions = ref(String(instructionsField.default))
const showCopyButtons = ref(Boolean(showCopyButtonsField.default))

const settings = reactive<Record<string, unknown>>(
  Object.fromEntries(gameSettingsFields.map((field) => [field.key, field.default])),
)

const students = ref<RosterStudent[]>([])
const hasLabels = ref(false)

function onRosterUpdate(nextStudents: RosterStudent[], nextHasLabels: boolean) {
  students.value = nextStudents
  hasLabels.value = nextHasLabels
}

const previewUrl = computed(() => {
  const origin = window.location.origin
  const params = [`words=${encodeURIComponent(students.value.map((s) => s.username).join('\n'))}`]
  if (hasLabels.value) {
    params.push(`labels=${encodeURIComponent(students.value.map((s) => s.label).join('\n'))}`)
  }
  params.push(`title=${encodeURIComponent(title.value)}`)
  params.push(`instructions=${encodeURIComponent(instructions.value)}`)
  params.push(`showCopyButtons=${showCopyButtons.value}`)
  for (const field of gameSettingsFields) {
    params.push(`${field.key}=${encodeURIComponent(String(settings[field.key!]))}`)
  }
  return `${origin}/links#${params.join('&')}`
})

const canBuild = computed(() => students.value.length > 0)
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
  <div class="class-list-builder">
    <p class="form-intro">Add your class list and game settings, then copy the link at the bottom to share.</p>

     <h2 class="settings-group-heading">Link page settings</h2>

    <div class="field-group">
      <div class="form-row-name">Class list</div>
      <div class="form-row-description">
        One row per student. Paste a spreadsheet column to fill multiple rows at once.
      </div>
      <RosterInput @update="onRosterUpdate" />
    </div>

    <div class="form-row">
      <label class="form-row-label" for="list-title">
        <span class="form-row-name">{{ titleField.label }}</span>
        <span class="form-row-description">{{ titleField.description }}</span>
      </label>
      <input id="list-title" type="text" class="text-field text-input" v-model="title" />
    </div>

    <div class="form-row textarea-row">
      <label class="form-row-label" for="list-instructions">
        <span class="form-row-name">{{ instructionsField.label }}</span>
        <span class="form-row-description">{{ instructionsField.description }}</span>
      </label>
      <textarea
        id="list-instructions"
        class="text-field text-input textarea-input"
        v-model="instructions"
        rows="3"
      ></textarea>
    </div>

    <div class="form-row">
      <label class="form-row-label" for="list-show-copy">
        <span class="form-row-name">{{ showCopyButtonsField.label }}</span>
        <span class="form-row-description">{{ showCopyButtonsField.description }}</span>
      </label>
      <input id="list-show-copy" type="checkbox" class="checkbox-field" v-model="showCopyButtons" />
    </div>

    <h2 class="settings-group-heading">Game settings</h2>
    <GameSettingsForm :fields="gameSettingsFields" v-model="settings" />

    <div class="builder-actions">
      <button type="button" class="btn btn-primary" :disabled="!canBuild" @click="openPreview">
        Preview list
      </button>
      <button type="button" class="btn btn-secondary" :disabled="!canBuild" @click="copyLink">
        {{ copied ? 'Copied!' : 'Copy link' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.class-list-builder {
  display: flex;
  flex-direction: column;
}

.form-intro {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-rule);
}

.field-group {
  padding-top: 10px;
}

.text-field.text-input {
  flex-shrink: 0;
  width: 240px;
}

.textarea-input {
  resize: vertical;
  line-height: 1.5;
}

.settings-group-heading {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 20px 0 4px;
}

.builder-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
</style>
