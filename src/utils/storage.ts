import type { Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {}
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    if (storedTasks === null) {
      return []
    }

    const tasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(tasks) ? tasks as Task[] : []
  } catch {
    return []
  }
}

export function hasStoredTasks(): boolean {
  try {
    return localStorage.getItem(TASKS_STORAGE_KEY) !== null
  } catch {
    return false
  }
}
