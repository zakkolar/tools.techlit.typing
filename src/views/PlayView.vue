<script setup lang="ts">
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue'
import {Chromebook} from '@/keyboards/Chromebook'
import type {Key} from '@/keyboards/Key'
import {Fillable} from '@/fillables/Fillable'
import MovedNotification from '@/components/MovedNotification.vue'
import {parseBooleanParam, parseHashParams} from '@/utils/hashParams'

interface Settings {
  showKeyboard: boolean
  sound: boolean
  forceCorrectMistakes: boolean
  capacity: number
  useTimer: boolean
  startingTime: number
  showTimer: boolean
  showPlayAgain: boolean
}

const keyboard = Chromebook

const typedCharacters = ref<string[]>([])
const charactersToType = ref<string[]>([])
const currentLetterIndex = ref(0)
const paused = ref(true)
const correctLetters = ref(0)
const currentIncorrectLetters = ref(0)
const currentTime = ref(0)
const started = ref(false)
const touchDevice = ref(false)
const fillables = ref<Fillable[]>([])
const showKeyboardHint = ref(false)
let keyboardHintTimeout: ReturnType<typeof setTimeout> | null = null

const settings = reactive<Settings>({
  showKeyboard: true,
  sound: true,
  forceCorrectMistakes: true,
  capacity: 10,
  useTimer: false,
  startingTime: 0,
  showTimer: false,
  showPlayAgain: true,
})

let defaultSettings: Settings = {...settings}
let listeners: Array<{
  type: string
  target: EventTarget
  listener: EventListenerOrEventListenerObject
}> = []

function pluralize(number: number, wordString: string) {
  const words = wordString.split('|').map((w) => w.trim())
  const word = words.length === 1 || number === 1 ? words[0] : words[1]
  return `${number} ${word}`
}

function handleKeyPress(e: Event) {
  const target = e.target as HTMLInputElement
  const inputEvent = e as InputEvent
  const inputType = inputEvent.inputType

  if (target.value === '') {
    backspace()
  }

  if (inputType === 'insertText') {
    typeLetter(inputEvent.data as string)
  } else if (inputType === 'insertCompositionText') {
    const input = inputEvent.data as string
    typeLetter(input.slice(-1))
  }

  target.value = ' '
}

function typeLetter(letter: string) {
  let correctLetter = false

  if (
      isPlaying() &&
      (!settings.forceCorrectMistakes ||
          (settings.forceCorrectMistakes && currentIncorrectLetters.value < 1))
  ) {
    typedCharacters.value.push(letter)
    playSound('click')

    if (
        typedCharacters.value[currentLetterIndex.value] ===
        charactersToType.value[currentLetterIndex.value]
    ) {
      correctLetter = true
      correctLetters.value++
      currentFillable.value?.fill(1)
      if (currentFillable.value?.isFull()) {
        addFillable()
      }
    } else {
      currentIncorrectLetters.value++
    }
    currentLetterIndex.value++

    if (currentLetterIndex.value === charactersToType.value.length && correctLetter) {
      setWord(charactersToType.value.join(''))
      currentIncorrectLetters.value = 0
    }
  }
}

function backspace() {
  playSound('click')
  if (isPlaying() && typedCharacters.value.length > 0) {
    const removedCharacter = typedCharacters.value.pop()
    currentLetterIndex.value--

    currentFillable.value?.unfill(1)

    if (removedCharacter === charactersToType.value[currentLetterIndex.value]) {
      correctLetters.value--
    } else {
      currentIncorrectLetters.value--
    }
  }
}

function isPressed(_key: Key) {
  return false
}

function setWord(word: string) {
  typedCharacters.value = []
  charactersToType.value = word.split('')
  currentLetterIndex.value = 0
}

function findKeyForCharacter(char: string): Key | undefined {
  const lower = char.toLowerCase()
  for (const row of keyboard.keys) {
    for (const key of row) {
      if ((Array.isArray(key.label) && key.label.includes(char)) || key.label === lower) {
          return key;
      }
    }
  }
  return undefined;
}

function shiftHandNeeded(char: string): 'left' | 'right' | undefined {
  const isUpperLetter = char.toLowerCase() !== char && char.toUpperCase() === char
  const targetKey = findKeyForCharacter(char)

  if (targetKey && (isUpperLetter || (Array.isArray(targetKey.label) && targetKey.label[0] === char))) {
    return targetKey.hand;
  }

  return undefined;
}

function isCurrentKey(key: Key) {
  if (settings.forceCorrectMistakes && currentIncorrectLetters.value > 0) {
    return key.label === 'backspace'
  }

  const currentCharacter = charactersToType.value[currentLetterIndex.value]

  if (!currentCharacter) {
    return false
  }

  if (key.label === 'shift') {
    const hand = shiftHandNeeded(currentCharacter)
    return !!hand && key.hand !== hand;
  }

  if (Array.isArray(key.label)) {
    return key.label.includes(currentCharacter)
  } else {
    return key.label === currentCharacter.toLowerCase()
  }
}

function readHashParams() {
  pause()

  const getParam = (
      params: Map<string, string>,
      paramName: string,
      type: 'boolean' | 'integer' | 'string',
      defaultValue: any,
  ) => {
    let param: any = params.get(paramName)

    if (param) {
      switch (type) {
        case 'boolean':
          param = parseBooleanParam(param, defaultValue)
          break
        case 'integer':
          param = parseInt(param)
          break
        default:
          param = decodeURIComponent(param)
      }
    } else {
      param = defaultValue
    }

    return param
  }

  const params = parseHashParams()

  Object.assign(settings, defaultSettings)

  setWord(getParam(params, 'word', 'string', ''))
  settings.showKeyboard = getParam(params, 'showKeyboard', 'boolean', settings.showKeyboard)
  settings.capacity = getParam(params, 'capacity', 'integer', settings.capacity)
  settings.forceCorrectMistakes = getParam(
      params,
      'forceCorrectMistakes',
      'boolean',
      settings.forceCorrectMistakes,
  )
  settings.sound = getParam(params, 'sound', 'boolean', settings.sound)
  settings.startingTime = getParam(params, 'seconds', 'integer', settings.startingTime)
  settings.useTimer = settings.startingTime > 0
  settings.showTimer = getParam(params, 'showTimer', 'boolean', settings.showTimer)
  settings.showPlayAgain = getParam(params, 'showPlayAgain', 'boolean', settings.showPlayAgain)
  currentTime.value = settings.startingTime

  reset()
}

function reset() {
  started.value = false
  typedCharacters.value = []
  correctLetters.value = 0
  currentIncorrectLetters.value = 0
  fillables.value.length = 0
  addFillable()
  currentTime.value = settings.startingTime
  currentLetterIndex.value = 0
}

function pause() {
  paused.value = true
}

function onKeyTap() {
  showKeyboardHint.value = true
  if (keyboardHintTimeout) {
    clearTimeout(keyboardHintTimeout)
  }
  keyboardHintTimeout = setTimeout(() => {
    showKeyboardHint.value = false
  }, 2000)
}

function play() {
  paused.value = false
  started.value = true
  runTimer()
}

function playAgain() {
  reset()
  play()
}

function isPlaying() {
  return !paused.value && (!settings.useTimer || (settings.useTimer && currentTime.value > 0))
}

function focusTextBox() {
  document.getElementById('textbox')?.focus()
}

function addListener(
    type: string,
    handler: EventListenerOrEventListenerObject,
    target: EventTarget = window,
) {
  target.addEventListener(type, handler)
  listeners.push({type, target, listener: handler})
}

function removeAllListeners() {
  listeners.forEach((item) => {
    item.target.removeEventListener(item.type, item.listener)
  })
  listeners = []
}

function addFillable() {
  fillables.value.push(new Fillable({capacity: settings.capacity}))
}

function playSound(s: string) {
  if (settings.sound) {
    const sound = new Audio(`/sounds/${s}.mp3`)
    sound.play()
  }
}

function runTimer() {
  if (settings.useTimer && currentTime.value > 0 && !paused.value) {
    currentTime.value--
    if (currentTime.value === 0) {
      onFinish()
    }
    setTimeout(runTimer, 1000)
  }
}

function onFinish() {
  window.parent.postMessage(
      JSON.stringify({
        type: 'typingComplete',
        filled: filled.value,
      }),
      '*',
  )
}

const remainingCharacters = computed(() =>
    charactersToType.value.slice(typedCharacters.value.length),
)

const currentFillable = computed<Fillable | null>(() => {
  if (fillables.value.length === 0) {
    return null
  }
  return fillables.value[fillables.value.length - 1] ?? null
})

const fillablesReversed = computed(() => fillables.value.slice().reverse())

const minutes = computed(() =>
    Math.floor(currentTime.value / 60).toString().padStart(2, '0'),
)

const seconds = computed(() => (currentTime.value % 60).toString().padStart(2, '0'))

const filled = computed(() => Math.floor(correctLetters.value / settings.capacity))

let textboxInputHandler: ((e: Event) => void) | null = null

onMounted(() => {
  defaultSettings = {...settings}

  addListener('touchstart', () => {
    touchDevice.value = true
    focusTextBox()
  })
  addListener('click', focusTextBox, document.body)
  addListener('hashchange', readHashParams)
  readHashParams()

  focusTextBox()

  textboxInputHandler = handleKeyPress
  const textbox = document.getElementById('textbox')
  textbox?.addEventListener('input', textboxInputHandler)
  textbox?.addEventListener('keyup', textboxInputHandler)
})

onUnmounted(() => {
  removeAllListeners()
  const textbox = document.getElementById('textbox')
  if (textboxInputHandler) {
    textbox?.removeEventListener('input', textboxInputHandler)
    textbox?.removeEventListener('keyup', textboxInputHandler)
  }
  if (keyboardHintTimeout) {
    clearTimeout(keyboardHintTimeout)
  }
})
</script>

<template>
  <div>
    <MovedNotification/>
    <input
        style="position: absolute; top: -100px; left: -100px"
        type="text"
        id="textbox"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
    />

    <div id="timer" v-if="settings.useTimer && settings.showTimer">{{ minutes }}:{{ seconds }}</div>
    <div id="game">
      <div v-if="currentFillable" class="fillables">
        <div v-html="currentFillable.css()"></div>
        <div v-html="fillable.render()" v-for="(fillable, index) of fillablesReversed" :key="index"></div>
      </div>

      <div class="letters">
        <ul>
          <li
              class="typed"
              v-for="(char, index) in typedCharacters"
              :key="'typed-' + index"
              :class="{ correct: char === charactersToType[index], incorrect: char !== charactersToType[index] }"
          >
            {{ char }}
          </li>
          <li
              v-for="(char, index) in remainingCharacters"
              :key="'remaining-' + index"
              :class="{ current: index === 0 }"
          >
            {{ char }}
          </li>
        </ul>
      </div>

      <div class="keyboard" v-if="settings.showKeyboard">
        <div class="row" v-for="(row, rowIndex) of keyboard.keys" :key="rowIndex">
          <div
              class="key"
              :class="{ current: isCurrentKey(key), pressed: isPressed(key) }"
              v-for="(key, keyIndex) of row"
              :key="keyIndex"
              v-html="Array.isArray(key.label) ? key.label.join('<br>') : key.label"
              :style="{ height: keyboard.keyHeight + 'px', width: keyboard.keyHeight * key.width + 'px' }"
              @click="onKeyTap"
          ></div>
        </div>

        <transition name="keyboard-hint">
          <div class="keyboard-hint" v-if="showKeyboardHint">Press the key on your real keyboard!</div>
        </transition>
      </div>
    </div>

    <div class="messageScreenModal" v-if="paused">
      <div id="startScreen" class="messageScreen">
        <h1>Username Practice <span v-if="started">(paused)</span></h1>
        <p>Type your username again and again. Every {{settings.capacity}} letters fills a bar. How many can you fill?</p>
        <button @click="play">{{ started ? 'Resume' : 'Start' }}</button>
      </div>
    </div>
    <div class="messageScreenModal" v-if="settings.useTimer && currentTime === 0">
      <div id="timeUp" class="messageScreen">
        <h1>Time's up</h1>
        <p v-if="currentFillable">You {{ currentFillable.verb }} {{ pluralize(filled, currentFillable.noun) }}!</p>

        <div v-if="currentFillable" class="fillables">
          <div v-html="currentFillable.css()"></div>
          <div v-html="fillable.render()" v-for="(fillable, index) of fillables" :key="index"></div>
        </div>
        <button @click="playAgain" v-if="settings.showPlayAgain">Play again</button>
      </div>
    </div>
  </div>
</template>

<style>
#game {
  padding: 24px 16px 40px;
  max-width: 900px;
  margin: 0 auto;
}

#timer {
  position: absolute;
  top: 20px;
  right: 24px;
  font-family: var(--font-display);
  font-variant-numeric: tabular-nums;
  font-size: 24px;
  color: var(--color-warm-deep);
}

.keyboard {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-radius: 12px;
  padding: 10px;
  overflow: auto;
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 24px auto 0;
  -webkit-user-select: none;
  user-select: none;
}

.row {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}

.key {
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 8px;
  box-shadow: 0 2px 0 var(--color-rule);
  margin: 3px;
  padding: 0 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  position: relative;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.key.current {
  background: var(--color-warm);
  border-color: var(--color-warm-deep);
  color: var(--color-surface-raised);
  box-shadow: 0 2px 0 var(--color-warm-deep);
}

.pressed {
  background: var(--color-accent-tint);
}

.letters {
  margin: 40px 0 32px;
}

.letters ul {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.letters li {
  font-family: var(--font-display);
  font-size: 34px;
  width: 48px;
  height: 60px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-radius: 8px;
  color: var(--color-text);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.letters li.current {
  border-color: var(--color-warm);
}

.letters li.current::after {
  content: '';
  position: absolute;
  left: 9px;
  right: 9px;
  bottom: 6px;
  height: 3px;
  background: var(--color-warm);
  animation: caret-blink 1s step-end infinite;
}

@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.15;
  }
}

.letters li.correct {
  color: var(--color-correct);
  background: var(--color-correct-tint);
  border-color: var(--color-correct);
}

.letters li.incorrect {
  color: var(--color-incorrect);
  background: var(--color-incorrect-tint);
  border-style: dashed;
  border-color: var(--color-incorrect);
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--color-incorrect);
}

.letters li.incorrect::after {
  content: '\00d7';
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  z-index: 1;
  border-radius: 50%;
  background: var(--color-incorrect);
  color: var(--color-surface-raised);
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 15px;
  text-align: center;
}

.fillables {
  position: relative;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.keyboard-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  background: rgba(42, 38, 33, 0.72);
  border-radius: 12px;
  color: var(--color-surface-raised);
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 600;
  pointer-events: none;
}

.keyboard-hint-enter-active,
.keyboard-hint-leave-active {
  transition: opacity 0.2s ease;
}

.keyboard-hint-enter-from,
.keyboard-hint-leave-to {
  opacity: 0;
}

.messageScreenModal {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(42, 38, 33, 0.55);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.messageScreen {
  text-align: center;
  padding: 32px;
  min-height: 17vh;
  min-width: 320px;
  max-width: 90vw;
  width: 520px;
  overflow: auto;
  background: var(--color-surface-raised);
  position: relative;
  margin-top: 10vh;
  border: 1px solid var(--color-rule);
  border-top: 4px solid var(--color-accent);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(42, 38, 33, 0.18);
  font-size: 21px;
}

.messageScreen h1 {
  letter-spacing: 0.02em;
  font-size: 38px;
}

.messageScreen p {
  text-align: left;
  color: var(--color-text-muted);
}

#timeUp .fillables {
  position: static;
  left: auto;
  width: auto;
  margin-left: 0;
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.messageScreen button {
  font-size: 21px;
  background: var(--color-accent);
  color: var(--color-surface-raised);
  border-style: none;
  border-radius: 6px;
  margin-top: 20px;
  padding: 12px 28px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.messageScreen button:hover {
  background: var(--color-accent-deep);
}
</style>
