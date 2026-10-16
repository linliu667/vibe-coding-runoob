<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = withDefaults(defineProps<{
  tasks: Task[]
  searchQuery?: string
}>(), {
  searchQuery: '',
})

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
}>()

const activeFilter = ref<'all' | TaskStatus>('all')

const filters: { id: 'all' | TaskStatus; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'todo', label: '待办' },
  { id: 'in-progress', label: '进行中' },
  { id: 'done', label: '完成' },
]

const sortedTasks = computed(() => [...props.tasks].sort((left, right) => {
  const leftTime = Date.parse(left.createdAt)
  const rightTime = Date.parse(right.createdAt)
  const safeLeftTime = Number.isNaN(leftTime) ? 0 : leftTime
  const safeRightTime = Number.isNaN(rightTime) ? 0 : rightTime

  return safeRightTime - safeLeftTime
}))

const visibleTasks = computed(() => {
  const query = props.searchQuery.trim().toLowerCase()

  return sortedTasks.value.filter((task) => {
    const matchesStatus = activeFilter.value === 'all' || task.status === activeFilter.value
    const matchesQuery = !query || `${task.title} ${task.description}`.toLowerCase().includes(query)

    return matchesStatus && matchesQuery
  })
})
</script>

<template>
  <div>
    <div class="flex gap-3 overflow-x-auto border-b border-slate-100 px-4 pt-3 dark:border-slate-800 sm:gap-5 sm:px-7 sm:pt-5" role="tablist" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        role="tab"
        :aria-selected="activeFilter === filter.id"
        class="min-h-11 whitespace-nowrap border-b-2 px-1 text-sm font-medium transition-colors"
        :class="activeFilter === filter.id ? 'border-indigo-600 text-indigo-700 dark:text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
        <span v-if="filter.id === 'all'" class="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-300">{{ props.tasks.length }}</span>
      </button>
    </div>

    <ul v-if="visibleTasks.length" class="divide-y divide-slate-100 dark:divide-slate-800">
      <li v-for="task in visibleTasks" :key="task.id" class="px-5 py-4 sm:px-7">
        <TaskCard :task="task" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
      </li>
    </ul>

    <div v-else-if="props.tasks.length === 0" class="px-6 py-16 text-center">
      <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-300">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v8m-4-4h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </span>
      <p class="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">还没有任务，点击下方按钮创建第一个吧</p>
    </div>

    <div v-else class="px-6 py-16 text-center">
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">没有找到符合条件的任务</p>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">试试其他关键词或筛选条件。</p>
    </div>

    <footer class="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-500 sm:px-7">
      显示 {{ visibleTasks.length }} 项任务
    </footer>
  </div>
</template>
