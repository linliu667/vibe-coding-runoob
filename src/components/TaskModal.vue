<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const isOpen = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  create: [task: Task]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref('')

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = ''
}

function closeModal() {
  isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(isOpen, (open) => {
  if (open) {
    resetForm()
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function submitTask() {
  const title = form.title.trim()

  if (!title) {
    titleError.value = '标题不能为空'
    return
  }

  const task: Task = {
    id: crypto.randomUUID(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: '',
    createdAt: new Date().toISOString(),
  }

  emit('create', task)
  closeModal()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      @click.self="closeModal"
    >
      <section
        class="max-h-[90dvh] w-full max-w-lg animate-[modal-slide-up_220ms_ease-out] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900 sm:animate-none sm:rounded-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="task-modal-title" class="text-xl font-semibold text-slate-900 dark:text-slate-100">新建任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">写下接下来要完成的事情。</p>
          </div>
          <button
            type="button"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭弹窗"
            @click="closeModal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="submitTask">
          <div>
            <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">标题 <span class="text-red-500">*</span></label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              maxlength="120"
              autofocus
              :aria-invalid="Boolean(titleError)"
              :aria-describedby="titleError ? 'task-title-error' : undefined"
              class="w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              :class="titleError ? 'border-red-400 focus:border-red-400 focus:ring-red-50 dark:border-red-500 dark:focus:ring-red-950' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-50 dark:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-950'"
              placeholder="例如：整理本周计划"
              @input="titleError = ''"
            />
            <p v-if="titleError" id="task-title-error" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ titleError }}</p>
          </div>

          <div>
            <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">描述 <span class="font-normal text-slate-400 dark:text-slate-500">（选填）</span></label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="3"
              maxlength="500"
              class="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
              placeholder="补充任务详情..."
            ></textarea>
          </div>

          <div>
            <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">优先级</label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              class="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              创建任务
            </button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>
