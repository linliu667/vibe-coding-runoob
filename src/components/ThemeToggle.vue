<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const storageKey = 'vibe-coding-runoob-theme'

function getInitialTheme() {
  try {
    const storedTheme = localStorage.getItem(storageKey)

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme === 'dark'
    }
  } catch {}

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

const isDark = ref(getInitialTheme())

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()

  try {
    localStorage.setItem(storageKey, isDark.value ? 'dark' : 'light')
  } catch {}
}

onBeforeMount(applyTheme)
</script>

<template>
  <button
    type="button"
    class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-300"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
    </svg>
    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
