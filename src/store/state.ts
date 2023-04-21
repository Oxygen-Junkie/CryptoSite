/* eslint-disable spaced-comment */
/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import IPFS from '../service/IPFS'
import User from '../types/user'
import { Delivery, Delivery__factory, StoreUsers, StoreUsers__factory } from '../types/typechain'

import ItemPublic from '../types/itemPublic'
import ItemPrivate from '../types/itemPrivate'
import Tag from '../types/tag'
import Deal from '../types/deal'
import { bDealAction, sDealAction } from '../types/enums'

const userContractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storeContractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = localStorage.getItem('user')

export const useUserStateStore = defineStore('ustate', () => {
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

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert.value = 'Must connect to MetaMask!'
        return
      }
      await authUser(ethereum)
      isUserLogged = true
    }
    catch (error) {
      console.log(error)
    }
  }

  async function authUser(ethereum: ExternalProvider | JsonRpcFetchFunc) {
    setUserLoader(true)
    setItemLoader(true)
    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      userAddress = await provider.getSigner()._address
      store = StoreUsers__factory.connect(storeContractAddress, provider)
      if (!user) {
        if (await store.isStored())
          await authThroughIPFS()
        else
          await createIPFSRecord()
        setUserLoader(false)
        await updateItemList()
        setItemLoader(false)
      }
      else {
        userAddress = user.cryptoAddress
      }
      dealProgram = Delivery__factory.connect(userContractAddress, provider)
    }
    catch (e) {
      setUserLoader(false)
      //console.log('e', e)
    }
  }

  async function authThroughIPFS() {
    const hash = await store.getHash()
    let data = ''
    for await (const chunk of IPFS.cat(hash))
      data += chunk.toString()

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
      //https://ipfs.io/ipfs/${cid}`
      const res = await IPFS.add(JSON.stringify(image))
      item.imageCID = res.cid.toString()
      user.postedItems?.push(item)
      updatePersonalInfo()
      await updateItemList()
      itemList.push(personalToPublic(item))

      store.changePublicVaultItemHash((await IPFS.add(JSON.stringify(itemList))).cid.toString())
      setUserLoader(false)
    }
    catch (e) {
      setUserLoader(false)
      //console.log('e', e)
    }
  }

  async function getReputationValueOfUser(address: string) {
    return store.getReputation(address)
  }

  async function updatePersonalInfo() {
    const res = await IPFS.add(JSON.stringify(user))
    await store.changeVaultItemHash(res.cid.toString())
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(user))
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

  function personalToPublic(item: ItemPrivate) {
    const itemL: ItemPublic = item as unknown as ItemPublic
    itemL.seller = userAddress
    return itemL
  }

  async function updateItemList() {
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
  }

  function getDealProgram() {
    return dealProgram
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
        const bd = user.buyDeals?.findIndex(value => value.id === allDeal.id)
        if (bd)
          user.buyDeals[bd].state = allDeal.state
        else
          user.buyDeals?.push(new Deal(allDeal.id, allDeal.state, allDeal.seller))
      }
      else if (allDeal.seller.match(userAddress)) {
        const bd = user.sellDeals?.findIndex(value => value.id === allDeal.id)
        if (bd)
          user.sellDeals[bd].state = allDeal.state
        else
          user.sellDeals?.push(new Deal(allDeal.id, allDeal.state, allDeal.seller).setRendezvous(allDeal.place, allDeal.time))
      }
    })
    setDealLoader(false)
  }

  async function bDealActions(actionId: bDealAction, dealId: number, item?: ItemPublic, code?: string, complaint?: string) {
    switch (actionId) {
      case bDealAction.Start: {
        dealProgram.addDeal(item!.id, item!.seller, item!.defaultPlace, item!.defaultTime)
        break
      }
      case bDealAction.Abort: {
        dealProgram.abort(dealId)
        break
      }
      case bDealAction.Delivered: {
        dealProgram.deliverySuccessful(dealId, code!)
        break
      }
      case bDealAction.Complain: {
        dealProgram.productIsntWhatWasPromised(dealId, complaint!)
        break
      }
    }
  }

  async function sDealActions(actionId: sDealAction, dealId: number, place?: string, time?: string) {
    switch (actionId) {
      case sDealAction.Confirm: {
        dealProgram.confirmDeal(dealId)
        break
      }
      case sDealAction.CallOff: {
        dealProgram.deliveryCalledOff(dealId)
        break
      }
      case sDealAction.ChangeRendezvous: {
        dealProgram.changeRendezvous(dealId, place!, time!)
        break
      }
      case sDealAction.Remove: {
        dealProgram.removeDeal(dealId)
        break
      }
    }
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
    getDealProgram,
    isUserLogged,
    scanDeals,
    bDealActions,
    sDealActions,
    loadingDeals,
  }
})
