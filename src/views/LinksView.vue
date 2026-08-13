<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { parseBooleanParam, parseHashParams } from '@/utils/hashParams'

interface StudentLink {
  username: string
  href: string
}

const DEFAULT_TITLE = 'Class Links'
const DEFAULT_INSTRUCTIONS = 'Find your name below and tap it to start typing practice.'

const students = ref<StudentLink[]>([])
const showCopyButtons = ref(true)
const title = ref(DEFAULT_TITLE)
const instructions = ref(DEFAULT_INSTRUCTIONS)
const copiedUsername = ref<string | null>(null)
let copiedTimeout: ReturnType<typeof setTimeout> | null = null

const RESERVED_KEYS = ['words', 'showCopyButtons', 'title', 'instructions']

function readHashParams() {
  const params = parseHashParams()

  const wordsValue = params.get('words')
  const usernames = wordsValue
      ? decodeURIComponent(wordsValue)
          .split(',')
          .map((w) => w.trim())
          .filter((w) => w.length > 0)
      : []

  showCopyButtons.value = parseBooleanParam(params.get('showCopyButtons'), false)

  const titleValue = params.get('title')
  title.value = titleValue ? decodeURIComponent(titleValue) : DEFAULT_TITLE

  const instructionsValue = params.get('instructions')
  instructions.value = instructionsValue ? decodeURIComponent(instructionsValue) : DEFAULT_INSTRUCTIONS

  const passthrough = [...params.entries()]
      .filter(([key]) => !RESERVED_KEYS.includes(key))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

  const origin = window.location.origin
  students.value = usernames.map((username) => ({
    username,
    href: `${origin}/play#word=${encodeURIComponent(username)}${passthrough ? '&' + passthrough : ''}`,
  }))
}

async function copyLink(student: StudentLink) {
  await navigator.clipboard.writeText(student.href)
  copiedUsername.value = student.username
  if (copiedTimeout) {
    clearTimeout(copiedTimeout)
  }
  copiedTimeout = setTimeout(() => {
    copiedUsername.value = null
  }, 1500)
}

onMounted(() => {
  window.addEventListener('hashchange', readHashParams)
  readHashParams()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', readHashParams)
  if (copiedTimeout) {
    clearTimeout(copiedTimeout)
  }
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
            <a class="student-link" :href="student.href">{{ student.username }}</a>
            <button
                v-if="showCopyButtons"
                type="button"
                class="copy-button"
                @click="copyLink(student)"
            >
              {{ copiedUsername === student.username ? 'Copied!' : 'Copy link' }}
            </button>
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
  background: var(--color-paper-raised);
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
  color: var(--color-ink-soft);
  font-size: 16px;
  max-width: 60ch;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.student-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-rule);
}

.student-list li:last-child {
  border-bottom: none;
}

.student-link {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-ink);
  text-decoration: none;
}

.student-link:hover {
  color: var(--color-accent-deep);
  text-decoration: underline;
}

.copy-button {
  flex-shrink: 0;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--color-accent-deep);
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.copy-button:hover {
  background: var(--color-accent-tint);
}
</style>
