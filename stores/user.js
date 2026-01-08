import { find, uniq, get } from 'lodash-es'

export const useUser = defineStore('user', () => {
  const { $api } = useNuxtApp()

  const { getCookieParams } = useHelpers()

  const started = ref(false)

  const data = ref({})

  const token = ref(null)

  const tokenCookie = useCookie('jwt', getCookieParams())

  const isGuest = computed(() => !Object.keys(data.value).length)

  const name = computed(() => isGuest.value ? null : data.value.name)

  async function start (payload) {
    started.value = true
    data.value = payload.data
    token.value = payload.token

    tokenCookie.value = payload.token

    const favorites = useFavorites()
    await favorites.fetch()
  }

  function clear () {
    data.value = {}
    token.value = null
    tokenCookie.value = null

    const favorites = useFavorites()
    favorites.clear()
  }

  async function login ({ email, password }) {
    const payload = await $api.post('/login', { email, password })
    start(payload)
  }

  async function register ({ name, email, password }) {
    const payload = await $api.post('/register', {
      name,
      email,
      password,
      password_confirmation: password
    })

    start(payload)
  }

  async function validate () {
    // Skip if the browser does not have a "jwt" cookie or the session has already started
    if (!tokenCookie.value || started.value) return

    try {
      const payload = await $api.get('/session')
      start(payload)
    } catch (e) {
      clear()
    }
  }

  async function logout () {
    await $api.post('/logout')
    clear()
  }

  return {
    started,
    data,
    token,
    isGuest,
    name,
    login,
    register,
    validate,
    logout
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
