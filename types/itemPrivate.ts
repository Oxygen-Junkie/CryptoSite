import Tag from './tag'

export default class ItemPrivate {
  id!: string
  name!: string
  imageCID!: string
  tag!: Tag[]
  availability!: number
  price!: number
  description!: string
  producer!: string
  defaultPlace!: string
  defaultTime!: string

  constructor(
    id: string,
    name: string,
    tag: Tag[],
    availability: number,
    price: number,
    description: string,
    producer: string
  ) {
    this.id = id
    this.name = name
    this.tag = tag
    this.availability = availability
    this.price = price
    this.producer = producer
    this.description = description
  }
}
