/* eslint-disable spaced-comment */
/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { parse } from 'arraybuffer-xml-parser'
import convert from 'xml-js'
import { Identity, SpaceUser, UserStorage, Users } from '@spacehq/sdk'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import User from '../types/user'
import storeABI from '../artifacts/contracts/store.sol/storeUsers.json'
import { StoreUsers } from '../types/typechain'

const contractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = localStorage.getItem('user')
const users = new Users({ endpoint: 'wss://dev.space.storage' })

export const useDstateStore = defineStore('dstate', () => {
  const loading = ref(false)
  let user: User = storedUser ? JSON.parse(storedUser) : null
  let userInIPFS: SpaceUser
  let store: StoreUsers

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]

      await authUser(ethereum)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function authUser(ethereum: ExternalProvider | JsonRpcFetchFunc) {
    setLoader(true)
    try {
      if (!user) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = await provider.getSigner()
        store = new ethers.Contract(contractAddress, storeABI.abi, signer) as StoreUsers
        if (await store.isStored())
          await authThroughIPFS()
        else
          await createIPFSRep(signer._address)

        setLoader(false)
      }
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
    const fileResponse = await storage.openFile({ bucket: 'personal', path: '/inf.xml' })
    const fileContent = await fileResponse.consumeStream()
    user = JSON.parse(convert.xml2json(parse(fileContent) as string, { compact: true })) as User
  }

  async function createIPFSRep(address: string) {
    const identity = await users.createIdentity()
    user = new User(address, identity)
    localStorage.setItem('user', JSON.stringify(user))
    store.storeUser(JSON.stringify({ private: identity.privKey, public: identity.public, sign: identity.sign }))
    userInIPFS = await users.authenticate(identity)
  }

  async function addItem() {
    const identity = await users.createIdentity()
    user = new User(address, identity)
    localStorage.setItem('user', JSON.stringify(user))
    store.storeUser(JSON.stringify({ private: identity.privKey, public: identity.public, sign: identity.sign }))
    userInIPFS = await users.authenticate(identity)
  }

  async function getReputationValueOfUser(address: string) {
    return store.getReputation(address)
  }

  function setLoader(value: boolean) {
    loading.value = value
  }

  return {
    setLoader,
    loading,
    connectWallet,
  }
})
