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
    const publicRepTagHash = await store.getPublicVaultTagHash()
    let itemData = ''
    for await (const chunk of IPFS.cat(publicRepItemHash))
      itemData += chunk.toString()
    itemList = JSON.parse(itemData) as ItemPublic[]
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
    user.sellDeals = []
    const allDeals = await dealProgram.getDeals()
    allDeals.forEach((allDeal) => {
      if (allDeal.buyer.match(userAddress)) {
        const bd = user.buyDeals?.findIndex((value) => value.id === allDeal.id)
        if (bd) user.buyDeals![bd].state = allDeal.state
        else
          user.buyDeals?.push(
            new Deal(
              allDeal.id,
              allDeal.amount,
              allDeal.state,
              allDeal.seller,
              itemList.find((value) => value.id === allDeal.itemId)!
            )
          )
      } else if (allDeal.seller.match(userAddress)) {
        const bd = user.sellDeals?.findIndex((value) => value.id === allDeal.id)
        if (bd) user.sellDeals![bd].state = allDeal.state
        else
          user.sellDeals?.push(
            new Deal(
              allDeal.id,
              allDeal.amount,
              allDeal.state,
              allDeal.seller,
              itemList.find((value) => value.id === allDeal.itemId)!
            ).setRendezvous(allDeal.place, allDeal.time)
          )
      }
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
        await dealProgram.addDeal(
          item!.id,
          item!.seller,
          amount!,
          item!.defaultPlace,
          JSON.stringify(schedule!)
        )
        break
      }
      case bDealAction.Abort: {
        await dealProgram.abort(dealId)
        break
      }
      case bDealAction.Delivered: {
        await dealProgram.deliverySuccessful(dealId, code!)
        break
      }
      case bDealAction.Complain: {
        await dealProgram.productIsntWhatWasPromised(dealId, complaint!)
        break
      }
    }
    return dealProgram.getDealState(dealId)
  }

  async function sDealActions(
    actionId: sDealAction,
    dealId: BigNumberish,
    place?: string,
    schedule?: Date[],
    time?: Date
  ) {
    switch (actionId) {
      case sDealAction.Confirm: {
        await dealProgram.confirmDeal(dealId, JSON.stringify(schedule))
        break
      }
      case sDealAction.CallOff: {
        await dealProgram.deliveryCalledOff(dealId)
        break
      }
      case sDealAction.ChangeRendezvous: {
        await dealProgram.changeRendezvous(dealId, place!, time!)
        break
      }
      case sDealAction.Remove: {
        await dealProgram.removeDeal(dealId)
        break
      }
    }
    return dealProgram.getDealState(dealId)
  }

  async function getBuyersSchedule(id: BigNumberish) {
    const schedule = await dealProgram.getSchedule(id)
    const index = user.sellDeals!.findIndex((deal) => deal.id === id)
    user.sellDeals![index].schedule = JSON.parse(schedule) as Date[]
  }

  async function getRendezvous(id: BigNumberish) {
    const rend = await dealProgram.getRendezvous(id)
    user.buyDeals?.find((deal) => deal.id === id)?.setRendezvous(rend.p, rend.t)
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
    getRendezvous,
    getBuyersSchedule
  }
})
