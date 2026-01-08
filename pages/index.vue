<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const posts = usePosts()

await posts.fetch()

let pollInterval = null

onMounted(() => {
  pollInterval = setInterval(() => {
    posts.poll()
  }, 30000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

function handleLoadNewPosts() {
  posts.loadNewPosts()
}
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
  <button
    v-if="posts.hasNewPosts"
    class="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg mb-8 hover:bg-blue-600 transition-colors"
    @click="handleLoadNewPosts">
    Load New Posts
  </button>
  <div class="grid gap-16">
    <PostItem
      v-for="post in posts.data"
      :key="post.id"
      v-bind="{ post }" />
  </div>
</template>
