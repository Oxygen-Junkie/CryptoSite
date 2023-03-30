import { MetaMaskInpageProvider } from '@metamask/providers'

export interface ILink {
  id: number
  title: string
  url: any
  icon: string
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}
