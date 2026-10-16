<script setup lang="ts">
import type { Task } from '../types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
}>()

function formatDueDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const priorityStyles = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-500',
}

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}
</script>

<template>
  <article
    class="group flex items-start gap-3 rounded-xl border border-slate-200 border-l-4 bg-white p-3 shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 sm:p-4"
    :class="priorityStyles[props.task.priority]"
  >
    <button
      type="button"
      role="checkbox"
      class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      :class="props.task.status === 'done'
        ? 'border-indigo-600 bg-indigo-600 text-white'
        : 'border-slate-300 bg-white text-transparent hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-800'"
      :aria-checked="props.task.status === 'done'"
      :aria-label="props.task.status === 'done' ? '标记为未完成' : '标记为完成'"
      @click="emit('toggle', props.task)"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="min-w-0 flex-1">
      <h3
        class="break-words text-sm font-semibold text-slate-800 dark:text-slate-100"
        :class="props.task.status === 'done' ? 'text-slate-400 dark:text-slate-500 line-through' : ''"
      >
        {{ props.task.title }}
      </h3>
      <p class="mt-1.5 whitespace-pre-line break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
        {{ props.task.description }}
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
        <span v-if="props.task.dueDate" class="inline-flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2.25" y="3.5" width="11.5" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" />
            <path d="M5 2v3M11 2v3M2.5 6.5h11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
          </svg>
          截止 {{ formatDueDate(props.task.dueDate) }}
        </span>
        <span
          class="rounded-full px-2 py-0.5 font-medium"
          :class="{
            'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300': props.task.priority === 'high',
            'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300': props.task.priority === 'medium',
            'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300': props.task.priority === 'low',
          }"
        >
          {{ priorityLabels[props.task.priority] }}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-300 dark:focus-visible:ring-offset-slate-900"
      :aria-label="`删除任务：${props.task.title}`"
      @click="emit('delete', props.task)"
    >
      <span aria-hidden="true">×</span>
    </button>
  </article>
</template>
