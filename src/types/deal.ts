export default class Deal {
  id!: number
  status!: number
  place!: string
  time!: string
  cryptoAddress!: string

  constructor(id: number,
    status: number,
    place: string,
    time: string,
    cryptoAddress: string) {
    this.id = id
    this.status = status
    this.cryptoAddress = cryptoAddress
    this.place = place
    this.time = time
  }
}
