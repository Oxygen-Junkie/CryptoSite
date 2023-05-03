import dot from 'dotenv'
import { getETHPrice } from '~~/utils/getETHPrice'

export default class Currency {
  rub!: number
  eth!: number

  async determineValues() {
    dot.config()
    this.rub = parseFloat(process.env.NUXT_RUB!)
    this.eth = await getETHPrice()
    return this
  }
}
