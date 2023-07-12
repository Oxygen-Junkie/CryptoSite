<script setup lang="ts">
const emit = defineEmits<{
  (event: 'filter', query: string): void
  (event: 'cancel'): void
}>()

const { t } = useI18n()

const title = ref('')
const showCross = ref(false)

function cancel() {
  title.value = ''
  emit('cancel')
}

watchEffect(() => {
  if (title.value !== '') {
    showCross.value = true
    emit('filter', title.value)
  } else {
    showCross.value = false
    emit('cancel')
  }
})
</script>

<template>
  <div class="relative flex items-stretch mb-3">
    <div class="flex form-inputs">
      <input
        v-model="title"
        class="block form-inputs appearance-none py-1 px-2 mb-1 text-base leading-normal bg-whites border border-grey rounded"
        type="text"
        :placeholder="`${t('search')}...`"
      />
      <button v-if="showCross" @click="cancel">
        <strong class="y text-xl align-center cursor-pointer">&times;</strong>
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-inputs {
  position: relative;
  width: 20rem;
}

.form-inputs .form-control:focus {
  box-shadow: none;
  border: 0.0133rem solid #000;
}

.y {
  position: absolute;
  right: 0.0667rem;
  top: 0.027rem;
}
</style>
