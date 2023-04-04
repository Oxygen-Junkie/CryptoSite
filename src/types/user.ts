import { Identity } from '@spacehq/sdk'
import Deal from './deal'
import ItemFull from './itemFull'

export default class User {
  cryptAddress!: string
  keyPair!: Identity
  postedItems: ItemFull[] | undefined
  buyDeals: Deal[] | undefined
  sellDeals: Deal[] | undefined

  constructor(cryptAddress: string, keyPair: Identity) {
    this.cryptAddress = cryptAddress
    this.keyPair = keyPair
  }
}
