<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

export interface RosterStudent {
  username: string
  label: string
}

const emit = defineEmits<{
  update: [students: RosterStudent[], hasLabels: boolean]
}>()

const rows = ref<RosterStudent[]>([{ username: '', label: '' }])

const hasCustomLabels = computed(() =>
  rows.value.some((row) => {
    const label = row.label.trim()
    return label.length > 0 && label !== row.username.trim()
  }),
)

const usernameRefs = ref<(HTMLInputElement | null)[]>([])
const labelRefs = ref<(HTMLInputElement | null)[]>([])

function setUsernameRef(el: unknown, index: number) {
  usernameRefs.value[index] = el as HTMLInputElement | null
}
function setLabelRef(el: unknown, index: number) {
  labelRefs.value[index] = el as HTMLInputElement | null
}

function addRow() {
  rows.value.push({ username: '', label: '' })
}

function removeRow(index: number) {
  rows.value.splice(index, 1)
}

async function onEnter(index: number, column: 'username' | 'label') {
  const isLast = index === rows.value.length - 1
  if (isLast) {
    addRow()
    await nextTick()
  }
  const refs = column === 'username' ? usernameRefs.value : labelRefs.value
  refs[index + 1]?.focus()
}


function onPaste(event: ClipboardEvent, rowIndex: number, column: 'username' | 'label') {
  const text = event.clipboardData?.getData('text') ?? ''
  if (!text.includes('\n') && !text.includes('\t')) return

  event.preventDefault()
  const lines = text.replace(/\r/g, '').split('\n')
  while (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()

  lines.forEach((line, offset) => {
    const cells = line.split('\t')
    const targetIndex = rowIndex + offset
    while (rows.value.length <= targetIndex) {
      rows.value.push({ username: '', label: '' })
    }
    const row = rows.value[targetIndex]!
    if (column === 'username') {
      row.username = cells[0] ?? ''
      if (cells.length > 1) {
        row.label = cells[1] ?? ''
      }
    } else {
      row.label = cells[0] ?? ''
    }
  })
}

const resolvedStudents = computed<RosterStudent[]>(() =>
  rows.value
    .map((row) => ({ username: row.username.trim(), label: row.label.trim() }))
    .filter((row) => row.username.length > 0)
    .map((row) => ({
      username: row.username,
      label: row.label || row.username,
    })),
)

watch(
  [resolvedStudents, hasCustomLabels],
  ([students, labels]) => {
    emit('update', students, labels)
  },
  { immediate: true },
)
</script>

<template>
  <div class="roster-input">
    <div class="roster-table">
      <div class="roster-head">
        <span class="col-header">
          Username
          <InfoTooltip text="Username students type when they play the game" />
        </span>
        <span class="col-header">
          Link text
          <InfoTooltip text="Label for the student's game link on the class page. Same as the username by default." />
        </span>
      </div>

      <div class="roster-body">
        <div class="roster-row" v-for="(row, index) in rows" :key="index">
          <input
            type="text"
            class="text-field"
            v-model="row.username"
            :ref="(el) => setUsernameRef(el, index)"
            placeholder = "EmmaWalker"
            @paste="onPaste($event, index, 'username')"
            @keydown.enter.prevent="onEnter(index, 'username')"
          />
          <input
            type="text"
            class="text-field"
            v-model="row.label"
            :placeholder="row.username || 'Emma W'"
            :ref="(el) => setLabelRef(el, index)"
            @paste="onPaste($event, index, 'label')"
            @keydown.enter.prevent="onEnter(index, 'label')"
          />
          <span class="row-actions">
            <button
              type="button"
              class="row-action remove"
              aria-label="Remove student"
              @click="removeRow(index)"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="roster-footer">
      <button type="button" class="btn btn-secondary btn-sm" @click="addRow">+ Add student</button>
    </div>
  </div>
</template>

<style scoped>
.roster-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-rule);
}

.roster-head,
.roster-row {
  display: grid;
  grid-template-columns: 1fr 1fr 24px;
  gap: 8px;
  align-items: center;
}

.roster-head {
  padding-top: 10px;
  padding-bottom: 6px;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.roster-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.roster-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}


.row-actions {
  display: flex;
  justify-content: flex-end;
}

.row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 0.12s ease, background 0.12s ease, color 0.12s ease;
}

.roster-row:hover .row-action,
.roster-row:focus-within .row-action {
  opacity: 1;
}

.row-action.remove:hover {
  background: var(--color-incorrect-tint);
  color: var(--color-incorrect);
}

.btn-sm {
  align-self: flex-start;
}
</style>
