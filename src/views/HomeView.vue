<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import ExternalLink from "@/components/ExternalLink.vue";

const origin = window.location.origin

const sampleGame = computed(()=> `${origin}/play#word=ChristopherRodriguez&capacity=10&showKeyboard=true&forceCorrectMistakes=true&sound=true&seconds=120&showTimer=true&showPlayAgain=false`)

const sampleClass = computed(()=> `${origin}/links#words=EmmaWalker%0AChristopherRodriguez%0AJamalOkafor%0ASofiaMartinez%0AMiaNguyen&labels=Emma%20W%0AChris%20R%0AJamal%20O%0ASofia%20M%0AMia%20N&title=Username%20Practice&instructions=Click%20on%20your%20name%20below%20to%20start%20practicing.&capacity=10&showKeyboard=true&forceCorrectMistakes=true&sound=true&seconds=120&showTimer=false&showPlayAgain=true`)

const openFaqs = reactive(new Set<string>())

function isFaqOpen(id: string) {
  return openFaqs.has(id)
}

function onFaqToggle(id: string, event: Event) {
  const details = event.target as HTMLDetailsElement
  if (details.open) {
    openFaqs.add(id)
  } else {
    openFaqs.delete(id)
  }
  history.replaceState({ ...history.state, openFaqs: [...openFaqs] }, '', location.href)
}

onMounted(() => {
  const savedOpenFaqs = (history.state as { openFaqs?: string[] } | null)?.openFaqs
  savedOpenFaqs?.forEach((id) => openFaqs.add(id))
})
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
            <router-link to="/build" class="btn btn-secondary">Set up game</router-link>
          </div>
        </div>
      <section class="block">
        <div class="faq-list">
          <details class="faq" :open="isFaqOpen('setup')" @toggle="onFaqToggle('setup', $event)">
            <summary>How do I set up the game?</summary>
            <div class="faq-content">
              <p>Build a link for each student with their username and game settings. Everything is stored in this game link - no need to create or manage accounts.</p>
              <p>There are three ways to do this:</p>

              <div class="setup-list">
                <div class="setup-row">
                  <p class="setup-title">Game link</p>
                  <div class="setup-body">
                    <p class="setup-desc">Enter the username and game settings for one student to build a game link. Copy the game link and share it directly with the student.</p>
                    <div class="setup-actions">
                      <router-link to="/build/game" class="btn btn-secondary btn-sm">Open link builder</router-link>
                      <ExternalLink :href="sampleGame" class="setup-example">Example game link</ExternalLink>
                    </div>
                  </div>
                </div>
                <div class="setup-row">
                  <p class="setup-title">Class link</p>
                  <div class="setup-body">
                    <p class="setup-desc">Enter a list of usernames and game settings to build a page with the game link for every student. Copy the class link and share it with your students.</p>
                    <div class="setup-actions">
                      <router-link to="/build/class" class="btn btn-secondary btn-sm">Open link builder</router-link>
                      <ExternalLink :href="sampleClass" class="setup-example">Example class link</ExternalLink>
                    </div>
                  </div>
                </div>
                <div class="setup-row">
                  <p class="setup-title">Build it manually</p>
                  <div class="setup-body">
                    <p class="setup-desc">For more advanced use-cases, such as generating custom links via a spreadsheet formula, follow the documentation below to build the game links yourself.</p>
                    <div class="setup-actions">
                      <router-link to="/build/manual" class="btn btn-secondary btn-sm">Open instructions</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
          <details class="faq" :open="isFaqOpen('long-usernames')" @toggle="onFaqToggle('long-usernames', $event)">
            <summary>What about students with long usernames?</summary>
            <div class="faq-content">
              <p>Each bar fills after a fixed number of letters (10 by default), not a full username. The length of the username does not impact the number of bars filled.</p>
              <div class="callout">
                <p class="callout-label">Example</p>
                <p class="callout-body">
                  <code>EmmaWalker</code> (10 letters) fills one bar and <code>ChristopherRodriguez</code> (20 letters) fills two.
                </p>
              </div>
            </div>
          </details>
          <details class="faq" :open="isFaqOpen('privacy')" @toggle="onFaqToggle('privacy', $event)">
            <summary>Is this privacy-friendly?</summary>
            <div class="faq-content">
              <p>Yes! This game runs entirely in your browser. No data is transmitted to me or any third parties.</p>
              <p>
                When you customize the game, all information is stored in the link after the
                <code>#</code>. This information is kept in the browser. It is not sent back to the server.
              </p>
            </div>
          </details>

          <details class="faq" :open="isFaqOpen('open-source')" @toggle="onFaqToggle('open-source', $event)">
            <summary>Is this open source?</summary>
            <div class="faq-content">
              <p>
                Yes! The source code is
                <ExternalLink href="https://github.com/zakkolar/tools.techlit.typing">here</ExternalLink>.
              </p>
            </div>
          </details>

          <details class="faq" :open="isFaqOpen('who-made-this')" @toggle="onFaqToggle('who-made-this', $event)">
            <summary>Who made this?</summary>
            <div class="faq-content">
              <p>
                My name is Zak Kolar and I'm an educator. See more information
                <ExternalLink href="https://techlit.tools/about/">here</ExternalLink>.
              </p>
            </div>
          </details>

          <details class="faq" :open="isFaqOpen('other-activities')" @toggle="onFaqToggle('other-activities', $event)">
            <summary>Are there activities for other skills?</summary>
            <div class="faq-content">
              <p>Yes! Check out the collection <ExternalLink href="https://techlit.tools/">here</ExternalLink>.</p>
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
  display: flex;
  flex-direction: column;
  margin: 0 0 1em;
}

.setup-row {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid var(--color-rule);
}

.setup-title {
  flex: 0 0 116px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  padding-top: 1px;
}

.setup-body {
  flex: 1 1 auto;
  min-width: 0;
}

.setup-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: 52ch;
  margin: 0 0 12px;
}

.setup-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.setup-example {
  font-size: 13px;
  color: var(--color-text-muted);
}

.setup-example:hover {
  color: var(--color-accent-deep);
}

@media (max-width: 560px) {
  .setup-row {
    flex-direction: column;
    gap: 8px;
  }

  .setup-title {
    flex-basis: auto;
  }
}
</style>
