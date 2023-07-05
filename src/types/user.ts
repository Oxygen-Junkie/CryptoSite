import Deal from './deal'
import ItemPrivate from './itemPrivate'

export default class User {
  cryptoAddress!: string
  vaultHash!: string
  postedItems: ItemPrivate[] | undefined
  buyDeals: Deal[] | undefined
  sellDeals: Deal[] | undefined

  constructor(cryptAddress: string) {
    this.cryptoAddress = cryptAddress
  }
}
