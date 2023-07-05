<script setup lang="ts">
const props = defineProps<{
  heading: string
}>()

const emit = defineEmits<{
  (event: 'uploaded', image: File): void
}>()

const file = ref({
  name: 'Файл не загружен',
  size: '',
})

const loading = ref(false)

const statusz = ref({
  over: false,
  dropped: false,
})

function handleDragOver() {
  statusz.value.over = true
}
function handleDrop(payload: DragEvent) {
  const fileItem = payload.dataTransfer?.items[0].getAsFile()
  if (fileItem) {
    statusz.value.dropped = true
    statusz.value.over = false
    file.value = {
      name: fileItem.name,
      size: (fileItem.size / 1000).toFixed(2),
    }
    handleFileUpload(fileItem)
  }
}

function handleDragLeave() {
  statusz.value.over = false
}

async function handleFileUpload(fileItem: File) {
  emit('uploaded', fileItem)
}
</script>

<template>
  <section class="upload-container">
    <div class="upload-heading">
      <h2>{{ props.heading }}</h2>
    </div>

    <div
      class="upload-body"
      :class="{ 'upload-body-dragged': statusz.over }"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @dragleave="handleDragLeave"
    >
      <svg
        v-if="loading"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;"
        width="160px"
        height="105px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          fill="none"
          stroke="#486684"
          stroke-width="8"
          stroke-dasharray="42.76482137044271 42.76482137044271"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          stroke-linecap="round"
          style="transform: scale(0.8); transform-origin: 50px 50px; animation-play-state: running; animation-delay: 0s;"
        >
          <animate
            attributeName="stroke-dashoffset"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="0;256.58892822265625"
            style="animation-play-state: running; animation-delay: 0s;"
          />
        </path>
      </svg>
      <span v-else>{{ 'Перетащите фалы сюда' }}</span>
    </div>

    <div class="upload-footer">
      <div>
        <p class="upload-footer-file-name">
          {{ file.name }}
        </p>
        <small class="upload-footer-file-size">Вес: {{ file.size }} КБ</small>
      </div>

      <input type="file" class="upload-footer-button" accept="image/*" placeholder="Загрузить" @change="(payload) => { handleFileUpload((payload.target! as HTMLInputElement).files![0]) }">
    </div>
  </section>
</template>

<style scoped>
.upload-container {
border-radius: 0.25rem;
border: 1px solid#5d6369;
display: block;
margin: auto;
width: 100%;
}

.upload-heading,
.upload-footer {
background: #5d6369;
color: #fff;
padding: 1rem 2rem;
font-weight: 600;
}

.upload-body {
align-items: center;
background-color: #fafafa;
color: #5d6369;
  display: flex;
  font-size: 1.5rem;
justify-content: center;
min-height: 25vh;
}

.upload-footer {
display: flex;
justify-content: space-between;
align-items: center;
}

.upload-footer-file-name {
margin-bottom: 0.25rem;
}

.upload-footer-file-size {
opacity: 0.95;
}

.upload-footer-button {
background-color: transparent;
border: 2px solid #fff;
border-color: #fff;
border-radius: 0.25rem;
color: #fff;
cursor: pointer;
font-weight: 600;
padding: 0.5rem 1rem;

transition: 0.25s all;
}

.upload-footer-button:hover {
background-color: #fff;
color: #5d6369;
transition: 0.25s all;
}
</style>
