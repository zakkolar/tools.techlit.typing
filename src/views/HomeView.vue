<script setup lang="ts">
import { computed } from 'vue'
import ParametersTable from '@/components/ParametersTable.vue'
import UrlExample from '@/components/UrlExample.vue'

const origin = window.location.origin
const customizeBase = 'https://customize.techlit.tools/#url='

const wordCustomizeUrl = computed(() => `${customizeBase}${origin}/customize/word.json`)
const listCustomizeUrl = computed(() => `${customizeBase}${origin}/customize/list.json`)

const sampleGame = computed(()=> `${origin}/play#word=JohnnyAppleseed&capacity=20&undoIncorrect=true&showKeyboard=true&forceCorrectMistakes=true&sound=true&seconds=120&showTimer=true&showPlayAgain=false`)

const singleParamExample = computed(() => `${origin}/play#word=JohnnyAppleseed`)
const multiParamExample = computed(() => `${origin}/play#word=JohnnyAppleseed&sound=true`)
</script>

<template>
  <div class="home">
    <div class="sheet">
      <h1>Username Typing Practice</h1>
      <p class="lede">
        Students practice typing their username, filling up bars as they go.</p>
        <p class="lede">Customize a link for each student and share it with them to play. No login needed.</p>

        <div class="actions">
          <div class="action-wrap">
            <a :href="sampleGame" class="action primary">Play sample game</a>
          </div>
          <div class="action-wrap">
            <a :href="wordCustomizeUrl" target="_blank" class="action secondary">Build one link</a>
          </div>
          <div class="action-wrap">
            <a :href="listCustomizeUrl" target="_blank" class="action secondary">Build class list</a>
          </div>
        </div>
      <section class="block">
        <div class="faq-list">
          <details class="faq">
            <summary>Is this fair for students with longer usernames?</summary>
            <div class="faq-content">
              <p>Each bar fills after a fixed number of letters (10 by default), not a full username. The length of the username does not impact the number of bars filled.</p>
              <p><b>Example:</b>
              <br>
              <code>EmmaWalker</code> (10 letters) fills one bar and <code>ChristopherRodriguez</code> (20 letters) fills two.
              </p>

            </div>
          </details>
          <details class="faq">
            <summary>How do I build the link manually?</summary>
            <div class="faq-content">
              <p>
                Every setting is passed into the URL. You can use this to build links yourself,
                e.g. with a spreadsheet formula. Parameters go after a <code>#</code>, written as
                <code>key=value</code>. This sets the username:
              </p>
              <UrlExample :url="singleParamExample" />
              <p>Separate multiple parameters with <code>&amp;</code>:</p>
              <UrlExample :url="multiParamExample" />
              <p>
                The <code>word</code> parameter must be specified. Any other parameter you leave
                out will use its default value.
              </p>
              <p>Available settings for <code>/play</code>:</p>
              <ParametersTable manifest-url="/customize/word.json" />
            </div>
          </details>
          <details class="faq">
            <summary>Is this privacy-friendly?</summary>
            <div class="faq-content">
              <p>Yes! This game runs entirely in your browser. No data is transmitted to me or any third parties.</p>
              <p>
                When you customize the game, all information is stored in the URL after the
                <code>#</code>. This information is kept in the browser. It is not sent back to the server.
              </p>
            </div>
          </details>

          <details class="faq">
            <summary>Is this open-source?</summary>
            <div class="faq-content">
              <p>
                Yes! The source code is
                <a href="https://github.com/zakkolar/tools.techlit.typing" target="_blank" rel="noopener">here</a>.
              </p>
            </div>
          </details>

          <details class="faq">
            <summary>Who made this?</summary>
            <div class="faq-content">
              <p>
                My name is Zak Kolar and I'm an educator. See more information
                <a href="https://techlit.tools/about/" target="_blank" rel="noopener">here</a>.
              </p>
            </div>
          </details>

          <details class="faq">
            <summary>Are there activities for other skills?</summary>
            <div class="faq-content">
              <p>Yes! Check out the collection <a href="https://techlit.tools/" target="_blank" rel="noopener">here</a>.</p>
            </div>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  padding-top: 64px;
}

.sheet {
  width: 100%;
  max-width: 720px;
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

h2 {
  font-size: 20px;
  letter-spacing: 0.01em;
}

.lede {
  color: var(--color-ink-soft);
  font-size: 16px;
  max-width: 60ch;
}

.block {
  margin-top: 28px;
}

code {
  font-family: var(--font-display);
  font-size: 0.9em;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  padding: 1px 5px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.action-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 1 auto;
}

.action {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 14px;
  text-align: center;
  border-radius: 6px;
  padding: 11px 14px;
  text-decoration: none;
  letter-spacing: 0.02em;
  white-space: nowrap;
}


.action.primary {
  background: var(--color-accent);
  color: var(--color-paper-raised);
}

.action.primary:hover {
  background: var(--color-accent-deep);
}

.action.secondary {
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  color: var(--color-accent-deep);
}

.action.secondary:hover {
  background: var(--color-accent-tint);
  border-color: var(--color-accent);
}

.faq-list {
  margin-top: 28px;
}

.faq {
  border-top: 1px solid var(--color-rule);
  padding: 16px 0;
}

.faq:last-child {
  border-bottom: 1px solid var(--color-rule);
}

.faq summary {
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 17px;
  color: var(--color-ink);
}


.faq-content {
  margin-top: 12px;
  padding-left: 1em;
  line-height: 1.65;
}

.faq-content > * + * {
  margin-top: 12px;
}

.faq-content p {
  max-width: 62ch;
}
</style>
