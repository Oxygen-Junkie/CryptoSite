import { BigNumberish } from 'ethers'
import { dealState } from './enums'
import ItemPublic from './itemPublic'
import ItemPrivate from './itemPrivate'

export default class Deal {
  id!: BigNumberish
  amount!: BigNumberish
  state!: dealState
  item!: ItemPublic
  place!: string
  time?: Date
  schedule!: Date[]
  cryptoAddress!: string
  code?: string
  synced!: { buyer: boolean; seller: boolean }

  constructor(
    id: BigNumberish,
    amount: BigNumberish,
    state: dealState,
    cryptoAddress: string,
    item: ItemPublic,
    schedule: Date[],
    time: Date,
    place: string,
    synced: { buyer: boolean; seller: boolean }
  ) {
    this.amount = amount
    this.id = id
    this.state = state
    this.cryptoAddress = cryptoAddress
    this.item = item
    this.schedule = schedule
    this.place = place
    this.synced = synced
    this.time = time
  }

  setRendezvous(place: string, time: string) {
    this.place = place
    this.time = new Date(time)

    return this
  }

  setCode(code: string) {
    this.code = code
  }
}
