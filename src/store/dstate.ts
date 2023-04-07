/* eslint-disable spaced-comment */
/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import IPFS from '../service/IPFS'
import User from '../types/user'
import { StoreUsers, StoreUsers__factory } from '../types/typechain'
import ItemLimited from '../types/itemLimited'
import ItemFull from '../types/itemFull'

const contractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = localStorage.getItem('user')

export const useDstateStore = defineStore('dstate', () => {
  const loading = ref(false)
  let user: User = storedUser ? JSON.parse(storedUser) : null
  let store: StoreUsers
  let userAddress = ''
  let itemList: ItemLimited[]
  const alert = ref('')

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert.value = 'Must connect to MetaMask!'
        return
      }
      await authUser(ethereum)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function authUser(ethereum: ExternalProvider | JsonRpcFetchFunc) {
    setLoader(true)
    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      userAddress = await provider.getSigner()._address
      store = StoreUsers__factory.connect(contractAddress, provider)
      await updateItemList()
      if (!user) {
        if (await store.isStored())
          await authThroughIPFS()
        else
          await createIPFSRecord()

        setLoader(false)
      }
      else {
        userAddress = user.cryptoAddress
      }
    }
    catch (e) {
      setLoader(false)
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

  async function addItem(item: ItemFull, image: any) {
    setLoader(true)
    try {
      //https://ipfs.io/ipfs/${cid}`
      let res = await IPFS.add(JSON.stringify(image))
      item.imageCID = res.cid.toString()
      user.postedItems?.push(item)
      updatePersonalInfo()
      await updateItemList()
      itemList.push(personaToLimited(item))

      res = await IPFS.add(JSON.stringify(itemList))
      store.changePublicVaultHash(res.cid.toString())
      setLoader(false)
    }
    catch (e) {
      setLoader(false)
      //console.log('e', e)
    }
  }

  async function getReputationValueOfUser(address: string) {
    return store.getReputation(address)
  }

  async function updatePersonalInfo() {
    const res = await IPFS.add(JSON.stringify(user))
    await store.changeVaultHash(res.cid.toString())
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(user))
  }

  function setLoader(value: boolean) {
    loading.value = value
  }

  function personaToLimited(item: ItemFull) {
    const itemL: ItemLimited = item as unknown as ItemLimited
    itemL.seller = userAddress
    return itemL
  }

  async function updateItemList() {
    const publicRepHash = await store.publicVaultHash()
    let itemData = ''
    for await (const chunk of IPFS.cat(publicRepHash))
      itemData += chunk.toString()
    itemList = JSON.parse(itemData)
  }

  return {
    setLoader,
    loading,
    connectWallet,
    addItem,
    getReputationValueOfUser,
    alert,
  }
})
