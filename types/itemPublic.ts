import { reputation } from './enums'
import Tag from './tag'

export default class ItemPublic {
  id!: string
  name!: string
  imageCID!: string
  tag!: Tag[]
  availability!: number
  price!: number
  description!: string
  producer!: string
  seller!: string
  sellerReputation!: reputation
  defaultPlace!: string
  schedule!: Date[]
  hidden!: boolean
}
