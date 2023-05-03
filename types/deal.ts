import { BigNumber } from 'ethers'
import { dealState } from './enums'

export default class Deal {
  id!: BigNumber
  amount!: BigNumber
  state!: dealState
  place?: string
  time?: string
  cryptoAddress!: string
  code?: string

  constructor(id: BigNumber,
    amount: BigNumber,
    state: dealState,
    cryptoAddress: string) {
    this.amount = amount
    this.id = id
    this.state = state
    this.cryptoAddress = cryptoAddress
  }

  setRendezvous(place: string,
    time: string) {
    this.place = place
    this.time = time

    return this
  }

  setCode(code: string) {
    this.code = code
  }
}
