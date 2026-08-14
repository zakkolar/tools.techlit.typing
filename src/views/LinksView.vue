<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { parseHashParams } from '@/utils/hashParams'

interface StudentLink {
  username: string
  label: string
  href: string
}

const DEFAULT_TITLE = 'Class Links'
const DEFAULT_INSTRUCTIONS = 'Click on your username below to load your practice game.'

const students = ref<StudentLink[]>([])
const title = ref(DEFAULT_TITLE)
const instructions = ref(DEFAULT_INSTRUCTIONS)

const RESERVED_KEYS = ['words', 'labels', 'title', 'instructions']

function readHashParams() {
  const params = parseHashParams()

  const wordsValue = params.get('words')
  const usernames = wordsValue
      ? decodeURIComponent(wordsValue)
          .split('\n')
          .map((w) => w.trim())
          .filter((w) => w.length > 0)
      : []

  const labelsValue = params.get('labels')
  const labels = labelsValue
      ? decodeURIComponent(labelsValue)
          .split('\n')
          .map((l) => l.trim())
      : []

  const titleValue = params.get('title')
  title.value = titleValue ? decodeURIComponent(titleValue) : DEFAULT_TITLE

  const instructionsValue = params.get('instructions')
  instructions.value = instructionsValue ? decodeURIComponent(instructionsValue) : DEFAULT_INSTRUCTIONS

  const passthrough = [...params.entries()]
      .filter(([key]) => !RESERVED_KEYS.includes(key))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

  const origin = window.location.origin
  students.value = usernames.map((username, index) => ({
    username,
    label: labels[index] || username,
    href: `${origin}/play#word=${encodeURIComponent(username)}${passthrough ? '&' + passthrough : ''}`,
  }))
}

onMounted(() => {
  window.addEventListener('hashchange', readHashParams)
  readHashParams()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', readHashParams)
})
</script>

<template>
  <div class="links-page">
    <div class="sheet">
      <template v-if="students.length > 0">
        <h1>{{ title }}</h1>
        <p class="lede">{{ instructions }}</p>
        <ul class="student-list">
          <li v-for="student in students" :key="student.username">
            <a class="student-link" :href="student.href">{{ student.label }}</a>
          </li>
        </ul>
      </template>
      <template v-else>
        <h1>No student list found</h1>
        <p class="lede">
          This link doesn't contain a list of students. Head back to the
          <router-link to="/">home page</router-link>
          and use the class list link builder to create one.
        </p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.links-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.sheet {
  width: 100%;
  max-width: 560px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-top: 4px solid var(--color-accent);
  border-radius: 4px;
  padding: 40px 44px;
  box-shadow: 0 1px 2px rgba(42, 38, 33, 0.06);
}

h1 {
  font-size: 30px;
  letter-spacing: 0.02em;
}

.lede {
  color: var(--color-text-muted);
  font-size: 16px;
  max-width: 60ch;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.student-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.student-link {
  flex: 1;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-surface-raised);
  background: var(--color-accent);
  border-radius: 6px;
  padding: 10px 16px;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: background 0.12s ease;
}

.student-link:hover {
  background: var(--color-accent-deep);
}
</style>
