<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const posts = usePosts()

await posts.fetch()
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem
      v-for="post in posts.data"
      :key="post.id"
      v-bind="{ post }" />
  </div>
</template>
