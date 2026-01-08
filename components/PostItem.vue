<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const user = useUser()
const favorites = useFavorites()

const isFavorited = computed(() => favorites.isFavorited(props.post.user.id))

const buttonLabel = computed(() => isFavorited.value ? 'Unfollow' : 'Follow')

async function toggleFavorite() {
  await favorites.toggle(props.post.user.id, props.post.user.name)
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
        :class="isFavorited ? 'bg-gray-300 text-gray-700' : 'bg-blue-200 text-blue-700'"
        :disabled="favorites.loading"
        @click="toggleFavorite">
        {{ buttonLabel }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <HeartIcon
        class="h-6 stroke-current" />
      <span class="font-bold">
        Add to my favorites
      </span>
    </button>
  </div>
</template>