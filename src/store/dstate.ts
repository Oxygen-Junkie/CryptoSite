/* eslint-disable spaced-comment */
/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ethers } from 'hardhat'
import { Users } from '@spacehq/sdk'
import { ExternalProvider, JsonRpcFetchFunc } from '@ethersproject/providers'
import storeArtifact from '../artifacts/contracts/store.sol/storeUsers.json'
import {StoreUsers} from '../types/typechain'


const contractAddress = '0xEb3B8A7bF4E853d11aD233e15438852Ac067e253'
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : false
const users = new Users({ endpoint: 'wss://dev.space.storage' })

export const useDstateStore = defineStore('dstate', () => {
  const loading = ref(false)

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
      if ()
      const provider = new ethers.providers.Web3Provider(ethereum)
      const [signer] = await ethers.getSigners()
      signer.address
      const wavePortalContract = new ethers.Contract(contractAddress, storeABI.abi, signers)
      const count = (await wavePortalContract.getBalance())
      const amt = ethers.utils.formatEther(count)
      console.log('count', amt)
      setLoader(false)
    }
    catch (e) {
      setLoader(false)
      //console.log('e', e)
    }
  }

  function setLoader(value: boolean) {
    console.log('setloader', value)
    loading.value = value
  }

  return {
    setLoader,
    loading,
    connectWallet,
  }
})
