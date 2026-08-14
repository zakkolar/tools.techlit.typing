<script setup lang="ts">
import { computed, ref } from 'vue'
import SingleLinkBuilder from '@/components/SingleLinkBuilder.vue'
import ClassListBuilder from '@/components/ClassListBuilder.vue'
import UrlExample from '@/components/UrlExample.vue'
import ParametersTable from '@/components/ParametersTable.vue'
import { wordSettingsFields } from '@/data/settingsFields'

type TabId = 'single' | 'class' | 'manual'

const tabs: { id: TabId; label: string }[] = [
  { id: 'single', label: 'Game link' },
  { id: 'class', label: 'Class list' },
  { id: 'manual', label: 'Build it manually' },
]

const activeTab = ref<TabId>('single')

const origin = window.location.origin
const singleParamExample = computed(() => `${origin}/play#word=JohnnyAppleseed`)
const multiParamExample = computed(() => `${origin}/play#word=JohnnyAppleseed&sound=true`)
</script>

<template>
  <div class="link-builder-tabs">
    <div class="tab-list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-panel" role="tabpanel" v-if="activeTab === 'single'">
      <SingleLinkBuilder />
    </div>

    <div class="tab-panel" role="tabpanel" v-else-if="activeTab === 'class'">
      <ClassListBuilder />
    </div>

    <div class="tab-panel" role="tabpanel" v-else>
      <p>
        You can build links yourself (e.g. with a spreadsheet formula) by passing the settings into the end of the URL. Parameters go after a <code>#</code>, written as
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
      <ParametersTable :fields="wordSettingsFields" />
    </div>
  </div>
</template>

<style scoped>
.link-builder-tabs {
  margin-top: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-top: 3px solid var(--color-accent);
  border-radius: 6px;
  padding: 6px 20px 20px;
}

.tab-list {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--color-rule);
  margin: 0 -20px 20px;
  padding: 0 20px;
}

.tab {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 12px 4px 10px;
  margin-right: 16px;
  margin-bottom: -1px;
  cursor: pointer;
  font-weight: bold;
}

.tab:hover {
  color: var(--color-text);
}

.tab.active {
  color: var(--color-accent-deep);
  border-bottom-color: var(--color-accent);
}

.tab-panel > p {
  max-width: 62ch;
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.tab-panel > * + * {
  margin-top: 12px;
}
</style>
