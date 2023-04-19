import { defineStore } from 'pinia'
import { Web3Provider } from '@ethersproject/providers'
import { Delivery, Delivery__factory } from '../types/typechain'

const contractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'

export const useDStateStore = defineStore('dstate', () => {
  let dealProgram: Delivery
  const alert = ref('')
  const loadingDeals = ref(false)

  function reEngageInDeals(provider: Web3Provider) {
    setDealLoader(true)
    try {
      dealProgram = Delivery__factory.connect(contractAddress, provider)
      setDealLoader(false)
    }
    catch (e) {
      setDealLoader(false)
      // console.log('e', e)
    }
  }

  function setDealLoader(value: boolean) {
    loadingDeals.value = value
  }

  return {
    alert,
    reEngageInDeals,
  }
})
