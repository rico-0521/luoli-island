<script setup lang="ts">
import { computed } from 'vue'

type Tab = { key: string; label: string }

const props = defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const onPick = (key: string) => emit('update:modelValue', key)

const activeIndex = computed(() => Math.max(0, props.tabs.findIndex((t) => t.key === props.modelValue)))
const activeSegmentLeft = computed(() => `${activeIndex.value * 50}%`)
</script>

<template>
  <div class="tabs" role="tablist" aria-label="会员类型">
    <button
      v-for="t in tabs"
      :key="t.key"
      class="tab"
      type="button"
      role="tab"
      :aria-selected="t.key === modelValue"
      :aria-label="t.label"
      @click="onPick(t.key)"
    >
      <span class="sr-only">{{ t.label }}</span>
    </button>
    <div class="bar" aria-hidden="true">
      <div class="active" :style="{ left: activeSegmentLeft }"></div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  height: calc(12px * var(--s));
  background: transparent;
  padding-bottom: 0;
}

.tab {
  appearance: none;
  border: 0;
  background: transparent;
  height: 100%;
  padding: 0;
  z-index: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.bar {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: calc(128px * var(--s));
  height: calc(12px * var(--s));
  background: rgba(255, 255, 255, 0.92);
  border-radius: calc(999px * var(--s));
  overflow: hidden;
}

.active {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: #9c1bff;
  border-radius: calc(999px * var(--s));
  transition: left 0.22s ease;
}
</style>

