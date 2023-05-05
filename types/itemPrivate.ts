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
  schedule!: Date[]
  hidden!: boolean

  constructor(
    name: string,
    tag: Tag[],
    availability: number,
    price: number,
    description: string,
    producer: string,
    defaultPlace: string,
    schedule: Date[]
  ) {
    this.id = uuidv4()
    this.name = name
    this.tag = tag
    this.availability = availability
    this.price = price
    this.producer = producer
    this.description = description
    this.defaultPlace = defaultPlace
    this.schedule = schedule
  }

  notEmpty() {
    let correct = false
    let message = 'Поля '

    if (this.name === '') {
      message += '"Название" '
    } else if (this.tag.length < 1) {
      message += '"Тэги" '
    } else if (this.availability < 0 && !Number.isInteger(this.availability)) {
      message += '"Количество предметов на продажу" '
    } else if (this.price < 0 && !Number.isInteger(this.price * 100)) {
      message += '"Цена за один предмет" '
    } else if (this.producer === '') {
      message += '"Производитель" '
    } else if (this.defaultPlace === '') {
      message += '"Место совершения сделки" '
    } else if (this.schedule.length < 1) {
      message += '"График совершения сделки" '
    } else if (this.description === '') {
      message += '"Описание" '
    } else {
      correct = true
    }
    return { correct, message }
  }
}
