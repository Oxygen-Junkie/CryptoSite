export default class Currency {
  rub!: number
  eth!: number

  determineValues() {
    this.rub = 85
    this.eth = 1615
    return this
  }
}
