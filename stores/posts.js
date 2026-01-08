export const usePosts = defineStore('posts', () => {
  const data = ref([])
  const pendingPosts = ref([])
  const loading = ref(false)

  const hasNewPosts = computed(() => pendingPosts.value.length > 0)

  async function fetch () {
    const { $api } = useNuxtApp()
    const response = await $api.get('/posts')
    data.value = response.data
  }

  async function poll () {
    const { $api } = useNuxtApp()

    try {
      const response = await $api.get('/posts')
      const newPosts = response.data

      if (data.value.length === 0) {
        data.value = newPosts
        return
      }

      const latestId = data.value[0]?.id
      const freshPosts = newPosts.filter(post => post.id > latestId)

      if (freshPosts.length > 0) {
        pendingPosts.value = freshPosts
      }
    } catch (e) {
      console.error('Failed to poll posts:', e)
    }
  }

  function loadNewPosts () {
    if (pendingPosts.value.length > 0) {
      data.value = [...pendingPosts.value, ...data.value]
      pendingPosts.value = []
    }
  }

  async function create ({ title, body, image = null }) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('body', body)

      if (image) {
        formData.append('image', image)
      }

      const response = await $api.post('/posts', formData)
      data.value.unshift(response.data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    pendingPosts,
    loading,
    hasNewPosts,
    fetch,
    poll,
    loadNewPosts,
    create
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
