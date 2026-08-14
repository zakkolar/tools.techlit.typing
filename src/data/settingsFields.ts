export interface ManifestField {
  label?: string
  key?: string
  type: string
  default?: unknown
  description?: string
  title?: string
  required?: boolean
}

export const wordField: ManifestField = {
  label: 'Username',
  key: 'word',
  type: 'text',
  required: true,
  description: 'Username for the player to type.',
}

export const gameSettingsFields: ManifestField[] = [
  {
    label: 'Letters per bar',
    key: 'capacity',
    type: 'number',
    default: 10,
    description: 'Number of correct letters/characters that fill one progress bar.',
  },
  {
    label: 'Show virtual keyboard',
    key: 'showKeyboard',
    type: 'boolean',
    default: true,
    description: 'Show a virtual keyboard on the screen with the current key highlighted.',
  },
  {
    label: 'Force players to correct typos',
    key: 'forceCorrectMistakes',
    type: 'boolean',
    default: true,
    description: 'Prevent players from advancing until they correct typos.',
  },
  {
    label: 'Use sound',
    key: 'sound',
    type: 'boolean',
    default: true,
    description: 'Enable click sound when a letter is pressed.',
  },
  {
    label: 'Time limit (seconds)',
    key: 'seconds',
    type: 'number',
    default: 120,
    description: 'Game time limit in seconds. Set to 0 for unlimited time.',
  },
  {
    label: 'Show timer',
    key: 'showTimer',
    type: 'boolean',
    default: false,
    description:
      'Show the game timer on screen. When hidden, the game will still end at the time limit (unless set to unlimited).',
  },
  {
    label: 'Show play again',
    key: 'showPlayAgain',
    default: true,
    type: 'boolean',
    description: "Show a 'Play again' button after the game ends.",
  },
]

export const listPageFields: ManifestField[] = [
  {
    label: 'Page title',
    key: 'title',
    type: 'text',
    default: 'Username Practice',
    description: 'Heading shown at the top of the class links page.',
  },
  {
    label: 'Instructions',
    key: 'instructions',
    type: 'text',
    default: 'Click on your username below to start practicing.',
    description: 'Instructions shown below the heading on the class links page.',
  },
]

export const wordSettingsFields: ManifestField[] = [wordField, ...gameSettingsFields]
