import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import { modals } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'
import type ItemPublic from '~/types/itemPublic'

export const useFlagStore = defineStore('flag', () => {
  const modal = ref(false)
  const modalMode = ref(modals.addItemModal)
  const item: Ref<ItemPublic | ItemPrivate | undefined> = ref()

  function openModal(modalModes: modals, itemz?: ItemPublic | ItemPrivate) {
    if (itemz)
      item.value = itemz
    modalMode.value = modalModes
    modal.value = true
  }

  function closeModal() {
    modal.value = false
    modalMode.value = modals.addItemModal
    if (item.value)
      item.value = undefined
  }

  return {
    modal,
    openModal,
    item,
    closeModal,
    modalMode,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFlagStore as any, import.meta.hot))
