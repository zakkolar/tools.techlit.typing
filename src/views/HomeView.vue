<script setup lang="ts">
import { computed, ref } from 'vue'
import LinkBuilderTabs from '@/components/LinkBuilderTabs.vue'

const origin = window.location.origin

const sampleGame = computed(()=> `${origin}/play#word=JohnnyAppleseed&capacity=20&undoIncorrect=true&showKeyboard=true&forceCorrectMistakes=true&sound=true&seconds=120&showTimer=true&showPlayAgain=false`)

const setupDetails = ref<HTMLDetailsElement | null>(null)

function openSetupGuide() {
  const el = setupDetails.value
  if (!el) return
  el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="home">
    <div class="sheet">
      <h1>Username Typing Practice</h1>
      <p class="lede">
        In this simple game, students type their usernames over and over and fill as many bars as they can.</p>
        <p class="lede">Customize a link for each student and share it with them to play. No login needed.</p>

        <div class="actions">
          <div class="action-wrap">
            <a :href="sampleGame" class="btn btn-primary">Play sample game</a>
          </div>
          <div class="action-wrap">
            <button type="button" class="btn btn-secondary" @click="openSetupGuide">Build a link</button>
          </div>
        </div>
      <section class="block">
        <div class="faq-list">
          <details class="faq" ref="setupDetails">
            <summary>How do I set up the game?</summary>
            <div class="faq-content">
              <p>The username and other game settings are set in the link that you share with your students. This allows you to customize the game experience in a privacy-friendly way without having to manage student accounts.</p>
              <p>There are three ways to do this:</p>

              <ol class="setup-list">
                <li>
                  <b>Single link</b>
                  <span>Use the builder below to create one link for a specific student.</span>
                </li>
                <li>
                  <b>Class link</b>
                  <span>Use the builder below to create a list of links for your whole class on a single page. You can share this page with students directly so they can find their own names, or visit the page and copy each student's link to share with them separately.</span>
                </li>
                <li>
                  <b>Build it manually</b>
                  <span>For more advanced use-cases, such as generating custom links via a spreadsheet formula, follow the documentation below to build the game links yourself.</span>
                </li>
              </ol>
              <p>Use the tabs below to start building your links.</p>
              <LinkBuilderTabs />
            </div>
          </details>
          <details class="faq">
            <summary>What about students with long usernames?</summary>
            <div class="faq-content">
              <p>Each bar fills after a fixed number of letters (20 by default), not a full username. The length of the username does not impact the number of bars filled.</p>
              <div class="callout">
                <p class="callout-label">Example</p>
                <p class="callout-body">
                  <code>EmmaWalker</code> (10 letters) fills one bar and <code>ChristopherRodriguez</code> (20 letters) fills two.
                </p>
              </div>
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
            <summary>Is this open source?</summary>
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

.block {
  margin-top: 28px;
}

code {
  font-family: var(--font-display);
  font-size: 0.9em;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  padding: 1px 5px;
}

.callout {
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-left: 3px solid var(--color-accent);
  border-radius: 6px;
  padding: 12px 16px;
}

.callout-label {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent-deep);
  margin: 0 0 6px;
}

.callout-body {
  margin: 0;
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
  font-weight: 700;
  font-size: 17px;
  color: var(--color-text-secondary);
}


.faq-content {
  margin-top: 12px;
  padding-left: 1em;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.faq-content > * + * {
  margin-top: 12px;
}

.faq-content p {
  max-width: 62ch;
}

.setup-list {
  list-style: none;
  counter-reset: setup-step;
  margin: 0 0 1em;
  padding: 0;
}

.setup-list li {
  counter-increment: setup-step;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 10px 0;
  border-top: 1px solid var(--color-rule);
}

.setup-list li > b {
  flex: 0 0 150px;
}

.setup-list li > span {
  flex: 1;
  min-width: 0;
}

@media (max-width: 560px) {
  .setup-list li {
    flex-wrap: wrap;
  }

  .setup-list li > b {
    flex-basis: auto;
  }
}

.setup-list li:last-child {
  border-bottom: 1px solid var(--color-rule);
}

.setup-list li::before {
  content: counter(setup-step);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 0.1em;
  border-radius: 50%;
  background: var(--color-accent-tint);
  color: var(--color-accent-deep);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
}

.setup-list b {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-text-secondary);
}
</style>
