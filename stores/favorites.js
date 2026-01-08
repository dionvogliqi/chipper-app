export const useFavorites = defineStore('favorites', () => {
  const users = ref([])
  const posts = ref([])

  const loading = ref(false)

  function isUserFavorited(userId) {
    return users.value.some(user => user.id === userId)
  }

  function isPostFavorited(postId) {
    return posts.value.some(post => post.id === postId)
  }

  function clear() {
    users.value = []
    posts.value = []
  }

  async function fetch() {
    const { $api } = useNuxtApp()

    try {
      const response = await $api.get('/favorites')
      users.value = response.data.users || []
      posts.value = response.data.posts || []
    } catch (e) {
      users.value = []
      posts.value = []
    }
  }

  async function addUser(userId, userName = null) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.post(`/users/${userId}/favorite`)
      users.value.push({ id: userId, name: userName })
    } finally {
      loading.value = false
    }
  }

  async function removeUser(userId) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.delete(`/users/${userId}/favorite`)
      users.value = users.value.filter(user => user.id !== userId)
    } finally {
      loading.value = false
    }
  }

  async function toggleUser(userId, userName = null) {
    if (isUserFavorited(userId)) {
      await removeUser(userId)
    } else {
      await addUser(userId, userName)
    }
  }

  async function addPost(postId) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.post(`/posts/${postId}/favorite`)
      posts.value.push({ id: postId })
    } finally {
      loading.value = false
    }
  }

  async function removePost(postId) {
    const { $api } = useNuxtApp()
    loading.value = true

    try {
      await $api.delete(`/posts/${postId}/favorite`)
      posts.value = posts.value.filter(post => post.id !== postId)
    } finally {
      loading.value = false
    }
  }

  async function togglePost(postId) {
    if (isPostFavorited(postId)) {
      await removePost(postId)
    } else {
      await addPost(postId)
    }
  }

  return {
    users,
    posts,
    loading,
    isUserFavorited,
    isPostFavorited,
    clear,
    fetch,
    addUser,
    removeUser,
    toggleUser,
    addPost,
    removePost,
    togglePost
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}
