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
import { bDealAction, dealState, sDealAction } from '~~/types/enums'
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
      currency = JSON.parse(localStorage.getItem('currency')!)
    } else {
      await currency.determineValues()
      localStorage.setItem('currency', JSON.stringify(currency))
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert.value = 'Must connect to MetaMask!'
        return
      }
      await authUser(ethereum)
      isUserLogged = true
    } catch (error) {
      console.log(error)
    }
  }

  async function authUser(ethereum: ExternalProvider | JsonRpcFetchFunc) {
    setUserLoader(true)
    setItemLoader(true)
    try {
      const provider = new ethers.provider.Web3Provider(ethereum)
      userAddress = await provider.getSigner()._address
      store = StoreUsers__factory.connect(storeContractAddress, provider)
      if (!user) {
        if (await store.isStored()) await authThroughIPFS()
        else await createIPFSRecord()
        setUserLoader(false)
        await updateItemList()
        await updateTagList()
        setItemLoader(false)
      } else {
        userAddress = user.cryptoAddress
      }
      setDealLoader(true)
      dealProgram = Delivery__factory.connect(userContractAddress, provider)
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
      if (bd) user.buyDeals![bd].state = buyDeal.state
      else
        user.buyDeals?.push(
          new Deal(
            buyDeal.id,
            buyDeal.amount,
            buyDeal.state,
            buyDeal.seller,
            itemList.find((value) => value.id === buyDeal.itemId)!,
            JSON.parse(buyDeal.schedule),
            buyDeal.place,
            { buyer: buyDeal.sync, seller: true }
          )
        )
      dealProgram.changeSync(buyDeal.id, true)
    })

    user.sellDeals = []
    const sellDeals = await dealProgram.getSellDeals()
    sellDeals.forEach((sellDeal) => {
      const bd = user.buyDeals?.findIndex((value) => value.id === sellDeal.id)
      if (bd) user.buyDeals![bd].state = sellDeal.state
      else
        user.sellDeals?.push(
          new Deal(
            sellDeal.id,
            sellDeal.amount,
            sellDeal.state,
            sellDeal.seller,
            itemList.find((value) => value.id === sellDeal.itemId)!,
            JSON.parse(sellDeal.schedule),
            sellDeal.place,
            { buyer: true, seller: sellDeal.sync }
          )
        )
      dealProgram.changeSync(sellDeal.id, true)
    })
    setDealLoader(false)
    updatePersonalInfo()
  }

  async function bDealActions(
    actionId: bDealAction,
    dealId: BigNumberish,
    item?: ItemPublic,
    amount?: number,
    code?: string,
    complaint?: string,
    schedule?: Date[]
  ) {
    switch (actionId) {
      case bDealAction.Start: {
        const i = itemList.findIndex((value) => value.id === item!.id)!
        itemList[i].availability = amount!
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
        dealProgram.abort(dealId).catch((e) => {
          throw e
        })
        dealProgram.changeSync(dealId, false)
        break
      }
      case bDealAction.Delivered: {
        dealProgram.deliverySuccessful(dealId, code!).catch((e) => {
          throw e
        })
        break
      }
      case bDealAction.Complain: {
        dealProgram
          .productIsntWhatWasPromised(dealId, complaint!)
          .catch((e) => {
            throw e
          })
        break
      }
    }
    return dealProgram.getDealState(dealId).catch((e) => {
      throw e
    })
  }

  async function sDealActions(
    actionId: sDealAction,
    dealId: BigNumberish,
    place?: string,
    time?: Date
  ) {
    switch (actionId) {
      case sDealAction.Confirm: {
        dealProgram
          .confirmDeal(dealId, JSON.stringify(time), place!)
          .catch((e) => {
            throw e
          })
        dealProgram.changeSync(dealId, false)
        break
      }
      case sDealAction.CallOff: {
        dealProgram.deliveryCalledOff(dealId).catch((e) => {
          throw e
        })
        dealProgram.changeSync(dealId, false)
        break
      }
      case sDealAction.ChangeRendezvous: {
        dealProgram
          .changeRendezvous(dealId, place!, JSON.stringify(time!))
          .catch((e) => {
            throw e
          })
        dealProgram.changeSync(dealId, false)
        break
      }
      case sDealAction.Remove: {
        dealProgram.removeDeal(dealId).catch((e) => {
          throw e
        })
        break
      }
    }
    return dealProgram.getDealState(dealId).catch((e) => {
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
  }
})
