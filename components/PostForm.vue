<script setup>
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const posts = usePosts()

const title = ref('')
const body = ref('')
const image = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    image.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  image.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function submit() {
  await posts.create({
    title: title.value,
    body: body.value,
    image: image.value
  })

  title.value = ''
  body.value = ''
  removeImage()
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <input
      v-model="title"
      placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange">

    <div
      v-if="imagePreview"
      class="relative inline-block">
      <img
        :src="imagePreview"
        alt="Preview"
        class="max-h-48 rounded-lg object-cover">
      <button
        type="button"
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        @click="removeImage">
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>

    <div class="flex gap-4">
      <button
        type="button"
        class="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        @click="triggerFileInput">
        <PhotoIcon class="h-5 w-5" />
        <span>Add Image</span>
      </button>
      <button
        :disabled="posts.loading"
        class="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">
        Post
      </button>
    </div>
  </form>
</template>
