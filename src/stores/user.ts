import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { User } from '@/database/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user')!)
  }

  const setUser = (value: User | null) => {
    user.value = value
  }

  watch(user, (value) => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value))
    }
  })

  return {
    user,
    setUser
  }
})
