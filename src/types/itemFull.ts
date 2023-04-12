export default class ItemFull {
  id!: number
  name!: string
  imageCID!: string
  tagIds!: number[]
  availability!: number
  price!: number
  description!: string
  producer!: string
  defaultPlace!: string
  defaultTime!: string

  constructor(id: number,
    name: string,
    tagIds: number[],
    availability: number,
    price: number,
    description: string,
    producer: string,
  ) {
    this.id = id
    this.name = name
    this.tagIds = tagIds
    this.availability = availability
    this.price = price
    this.producer = producer
    this.description = description
  }
}
