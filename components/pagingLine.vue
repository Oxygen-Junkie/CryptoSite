<script setup lang="ts">
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  itemsOnPage: {
    items: ItemPublic[] | ItemPrivate[]
  }[]

  pagingIndex: number
}>()

const emit = defineEmits<{
  (event: 'changePageTo', pagingIndexEq: number): void
  (event: 'changePageBy', pagingIndexDif: number): void
}>()
</script>

<template>
  <nav
    v-if="props.itemsOnPage.length < 2"
    class="isolate inline-flex -space-x-px rounded-md shadow-sm"
    aria-label="Pagination"
  >
    <a
      href="#"
      class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
    >
      <span class="sr-only">Прошлая</span>
      <svg
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
    <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
    <a
      v-if="props.pagingIndex > 2"
      href="#"
      aria-current="page"
      class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="emit('changePageTo', 0)"
      >1</a
    >
    <a
      v-if="props.itemsOnPage[props.pagingIndex - 2]"
      href="#"
      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      @click="emit('changePageBy', -2)"
      >{{ props.pagingIndex - 1 }}</a
    >
    <a
      v-if="props.itemsOnPage[props.pagingIndex - 1]"
      href="#"
      class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
      @click="emit('changePageBy', -1)"
      >{{ props.pagingIndex }}</a
    >
    <span
      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
      >...</span
    >
    // eslint-disable-next-line vue/no-parsing-error
    <a
      href="#"
      class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
      >{{ props.pagingIndex + 1 }}</a
    >
    // eslint-disable-next-line vue/no-parsing-error
    <a
      href="#"
      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      @click="props.pagingIndex + 1"
      >{{ props.pagingIndex + 2 }}</a
    >
    <a
      href="#"
      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      @click="emit('changePageTo', Number(props.itemsOnPage.lastIndexOf))"
      >{{ Number(props.itemsOnPage?.lastIndexOf) + 1 }}</a
    >
    <a
      href="#"
      class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
    >
      <span class="sr-only">Следующая</span>
      <svg
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  </nav>
</template>
