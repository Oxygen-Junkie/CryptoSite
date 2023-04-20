import { BigNumber } from 'ethers'

export default class Deal {
  id!: BigNumber
  state!: number
  place?: string
  time?: string
  cryptoAddress!: string
  code?: string

  constructor(id: BigNumber,
    state: number,
    cryptoAddress: string) {
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
