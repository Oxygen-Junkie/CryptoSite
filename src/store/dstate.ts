/* eslint-disable spaced-comment */
/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { parse } from 'arraybuffer-xml-parser'
import convert from 'xml-js'
import { AddItemsEventData, Identity, SpaceUser, UserStorage, Users, VaultBackupType } from '@spacehq/sdk'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import User from '../types/user'
import { StoreUsers, StoreUsers__factory } from '../types/typechain'
import ItemLimited from '../types/itemLimited'
import ItemFull from '../types/itemFull'

const contractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = localStorage.getItem('user')
const users = new Users({ endpoint: 'wss://dev.space.storage' })

export const useDstateStore = defineStore('dstate', () => {
  const loading = ref(false)
  let user: User = storedUser ? JSON.parse(storedUser) : null
  let userInIPFS: SpaceUser
  let store: StoreUsers
  let userAddress = ''
  let itemList: ItemLimited[]
  let publicUser: SpaceUser

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
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
      const forWait = loadPublicRep()
      if (!user) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        userAddress = await provider.getSigner()._address
        store = StoreUsers__factory.connect(contractAddress, provider)
        if (await store.isStored())
          await authThroughIPFS()
        else
          await createIPFSRep()

        setLoader(false)
      }
      else {
        userAddress = user.cryptoAddress
      }
      await forWait
    }
    catch (e) {
      setLoader(false)
      //console.log('e', e)
    }
  }

  async function authThroughIPFS() {
    const keyPairString = await store.getKey()
    const keyPair = JSON.parse(keyPairString)
    const identity: Identity = { privKey: keyPair.private, public: keyPair.public, sign: keyPair.sign }
    userInIPFS = await users.authenticate(identity)
    const storage = new UserStorage(userInIPFS)
    const fileResponse = await storage.openFile({ bucket: 'personal', path: 'inf.txt' })
    const fileContent = await fileResponse.consumeStream()
    user = JSON.parse(new TextDecoder().decode(fileContent)) as User
    localStorage.setItem('user', JSON.stringify(user))
  }

  async function createIPFSRep() {
    const identity = await users.createIdentity()
    user = new User(userAddress, identity)
    localStorage.setItem('user', JSON.stringify(user))
    store.storeUser(JSON.stringify({ private: identity.privKey, public: identity.public, sign: identity.sign }))
    userInIPFS = await users.authenticate(identity)
  }

  //png only
  async function addItem(item: ItemFull, image: any) {
    setLoader(true)
    try {
      user.postedItems?.push(item)
      updatePersonalInfo()
      const storage = new UserStorage(publicUser)
      const fileResponse = await storage.openFile({ bucket: 'public', path: '/items.txt' })
      const fileContent = await fileResponse.consumeStream()
      itemList = JSON.parse(convert.xml2json(parse(fileContent) as string, { compact: true })).items
      itemList.push(personaToLimited(item))
      const response = await storage.addItems({
        bucket: 'public',
        files: [
          {
            path: 'items.txt',
            data: JSON.stringify({ items: itemList }),
            mimeType: 'plain/text',
          },
          {
            path: item.image,
            data: image,
            mimeType: 'image/png',
          },
        ],
      })

      response.on('error', (err: AddItemsEventData) => {
        throw err
      })

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
    const storage = new UserStorage(userInIPFS)
    const response = await storage.addItems({
      bucket: 'personal',
      files: [
        {
          path: 'inf.txt',
          data: JSON.stringify(user),
          mimeType: 'plain/text',
        },
      ],
    })

    response.on('error', (err: AddItemsEventData) => {
      throw err
    })
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(user))
  }

  async function loadPublicRep() {
    const uuid = process.env.NUXT_PUBLICUUID!
    const passphrase = process.env.NUXT_NUXT_PUBLICPASSPHRASE!
    publicUser = await users.recoverKeysByPassphrase(uuid, passphrase, VaultBackupType.Google)
    const storage = new UserStorage(publicUser)
    const fileResponse = await storage.openFile({ bucket: 'public', path: '/items.xml' })
    const fileContent = await fileResponse.consumeStream()
    itemList = JSON.parse(convert.xml2json(parse(fileContent) as string, { compact: true }))
  }

  function setLoader(value: boolean) {
    loading.value = value
  }

  function personaToLimited(item: ItemFull) {
    const itemL: ItemLimited = item as unknown as ItemLimited
    itemL.seller = userAddress
    return itemL
  }

  return {
    setLoader,
    loading,
    connectWallet,
    addItem,
    getReputationValueOfUser,
  }
})
