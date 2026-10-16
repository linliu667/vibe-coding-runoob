import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasStoredTasks, loadTasks, saveTasks } from '../utils/storage'

function createSampleTasks(): Task[] {
  const now = Date.now()
  const dueDate = (daysFromNow: number) => new Date(now + daysFromNow * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const createdAt = (daysAgo: number) => new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: 'sample-task-1',
      title: '梳理产品首页的信息架构',
      description: '整理核心用户路径与页面层级，确定首屏需要呈现的关键内容。',
      status: 'in-progress',
      priority: 'high',
      dueDate: dueDate(1),
      createdAt: createdAt(4),
    },
    {
      id: 'sample-task-2',
      title: '完成任务卡片的视觉稿',
      description: '探索简洁清晰的卡片布局，并补充不同任务状态的视觉规范。',
      status: 'todo',
      priority: 'medium',
      dueDate: dueDate(3),
      createdAt: createdAt(2),
    },
    {
      id: 'sample-task-3',
      title: '搭建 Vue 项目基础结构',
      description: '初始化页面入口、样式系统和项目目录。',
      status: 'done',
      priority: 'low',
      dueDate: dueDate(-1),
      createdAt: createdAt(6),
    },
  ]
}

const initialTasks = hasStoredTasks() ? loadTasks() : createSampleTasks()

export const taskStore = reactive({
  tasks: initialTasks,
})

watch(
  () => taskStore.tasks,
  saveTasks,
  { deep: true, immediate: true },
)

export function addTask(task: Task): void {
  taskStore.tasks.push(task)
}

export function updateTask(taskId: string, updates: Partial<Omit<Task, 'id'>>): void {
  const task = taskStore.tasks.find((item) => item.id === taskId)

  if (task) {
    Object.assign(task, updates)
  }
}

export function deleteTask(taskId: string): void {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === taskId)

  if (taskIndex !== -1) {
    taskStore.tasks.splice(taskIndex, 1)
  }
}
