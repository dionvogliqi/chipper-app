<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const user = useUser()
const favorites = useFavorites()

const isUserFavorited = computed(() => favorites.isUserFavorited(props.post.user.id))
const isPostFavorited = computed(() => favorites.isPostFavorited(props.post.id))

const followButtonLabel = computed(() => isUserFavorited.value ? 'Unfollow' : 'Follow')
const favoriteButtonLabel = computed(() => isPostFavorited.value ? 'Remove from favorites' : 'Add to my favorites')

async function toggleUserFavorite() {
  await favorites.toggleUser(props.post.user.id, props.post.user.name)
}

async function togglePostFavorite() {
  await favorites.togglePost(props.post.id)
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button
        v-if="!user.isGuest"
        class="font-medium text-sm px-2 rounded-full transition-colors"
        :class="isUserFavorited ? 'bg-gray-300 text-gray-700' : 'bg-blue-200 text-blue-700'"
        :disabled="favorites.loading"
        @click="toggleUserFavorite">
        {{ followButtonLabel }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button
      v-if="!user.isGuest"
      class="flex items-center justify-center gap-2 p-4 rounded-lg transition-colors"
      :class="isPostFavorited ? 'bg-red-500 text-white' : 'bg-red-200 text-red-500'"
      :disabled="favorites.loading"
      @click="togglePostFavorite">
      <HeartIconSolid
        v-if="isPostFavorited"
        class="h-6" />
      <HeartIcon
        v-else
        class="h-6 stroke-current" />
      <span class="font-bold">
        {{ favoriteButtonLabel }}
      </span>
    </button>
  </div>
</template>
