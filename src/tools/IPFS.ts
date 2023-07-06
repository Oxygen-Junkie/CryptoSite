import { createHelia } from 'helia'
import { json } from '@helia/json'

const helia = await createHelia()

export default json(helia)
