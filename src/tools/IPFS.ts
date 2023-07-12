import { createHelia } from 'helia'
import { json } from '@helia/json'
import { unixfs } from '@helia/unixfs'

const helia = await createHelia()

export const processJSON = json(helia)

export const processFile  = unixfs(helia) 
