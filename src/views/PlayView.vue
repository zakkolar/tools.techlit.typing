<script setup lang="ts">
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue'
import {Chromebook} from '@/keyboards/Chromebook'
import type {Key} from '@/keyboards/Key'
import {FillableTypes, getFillableConstructor} from '@/fillables/Fillables'
import type {Fillable} from '@/fillables/Fillable'
import MovedNotification from '@/components/MovedNotification.vue'

interface Settings {
  undoIncorrect: boolean
  showKeyboard: boolean
  sound: boolean
  forceCorrectMistakes: boolean
  capacity: number
  mode: FillableTypes
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
const incorrectLetters = ref(0)
const currentIncorrectLetters = ref(0)
const currentTime = ref(0)
const started = ref(false)
const touchDevice = ref(false)
const fillables = ref<Fillable[]>([])

const settings = reactive<Settings>({
  undoIncorrect: false,
  showKeyboard: true,
  sound: true,
  forceCorrectMistakes: true,
  capacity: 10,
  mode: FillableTypes.GREEN_BAR,
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
      incorrectLetters.value++
      currentIncorrectLetters.value++
    }
    currentLetterIndex.value++

    if (currentLetterIndex.value === charactersToType.value.length && correctLetter) {
      setWord(charactersToType.value.join(''))
      currentIncorrectLetters.value = 0
      playSound('correct')
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
      if (settings.undoIncorrect) {
        incorrectLetters.value--
      }
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

function isCurrentKey(key: Key) {
  if (settings.forceCorrectMistakes && currentIncorrectLetters.value > 0) {
    return key.label === 'backspace'
  }

  const currentCharacter = charactersToType.value[currentLetterIndex.value]

  if (!currentCharacter) {
    return false
  }

  if (key.label === 'shift') {
    if (
        currentCharacter.toLowerCase() !== currentCharacter &&
        currentCharacter.toUpperCase() === currentCharacter
    ) {
      return true
    }
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
          param = !(param.toLowerCase() === 'false')
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

  const hash = window.location.hash.substring(1)
  const params = new Map<string, string>()

  hash.split('&').forEach((item) => {
    const parts = item.split('=')
    if (parts.length === 2) {
      params.set(parts[0]!, parts[1]!)
    }
  })

  Object.assign(settings, defaultSettings)

  setWord(getParam(params, 'word', 'string', ''))
  settings.undoIncorrect = getParam(params, 'undoIncorrect', 'boolean', settings.undoIncorrect)
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

  const mode = getParam(params, 'mode', 'string', settings.mode).toUpperCase()

  if (mode in FillableTypes) {
    settings.mode = FillableTypes[mode as keyof typeof FillableTypes]
  } else {
    settings.mode = FillableTypes.GREEN_BAR
  }
  reset()
}

function reset() {
  started.value = false
  typedCharacters.value = []
  correctLetters.value = 0
  incorrectLetters.value = 0
  currentIncorrectLetters.value = 0
  fillables.value.length = 0
  addFillable()
  currentTime.value = settings.startingTime
  currentLetterIndex.value = 0
}

function pause() {
  paused.value = true
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
  const Constructor = fillableConstructor.value
  fillables.value.push(new Constructor({capacity: settings.capacity}))
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
        correctLetters: correctLetters.value,
        incorrectLetters: incorrectLetters.value,
        accuracy: accuracy.value,
        speed: speed.value,
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

const fillableConstructor = computed(() => getFillableConstructor(settings.mode))

const minutes = computed(() =>
    Math.floor(currentTime.value / 60).toString().padStart(2, '0'),
)

const seconds = computed(() => (currentTime.value % 60).toString().padStart(2, '0'))

const accuracy = computed(() =>
    Math.round((1 - incorrectLetters.value / (correctLetters.value + incorrectLetters.value)) * 100),
)

const speed = computed(() =>
    Math.round(
        (correctLetters.value + incorrectLetters.value) / 5.1 / (settings.startingTime / 60),
    ),
)

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

      <div v-if="currentFillable" class="fillables">
        <div v-html="currentFillable.css()"></div>
        <div v-html="fillable.render()" v-for="(fillable, index) of fillablesReversed" :key="index"></div>
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
          ></div>
        </div>
      </div>
    </div>

    <div class="messageScreenModal" v-if="paused">
      <div id="startScreen" class="messageScreen">
        <h1>Typing practice <span v-if="started">(paused)</span></h1>
        <button @click="play">{{ started ? 'Resume' : 'Start!' }}</button>
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
        <table class="results">
          <tbody>
          <tr>
            <th>Correct letters:</th>
            <td>{{ correctLetters }}</td>
          </tr>
          <tr>
            <th>Incorrect letters:</th>
            <td>{{ incorrectLetters }}</td>
          </tr>
          <tr>
            <th>Accuracy:</th>
            <td>{{ accuracy }}%</td>
          </tr>
          <tr>
            <th>Speed:</th>
            <td>{{ speed }} WPM</td>
          </tr>
          </tbody>
        </table>
        <button @click="playAgain" v-if="settings.showPlayAgain">Play again</button>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
}

.keyboard {
  border: 1px solid #ccc;
  padding: 3px;
  overflow: auto;
  position: relative;
}

.row {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}

.key {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 3px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  position: relative;
}

.pressed {
  background-color: #beffff;
}

.letters {
  overflow: auto;
  margin: 20px 0;
}

.letters ul {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.letters li {
  float: left;
  font-size: 30px;
  width: 40px;

  border-color: #444;
  border-width: 1px;
  margin: 0 5px;
  text-align: center;
  padding: 5px;
  display: block;
}

.key.current {
  background-color: #fcdc97;
}

.letters li.current {
  border-bottom: solid;
  border-width: 4px;
  margin-top: 4px;
}

.letters li.correct {
  color: #00b200;
}

.letters li.incorrect {
  background-color: #ff7171;
}

.fillables {
  overflow: auto;
}

#timer {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
}

.results th {
  text-align: right;
}

.results td {
  text-align: left;
}

.results {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.messageScreenModal {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.messageScreen {
  text-align: center;
  padding: 20px;
  min-height: 30vh;
  min-width: 500px;
  width: 50vw;
  overflow: auto;
  font-size: 22px;
  background-color: white;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 10vh;
  border-style: solid;
  border-width: 5px;
}

#timeUp .fillables {
  display: flex;
  justify-content: center;
  align-items: center;
}

.messageScreen button {
  font-size: 50px;
  background-color: #83ff63;
  border-style: none;
  margin-top: 20px;
  padding: 10px;
}
</style>
