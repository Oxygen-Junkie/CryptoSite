import Deal from './deal'
import ItemFull from './itemFull'

export default class User {
  cryptoAddress!: string
  vaultHash!: string
  postedItems: ItemFull[] | undefined
  buyDeals: Deal[] | undefined
  sellDeals: Deal[] | undefined

  constructor(cryptAddress: string) {
    this.cryptoAddress = cryptAddress
  }
}
