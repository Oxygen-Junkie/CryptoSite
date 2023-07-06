import { type ViteSSGContext } from 'vite-ssg'
import { MetaMaskInpageProvider } from "@metamask/providers"

export type UserModule = (ctx: ViteSSGContext) => void

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}
