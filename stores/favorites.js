export const useFavorites = defineStore('favorites', () => {
  const data = ref([])

  const loading = ref(false)

  function isFavorited(userId) {
    return data.value.some(user => user.id === userId)
  }

  function setFavorites(favorites) {
    data.value = favorites || []
  }

  function clear() {
    data.value = []
  }

  async function fetch() {
    const { $api } = useNuxtApp()

    try {
      const response = await $api.get('/favorites')
      data.value = response.data.users || []
    } catch (e) {
      data.value = []
    }
  }

  async function add(userId, userName = null) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.post(`/users/${userId}/favorite`)
      data.value.push({ id: userId, name: userName })
    } finally {
      loading.value = false
    }
  }

  async function remove(userId) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.delete(`/users/${userId}/favorite`)
      data.value = data.value.filter(user => user.id !== userId)
    } finally {
      loading.value = false
    }
  }

  async function toggle(userId, userName = null) {
    if (isFavorited(userId)) {
      await remove(userId)
    } else {
      await add(userId, userName)
    }
  }

  return {
    data,
    loading,
    isFavorited,
    setFavorites,
    clear,
    fetch,
    add,
    remove,
    toggle
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}
