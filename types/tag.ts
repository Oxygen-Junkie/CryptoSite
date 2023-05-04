import ItemPrivate from './itemPrivate'
import ItemPublic from './itemPublic'

export default class Tag {
  id!: number
  name!: string
  items!: ItemPrivate | ItemPublic
}
