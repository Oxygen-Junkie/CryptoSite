/* eslint-disable require-await */
/* eslint-disable import/named */
/* eslint-disable camelcase */
/* eslint-disable spaced-comment */
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
  let userAddress = ''
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
        name: 'Перфоратор AEG KH24IE 4935451555',
        imageCID: 'QmTraHi8PSzsEvFcqPoFucgQhmbNrAEL4bwYGpyVSLkh4A',
        availability: 10,
        price: 4,
        producer: 'Китай',
        hidden: false,
        seller: 'gjksljgklwejr',
        defaultPlace: 'улица Астраханская, 1а',
        sellerReputation: reputation.None,
        schedule: [new Date(2023, 9, 2, 9, 10), new Date(2023, 9, 3, 11, 30)],
        tag: [tag1, tag2],
        description:
          'Тип двигателя:щеточный Тип хвостовика:sds-plus Мощность:800 Вт Количество режимов:3 Max сила удара:2.4 Дж Реверс:электронный',
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
        availability: 7,
        price: 7,
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
      isUserLogged = true
    } catch (error) {
      console.log(error)
    }
  }

  async function authUser() {
    setUserLoader(true)
    setItemLoader(true)
    try {
      if (!user) {
        if (await store.isStored()) await authThroughIPFS()
        setUserLoader(false)
        setItemLoader(false)
      } else {
        userAddress = user.cryptoAddress
      }
      setDealLoader(true)
      setDealLoader(false)
    } catch (e) {
      setUserLoader(false)
      //console.log('e', e)
    }
  }

  async function authThroughIPFS() {
    const hash = await store.getHash()
    let data = ''
    for await (const chunk of IPFS.cat(hash)) data += chunk.toString()

    user = JSON.parse(data) as User
    localStorage.setItem('user', JSON.stringify(user))
  }

  async function createIPFSRecord() {
    user = new User(userAddress)
    const res = await IPFS.add(JSON.stringify(user))
    localStorage.setItem('user', JSON.stringify(user))
    store.storeUser(res.cid.toString())
  }

  async function addItem(item: ItemPrivate, image: any) {
    setUserLoader(true)
    try {
      const pubItem = await personalToPublic(item)

      item.tag.forEach((value) => {
        value.items.push(pubItem)
      })

      //https://ipfs.io/ipfs/${cid}`
      const res = await IPFS.add(JSON.stringify(image))
      item.imageCID = res.cid.toString()
      user.postedItems?.push(item)
      updatePersonalInfo()
      await updateItemList()
      await updateTagList()
      itemList.push(pubItem)

      updateTags(item.tag)
      store.changePublicVaultItemHash(
        (await IPFS.add(JSON.stringify(itemList))).cid.toString()
      )
      setUserLoader(false)
      return true
    } catch (e) {
      setUserLoader(false)
      return false
      //console.log('e', e)
    }
  }

  async function changeItem(item: ItemPrivate, image: any) {
    setUserLoader(true)
    try {
      const pubItem = await personalToPublic(item)

      item.tag.forEach((value) => {
        value.items.push(pubItem)
      })

      //https://ipfs.io/ipfs/${cid}`
      const res = await IPFS.add(JSON.stringify(image))
      item.imageCID = res.cid.toString()
      let id = user.postedItems!.findIndex((value) => item.id === value.id)!
      user.postedItems![id] = item
      updatePersonalInfo()
      await updateItemList()
      await updateTagList()
      id = itemList!.findIndex((value) => item.id === value.id)!
      itemList![id] = pubItem

      updateTags(item.tag)
      store.changePublicVaultItemHash(
        (await IPFS.add(JSON.stringify(itemList))).cid.toString()
      )
      setUserLoader(false)
      return true
    } catch (e) {
      setUserLoader(false)
      return false
      //console.log('e', e)
    }
  }

  async function getReputationValueOfUser(address: string) {
    await store.updateReputation(address)
    return await store.getReputation(address)
  }

  async function updatePersonalInfo() {
    setUserLoader(true)
    const res = await IPFS.add(JSON.stringify(user))
    await store.changeVaultItemHash(res.cid.toString())
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(user))
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
    itemP.sellerReputation = await getReputationValueOfUser(userAddress)
    itemP.seller = userAddress
    return itemP
  }

  async function updateItemList() {
    setItemLoader(true)
    const publicRepItemHash = await store.getPublicVaultItemHash()
    let itemData = ''
    for await (const chunk of IPFS.cat(publicRepItemHash))
      itemData += chunk.toString()
    itemList = JSON.parse(itemData) as ItemPublic[]
    itemList.sort((a, b) => a.sellerReputation - b.sellerReputation)
    setItemLoader(false)
  }

  async function updateTagList() {
    setItemLoader(true)
    const publicRepTagHash = await store.getPublicVaultTagHash()
    let tagData = ''
    for await (const chunk of IPFS.cat(publicRepTagHash))
      tagData += chunk.toString()
    tagList = JSON.parse(tagData) as Tag[]
    setItemLoader(false)
  }

  async function updateTags(changedTags: Tag[]) {
    setItemLoader(true)
    let temp: Tag | undefined
    tagList.forEach((value) => {
      temp = changedTags.find((val) => val.id === value.id)
      if (temp) {
        value.items = temp.items
      }
    })
    store.changePublicVaultTagHash(
      (await IPFS.add(JSON.stringify(tagList))).cid.toString()
    )
    setItemLoader(false)
  }

  function getItems() {
    return { itemList, tagList }
  }

  async function scanDeals() {
    setDealLoader(true)
    user.buyDeals = []
    const buyDeals = await dealProgram.getBuyDeals()
    buyDeals.forEach((buyDeal) => {
      const bd = user.buyDeals?.findIndex((value) => value.id === buyDeal.id)
      if (bd) {
        if (buyDeal.state !== user.buyDeals![bd].state)
          dealProgram.changeSync(buyDeal.id, true)
        user.buyDeals![bd].state = buyDeal.state
        user.buyDeals![bd].schedule = JSON.parse(buyDeal.schedule) as Date[]
        user.buyDeals![bd].place = buyDeal.place
        user.buyDeals![bd].time = JSON.parse(buyDeal.time) as Date
        user.buyDeals![bd].synced = { buyer: true, seller: buyDeal.sync }
      } else {
        dealProgram.changeSync(buyDeal.id, true)
        user.buyDeals?.push(
          new Deal(
            buyDeal.id,
            buyDeal.amount,
            buyDeal.state,
            buyDeal.seller,
            itemList.find((value) => value.id === buyDeal.itemId)!,
            JSON.parse(buyDeal.schedule) as Date[],
            JSON.parse(buyDeal.time) as Date,
            buyDeal.place,
            { buyer: true, seller: buyDeal.sync }
          )
        )
      }
    })

    user.sellDeals = []
    const sellDeals = await dealProgram.getSellDeals()
    sellDeals.forEach((sellDeal) => {
      const bd = user.buyDeals?.findIndex((value) => value.id === sellDeal.id)
      if (bd) {
        if (sellDeal.state !== user.sellDeals![bd].state)
          dealProgram.changeSync(sellDeal.id, true)
        user.sellDeals![bd].state = sellDeal.state
        user.sellDeals![bd].schedule = JSON.parse(sellDeal.schedule) as Date[]
        user.sellDeals![bd].place = sellDeal.place
        user.sellDeals![bd].time = JSON.parse(sellDeal.time) as Date
        user.sellDeals![bd].synced = { buyer: sellDeal.sync, seller: true }
      } else {
        dealProgram.changeSync(sellDeal.id, true)
        user.sellDeals?.push(
          new Deal(
            sellDeal.id,
            sellDeal.amount,
            sellDeal.state,
            sellDeal.buyer,
            itemList.find((value) => value.id === sellDeal.itemId)!,
            JSON.parse(sellDeal.schedule) as Date[],
            JSON.parse(sellDeal.time) as Date,
            sellDeal.place,
            { buyer: sellDeal.sync, seller: true }
          )
        )
      }
    })
    setDealLoader(false)
    updatePersonalInfo()
  }

  async function bDealActions(
    actionId: bDealAction,
    item?: ItemPublic,
    amount?: number,
    code?: string,
    complaint?: string,
    schedule?: Date[],
    dealZ?: Deal
  ) {
    switch (actionId) {
      case bDealAction.Start: {
        const i = itemList.findIndex((value) => value.id === item!.id)!
        itemList[i].availability -= amount!
        updateItemList()
        dealProgram
          .addDeal(
            item!.id,
            item!.seller,
            amount!,
            item!.defaultPlace,
            JSON.stringify(schedule!)
          )
          .catch((e) => {
            throw e
          })
        break
      }
      case bDealAction.Abort: {
        dealProgram.abort(dealZ!.id).catch((e) => {
          throw e
        })
        changeSync(dealZ!, false, dealPaletteMode.buyDeal)
        break
      }
      case bDealAction.Delivered: {
        dealProgram.deliverySuccessful(dealZ!.id, code!).catch((e) => {
          throw e
        })
        break
      }
      case bDealAction.Complain: {
        dealProgram
          .productIsntWhatWasPromised(dealZ!.id, complaint!)
          .catch((e) => {
            throw e
          })
        break
      }
    }
    return dealProgram.getDealState(dealZ!.id).catch((e) => {
      throw e
    })
  }

  async function sDealActions(
    actionId: sDealAction,
    dealZ: Deal,
    place?: string,
    time?: Date
  ) {
    switch (actionId) {
      case sDealAction.Confirm: {
        dealProgram
          .confirmDeal(dealZ.id, JSON.stringify(time), place!)
          .catch((e) => {
            throw e
          })
        changeSync(dealZ, false, dealPaletteMode.sellDeal)
        break
      }
      case sDealAction.CallOff: {
        dealProgram.deliveryCalledOff(dealZ.id).catch((e) => {
          throw e
        })
        changeSync(dealZ, false, dealPaletteMode.sellDeal)
        break
      }
      case sDealAction.ChangeRendezvous: {
        dealProgram
          .changeRendezvous(dealZ.id, place!, JSON.stringify(time!))
          .catch((e) => {
            throw e
          })
        changeSync(dealZ, false, dealPaletteMode.sellDeal)
        break
      }
      case sDealAction.Remove: {
        dealProgram.removeDeal(dealZ.id).catch((e) => {
          throw e
        })
        break
      }
    }
    return dealProgram.getDealState(dealZ.id).catch((e) => {
      throw e
    })
  }

  async function getBuyersSchedule(id: BigNumberish) {
    const schedule = await dealProgram.getSchedule(id)
    const index = user.sellDeals!.findIndex((deal) => deal.id === id)
    user.sellDeals![index].schedule = JSON.parse(schedule) as Date[]
  }

  async function getPayCode(dealId: BigNumberish) {
    return dealProgram.getDealPayCode(dealId)
  }

  function getCurrency() {
    return currency
  }

  async function changeSync(
    deal: Deal,
    sync: boolean,
    dealType: dealPaletteMode
  ) {
    const p = dealProgram.changeSync(deal.id, sync)
    if (dealType === dealPaletteMode.buyDeal)
      user.buyDeals![
        user.buyDeals!.findIndex((buyDeal) => deal.id === buyDeal.id)!
      ].synced.seller = false
    if (dealType === dealPaletteMode.sellDeal)
      user.sellDeals![
        user.sellDeals!.findIndex((sellDeal) => deal.id === sellDeal.id)!
      ].synced.buyer = false
    updatePersonalInfo()
    await p
  }

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
