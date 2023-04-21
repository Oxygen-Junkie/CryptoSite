<script setup lang="ts">
import { useStateStore } from '../store/state'
import Deal from '../types/deal'
import { dealPaletteMode, dealState } from '../types/enums'

import ItemPrivate from '../types/itemPrivate'
import ItemPublic from '../types/itemPublic'

const props = defineProps<{ deal: Deal; mode: dealPaletteMode; item: ItemPrivate | ItemPublic }>()

const state = useStateStore()
const currency = state.getCurrency()

const dealText: Ref<{
  title: string
  state: string
  place: string
  time: string
  cost: string
  button: string
}> = ref({ title: '', state: '', place: '', time: '', cost: '', button: '' })

function setForB() {
  dealText.value.title = `Покупка товара ${props.item.name} в количестве ${props.deal.amount} шт.`
  switch (props.deal.state) {
    case dealState.Created: {
      dealText.value.state = 'Сделка ожидает подтверждения'
      break
    }
    case dealState.Agreed: {
      dealText.value.state = 'Сделка подтверждена продавцом'
      dealText.value.place = props.deal.time!
      dealText.value.time = props.deal.place!
      break
    }
    case dealState.Complete: {
      dealText.value.state = 'Продавец в процессе получения оплаты'
      break
    }
    case dealState.Aborted: {
      dealText.value.state = 'Вы отменили сделку'
      break
    }
  }
  dealText.value.cost = `Стоимость заказа ${Number(props.item.price / currency.eth * currency.rub).toFixed(2)} Руб. в валютном эквиваленте Eth/Эфира.`
}

async function setForS() {
  dealText.value.title = `Покупка товара ${props.item.name} в количестве ${props.deal.amount} шт.`
  switch (props.deal.state) {
    case dealState.Created: {
      dealText.value.state = 'Сделка ожидает подтверждения'
      break
    }
    case dealState.Agreed: {
      dealText.value.state = 'Сделка подтверждена продавцом'
      dealText.value.place = props.deal.time!
      dealText.value.time = props.deal.place!
      break
    }
    case dealState.Complete: {
      dealText.value.state = 'Продавец в процессе получения оплаты'
      break
    }
    case dealState.Aborted: {
      dealText.value.state = 'Вы отменили сделку'
      break
    }
  }
  dealText.value.cost = `Стоимость заказа ${Number(props.item.price / await state.ethPrice / ).toFixed(2)} $ в валютой форме Eth/Эфира.`
}

function buyDealAction() {
  state.bDealActions()
}

function sellDealAction() {

}
</script>

<template>
  <Container v-if="props.mode === dealPaletteMode.buyDeal">
    <h4>
      <ion-icon name="chevron-forward-outline" />&nbsp; Покупка товара Дрель в количестве 1 шт.
    </h4>
    <h6>Сделка ожидает подтверждения</h6>
    <p class="card-text text-muted">
      Стоимость за заказ 700 руб.
    </p>
    <button
      type="button" class="btn rounded btn-danger w-50" data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Отменить сделку
    </button>
  </Container>
  //////////////////////////////////////////////////////
  <Container v-if="props.mode === dealPaletteMode.sellDeal">
    <h4><ion-icon name="send-outline" />&nbsp; Запрос на продажу в количестве 10 шт.</h4>
    <p class="card-text text-muted">
      Место <input type="text" class="w-50" placeholder="проспект Столыпина, дом 1, квартира 9"> &nbsp; Время <input type="text" placeholder="Пн-Пт с 9:00 до 18:00">
    </p>
    <button type="button" class="btn rounded btn-danger w-50">
      Согласиться на продажу
    </button>
  </Container>
  <Container>
    <h4><ion-icon name="cash-outline" />&nbsp; Активная сделка на продажу в количестве 10 шт.</h4>
    Код:<span class="text-danger">
      412178
    </span>
  </Container>
</template>
