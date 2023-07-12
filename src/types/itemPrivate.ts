import { v4 as uuidv4 } from 'uuid'
import type Tag from './tag'

const { t } = useI18n()

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
    schedule: Date[],
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
    let message = `${t('itemPrivate.message_start')} `

    if (this.name === '')
      message += `${t('itemPrivate.message_name')} `

    else if (this.tag.length < 1)
      message += `${t('itemPrivate.message_tag')} `

    else if (this.availability < 0 && !Number.isInteger(this.availability))
      message += `${t('itemPrivate.message_availability')} `

    else if (this.price < 0 && !Number.isInteger(this.price * 100))
      message += `${t('itemPrivate.message_price')} `

    else if (this.producer === '')
      message += `${t('itemPrivate.message_producer')} `

    else if (this.defaultPlace === '')
      message += `${t('itemPrivate.message_defaultPlace')} `

    else if (this.schedule.length < 1)
      message += `${t('itemPrivate.message_schedule')} `

    else if (this.description === '')
      message += `${t('itemPrivate.message_description')} `

    else
      correct = true

    return { correct, message }
  }
}
