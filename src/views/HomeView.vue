<script setup lang="ts"></script>

<template>
  <div class="home">
    <div class="sheet">
      <h1>Typing Practice</h1>
      <p class="lede">
        In this typing game, students type a single word or phrase over and over to see how many
        times they can get it right. Designed for younger students to practice typing their
        usernames.
      </p>
    </div>
  </div>
</template>

<style scoped>
.home {
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
  margin-bottom: 0;
}
</style>
