import { BigNumberish } from 'ethers'
import { dealState } from './enums'
import ItemPublic from './itemPublic'

export default class Deal {
  id!: BigNumberish
  amount!: BigNumberish
  state!: dealState
  item!: ItemPublic
  place?: string
  time?: string
  cryptoAddress!: string
  code?: string

  constructor(
    id: BigNumberish,
    amount: BigNumberish,
    state: dealState,
    cryptoAddress: string,
    item: ItemPublic
  ) {
    this.amount = amount
    this.id = id
    this.state = state
    this.cryptoAddress = cryptoAddress
    this.item = item
  }

  setRendezvous(place: string, time: string) {
    this.place = place
    this.time = time

    return this
  }

  setCode(code: string) {
    this.code = code
  }
}
