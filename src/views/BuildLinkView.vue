<script setup lang="ts">
import LinkBuilderTabs from '@/components/LinkBuilderTabs.vue'
</script>

<template>
  <div class="build-link">
    <div class="sheet">
      <router-link to="/" class="back-link">&larr; Back to home</router-link>
      <h1>Build a Link</h1>
      <p class="lede">
        Build a link for each student with their username and game settings. Everything is
        stored in the link - no need to create or manage accounts.
      </p>
      <LinkBuilderTabs />
    </div>
  </div>
</template>

<style scoped>
.build-link {
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

.back-link {
  display: inline-block;
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
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
</style>
