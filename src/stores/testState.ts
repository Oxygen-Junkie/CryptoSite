/* eslint-disable require-await */
/* eslint-disable import/named */
/* eslint-disable camelcase */

/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import { BigNumberish } from 'ethers'
import IPFS from '~~/tools/IPFS'
import User from '~~/types/user'
import ItemPublic from '~~/types/itemPublic'
import ItemPrivate from '~~/types/itemPrivate'
import Deal from '~~/types/deal'
import {
  bDealAction,
  dealPaletteMode,
  dealState,
  reputation,
  sDealAction,
} from '~~/types/enums'
import Currency from '~~/types/currency'
import {
  Delivery,
  Delivery__factory,
  StoreUsers,
  StoreUsers__factory,
} from '~~/types/typechain'
import Tag from '~~/types/tag'

const userContractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storeContractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = localStorage.getItem('user')

export const useStateStore = defineStore('state', () => {
  let isUserLogged = false
  const loadingUser = ref(false)
  const loadingItems = ref(false)
  const loadingDeals = ref(false)
  let user: User = storedUser ? JSON.parse(storedUser) : null
  let store: StoreUsers
  let dealProgram: Delivery
  const userAddress = ''
  let itemList: ItemPublic[]
  let tagList: Tag[]
  const alert = ref('')
  let currency: Currency

  async function determineCurrency() {
    if (localStorage.getItem('currency')) {
      currency = JSON.parse(localStorage.getItem('currency')!) as Currency
    } else {
      currency = new Currency()
      currency.rub = 85
      currency.eth = 1850
      localStorage.setItem('currency', JSON.stringify(currency))
    }
  }

  async function connectWallet() {
    try {
      const tag1: Tag = {
        imageURL: 'https://divandi.ru/public/images/articles/2021/032/001.jpg',
        name: 'Строительные инструменты',
        id: 1,
        items: [],
      }
      const tag2: Tag = {
        imageURL:
          'https://fs01.cap.ru//www21/kozlov/news/2021/05/13/ffce736e-f8cc-4e2c-880b-5546b675b9c2/pokupka-tovarov_df3o0apg.jpg',
        name: 'Поддержанный товар',
        id: 2,
        items: [],
      }
      const tag3: Tag = {
        imageURL: 'https://www.rektor.ru/img/rektor-img22-03-04-17.jpg',
        name: 'Компьютерная периферия',
        id: 3,
        items: [],
      }
      const item1: ItemPublic = {
        id: '',
        name: 'AMD 486DX5 Am5 x86',
        imageCID: 'bafkreifmptnxmighn34tfi5wnwqygixnl6yljs4r5ivife27js3rnzlh54',
        availability: 10,
        price: 4,
        producer: 'США',
        hidden: false,
        seller: 'gjksljgklwejr',
        defaultPlace: 'улица Астраханская, 1а',
        sellerReputation: reputation.None,
        schedule: [new Date(2023, 9, 2, 9, 10), new Date(2023, 9, 3, 11, 30)],
        tag: [tag3, tag2],
        description: '6 ядер x 4700-5300 МГц Объем кэша L2/L3 6 МБ/32 МБ',
      }

      const item2: ItemPublic = {
        id: '',
        name: 'УШМ (болгарка) MAKITA GA5030',
        imageCID: 'QmPXNYLQTakZmBQ691dyQn5pF4nWQXNF82BwbJFPKBsvcR',
        availability: 7,
        price: 7,
        producer: 'Индия',
        hidden: false,
        seller: 'gjksljgklwejr',
        defaultPlace: 'улица Высокая, 2б',
        sellerReputation: reputation.None,
        schedule: [new Date(2023, 8, 2, 12, 10), new Date(2023, 8, 10, 11, 30)],
        tag: [tag1],
        description:
          'Вес брутто: 3.34 кг Вес нетто: 1.8 кг Резьба шпинделя: М14',
      }

      const item3: ItemPublic = {
        id: '',
        name: 'Видеокарта KFA2 GeForce 210',
        imageCID: 'QmTraHi8PSzsEvFcqPoFucgQhmbNrAEL4bwYGpyVSLkh4A',
        availability: 20,
        price: 20,
        producer: 'США',
        hidden: false,
        seller: 'gjksljgklwejr',
        defaultPlace: 'улица Радищева, 3',
        sellerReputation: reputation.FewDeals,
        schedule: [new Date(2023, 8, 2, 12, 10), new Date(2023, 8, 10, 11, 30)],
        tag: [tag3],
        description:
          'Видеокарта KFA2 GeForce 210 [21GGF4HI00NK] представляет собой компактный графический модуль в виде платы расширения, который станет отличным дополнением для вашего домашнего или офисного компьютера, обеспечивая его более высокую производительность в различных графических задачах. Основой модели является вычислительный блок, выполненный по микроархитектуре Tesla, а также 1 ГБ видеопамяти, что позволит вам комфортно выполнять различные базовые задачи. Кроме того, графический ускоритель также отличается невысокими рабочими температурами, что обусловлено эффективной системой воздушного охлаждения.',
      }

      tagList = [tag1, tag2, tag3]

      itemList = [item1, item2, item3]

      user = {
        buyDeals: [
          new Deal(
            1,
            1,
            dealState.Created,
            '',
            item3,
            [new Date()],
            new Date(),
            'улица Астраханская, 1а',
            { buyer: true, seller: true }
          ),
        ],
        cryptoAddress: '',
        postedItems: [item2 as unknown as ItemPrivate],
        sellDeals: [
          new Deal(
            2,
            1,
            dealState.Agreed,
            '',
            item2,
            [new Date()],
            new Date(),
            'улица Высокая, 2б',
            { buyer: true, seller: true }
          ),
          new Deal(
            3,
            1,
            dealState.Aborted,
            '',
            item2,
            [new Date()],
            new Date(),
            'улица Высокая, 2б',
            { buyer: true, seller: true }
          ),
        ],
        vaultHash: '',
      }
      isUserLogged = true
    } catch (error) {
      console.log(error)
    }
  }

  async function authUser() {
    setUserLoader(true)
    setItemLoader(true)
  }

  async function authThroughIPFS() {}

  async function createIPFSRecord() {}

  async function addItem(item: ItemPrivate, image: any) {
    setUserLoader(true)
  }

  async function changeItem(item: ItemPrivate, image: any) {
    setUserLoader(true)
  }

  async function getReputationValueOfUser(address: string) {}

  async function updatePersonalInfo() {
    setUserLoader(true)

    setUserLoader(false)
  }

  function setUserLoader(value: boolean) {
    loadingUser.value = value
  }

  function setItemLoader(value: boolean) {
    loadingItems.value = value
  }

  function setDealLoader(value: boolean) {
    loadingDeals.value = value
  }

  async function personalToPublic(item: ItemPrivate) {
    const itemP: ItemPublic = item as unknown as ItemPublic

    return itemP
  }

  async function updateItemList() {
    setItemLoader(true)

    setItemLoader(false)
  }

  async function updateTagList() {
    setItemLoader(true)

    setItemLoader(false)
  }

  async function updateTags(changedTags: Tag[]) {
    setItemLoader(true)

    setItemLoader(false)
  }

  function getItems() {
    return { itemList, tagList }
  }

  async function scanDeals() {
    setDealLoader(true)
    setDealLoader(false)
  }

  async function bDealActions(
    actionId: bDealAction,
    item?: ItemPublic,
    amount?: number,
    code?: string,
    complaint?: string,
    schedule?: Date[],
    dealZ?: Deal
  ) {}

  async function sDealActions(
    actionId: sDealAction,
    dealZ: Deal,
    place?: string,
    time?: Date
  ) {}

  async function getBuyersSchedule(id: BigNumberish) {}

  async function getPayCode(dealId: BigNumberish) {}

  function getCurrency() {
    return currency
  }

  async function changeSync(
    deal: Deal,
    sync: boolean,
    dealType: dealPaletteMode
  ) {}

  return {
    setUserLoader,
    loadingUser,
    setItemLoader,
    loadingItems,
    connectWallet,
    addItem,
    getReputationValueOfUser,
    alert,
    getItems,
    isUserLogged,
    scanDeals,
    bDealActions,
    sDealActions,
    loadingDeals,
    determineCurrency,
    getCurrency,
    user,
    getPayCode,
    updatePersonalInfo,
    updateItemList,
    getBuyersSchedule,
    changeItem,
  }
})
