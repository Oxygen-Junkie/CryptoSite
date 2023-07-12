<script setup lang="ts">
import { modals } from '~/types/enums'
import { useFlagStore } from '~/stores/flags'
import ItemPrivate from '~/types/itemPrivate'
import ItemPublic from '~/types/itemPublic'
import viewItemModal from '~/components/modal/viewItemModal.vue'
import addItemModal from '~/components/modal/addItemModal.vue'
import changeItemModal from '~/components/modal/changeItemModal.vue'

const props = defineProps<{
  modalMode: modals
  item?: ItemPrivate | ItemPublic
}>()

const { t } = useI18n()

const flags = useFlagStore()
</script>

<template>
  <div class="fixed left-100 z-20 max-h-full max-w-md w-full overflow-y-auto">
    <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
      <button
        type="button"
        class="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
        @click="flags.closeModal()"
      >
        <svg
          aria-hidden="true"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only">}{{t('modal.close')}}</span>
      </button>
      <div class="px-6 py-6 lg:px-8">
        <viewItemModal
          v-if="props.modalMode === modals.viewItemModal"
          :item="props.item as ItemPublic"
          @closed="flags.closeModal()"
        />
        <addItemModal
          v-else-if="props.modalMode === modals.addItemModal"
          @closed="flags.closeModal()"
        />
        <changeItemModal
          v-else-if="props.modalMode === modals.changeItemModal"
          :old-item="item as ItemPrivate"
          @closed="flags.closeModal()"
        />
      </div>
    </div>
  </div>
</template>
