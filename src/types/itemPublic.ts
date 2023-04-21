import { reputation } from './enums'

export default class ItemPublic {
  id!: string
  name!: string
  imageCID!: string
  tagIds!: number[]
  availability!: number
  price!: number
  description!: string
  producer!: string
  seller!: string
  sellerReputation!: reputation
  defaultPlace!: string
  defaultTime!: string
}
