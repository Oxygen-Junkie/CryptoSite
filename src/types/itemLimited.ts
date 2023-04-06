export default class ItemLimited {
  id!: number
  name!: string
  image!: string
  categoryId!: number
  availability!: number
  price!: number
  description!: string
  producer!: string
  seller!: string

  constructor(id: number,
    name: string,
    image: string,
    categoryId: number,
    availability: number,
    price: number,
    seller: string,
    producer: string,
  ) {
    this.id = id
    this.name = name
    this.image = image
    this.categoryId = categoryId
    this.availability = availability
    this.price = price
    this.producer = producer
    this.seller = seller
  }
}
