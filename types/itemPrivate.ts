import { v4 as uuidv4 } from 'uuid'
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
    name: string,
    tag: Tag[],
    availability: number,
    price: number,
    description: string,
    producer: string
  ) {
    this.id = uuidv4()
    this.name = name
    this.tag = tag
    this.availability = availability
    this.price = price
    this.producer = producer
    this.description = description
  }

  notEmpty() {
    let correct = false
    let message = 'Поля '

    if (this.name === '') {
      message += '"Название" '
    } else if (this.tag.length === 0) {
      message += '"Тэги" '
    } else if (this.availability === 0) {
      message += '"В наличии" '
    } else if (this.price === 0) {
      message += '"Цена" '
    } else if (this.producer === '') {
      message += '"Производитель" '
    } else if (this.description === '') {
      message += '"Описание" '
    } else {
      correct = true
    }
    message += 'не заданы'
    return { correct, message }
  }
}
