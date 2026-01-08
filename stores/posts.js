export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const data = ref([])

  const loading = ref(false)

  async function fetch () {
    const response = await $api.get('/posts')
    data.value = response.data
  }

  async function create ({ title, body }) {
    loading.value = true

    try {
      const response = await $api.post('/posts', { title, body })
      data.value.unshift(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    fetch,
    create
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
