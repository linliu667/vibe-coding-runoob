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
  statusChange: [taskId: string, status: TaskStatus]
}>()

const columns: { status: TaskStatus; label: string; marker: string }[] = [
  { status: 'todo', label: '待办', marker: 'bg-slate-400' },
  { status: 'in-progress', label: '进行中', marker: 'bg-indigo-500' },
  { status: 'done', label: '已完成', marker: 'bg-emerald-500' },
]

const dragOverStatus = ref<TaskStatus | null>(null)

const visibleTasks = computed(() => {
  const query = props.searchQuery.trim().toLowerCase()

  return [...props.tasks]
    .filter((task) => !query || `${task.title} ${task.description}`.toLowerCase().includes(query))
    .sort((left, right) => {
      const leftTime = Date.parse(left.createdAt)
      const rightTime = Date.parse(right.createdAt)
      const safeLeftTime = Number.isNaN(leftTime) ? 0 : leftTime
      const safeRightTime = Number.isNaN(rightTime) ? 0 : rightTime

      return safeRightTime - safeLeftTime
    })
})

const tasksByStatus = computed<Record<TaskStatus, Task[]>>(() => ({
  todo: visibleTasks.value.filter((task) => task.status === 'todo'),
  'in-progress': visibleTasks.value.filter((task) => task.status === 'in-progress'),
  done: visibleTasks.value.filter((task) => task.status === 'done'),
}))

function startDrag(event: DragEvent, task: Task) {
  if (!event.dataTransfer) {
    return
  }

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
}

function dropTask(event: DragEvent, status: TaskStatus) {
  const taskId = event.dataTransfer?.getData('text/plain')
  const task = props.tasks.find((item) => item.id === taskId)

  dragOverStatus.value = null

  if (task && task.status !== status) {
    emit('statusChange', task.id, status)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-3 md:gap-5 md:p-5">
    <section
      v-for="column in columns"
      :key="column.status"
      class="min-w-0 rounded-xl border p-3 transition-colors sm:p-4"
      :class="dragOverStatus === column.status ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-950/60' : 'border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/70'"
      :aria-label="`${column.label}任务`"
      @dragover.prevent="dragOverStatus = column.status"
      @drop.prevent="dropTask($event, column.status)"
      @dragleave="dragOverStatus = null"
    >
      <header class="mb-3 flex items-center justify-between px-1">
        <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span class="h-2 w-2 rounded-full" :class="column.marker"></span>
          {{ column.label }}
        </h2>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">
          {{ tasksByStatus[column.status].length }}
        </span>
      </header>

      <div class="min-h-28 space-y-3 rounded-lg">
        <div
          v-for="task in tasksByStatus[column.status]"
          :key="task.id"
          class="cursor-grab active:cursor-grabbing"
          draggable="true"
          :aria-label="`拖动任务：${task.title}`"
          @dragstart="startDrag($event, task)"
          @dragend="dragOverStatus = null"
        >
          <TaskCard :task="task" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
        </div>

        <p
          v-if="tasksByStatus[column.status].length === 0"
          class="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500"
        >
          {{ visibleTasks.length ? '拖动任务到这里' : '暂无任务' }}
        </p>
      </div>
    </section>
  </div>
</template>
