<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskModal from './components/TaskModal.vue'
import TaskList from './components/TaskList.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask as removeTask, taskStore, updateTask } from './stores/taskStore'
import type { Task, TaskStatus } from './types/task'

const tasks = taskStore.tasks

const searchQuery = ref('')
const isTaskModalOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const isMobileMenuOpen = ref(false)

const completedCount = computed(() => tasks.filter((task) => task.status === 'done').length)

function toggleTask(task: Task) {
  updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
}

function deleteTask(task: Task) {
  removeTask(task.id)
}

function createTask(task: Task) {
  addTask(task)
}

function changeTaskStatus(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="relative border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8" aria-label="主导航">
        <a class="flex items-center gap-3" href="#" aria-label="Vibe Coding Runoob 首页">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-950">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">Vibe Coding Runoob</span>
        </a>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 md:inline">一个更专注的每一天</span>
          <span class="hidden h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 sm:flex" aria-label="用户头像">V</span>
          <ThemeToggle />
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg v-if="!isMobileMenuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </nav>
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="absolute inset-x-0 top-full z-40 border-b border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden"
      >
        <a
          href="#tasks"
          class="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="isMobileMenuOpen = false"
        >
          我的任务
        </a>
        <button
          type="button"
          class="mt-1 flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="isTaskModalOpen = true; isMobileMenuOpen = false"
        >
          + 新建任务
        </button>
      </div>
    </header>

    <main id="tasks" class="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-8 sm:pt-14">
      <section class="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">星期五 · 10 月 16 日</p>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">我的任务</h1>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">把想法变成行动，一步一步完成今天的计划。</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 dark:border-indigo-900 dark:bg-indigo-950/50">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div>
              <p class="text-xs font-medium text-indigo-600 dark:text-indigo-300">完成进度</p>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ completedCount }} / {{ tasks.length }} 项已完成</p>
            </div>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            @click="isTaskModalOpen = true"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            新建任务
          </button>
        </div>
      </section>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20" aria-label="任务视图">
        <div class="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div class="inline-flex w-fit rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="任务视图">
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'list'"
              class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              :class="activeView === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-200' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
              @click="activeView = 'list'"
            >
              列表
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeView === 'kanban'"
              class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              :class="activeView === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-200' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
              @click="activeView = 'kanban'"
            >
              看板
            </button>
          </div>
          <label class="relative block w-full sm:w-56">
              <span class="sr-only">搜索任务</span>
              <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
                <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="搜索任务..."
                class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-950"
              />
          </label>
        </div>
        <TaskList
          v-if="activeView === 'list'"
          :tasks="tasks"
          :search-query="searchQuery"
          @toggle="toggleTask"
          @delete="deleteTask"
        />
        <KanbanBoard
          v-else
          :tasks="tasks"
          :search-query="searchQuery"
          @toggle="toggleTask"
          @delete="deleteTask"
          @status-change="changeTaskStatus"
        />
      </section>

      <p class="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">保持专注，进步自会发生。</p>
    </main>

    <TaskModal v-model:open="isTaskModalOpen" @create="createTask" />
  </div>
</template>
