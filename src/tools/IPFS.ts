import { create } from 'ipfs-http-client'
import dot from 'dotenv'

dot.config()

const auth = `Basic ${Buffer.from(
  `${process.env.NUXT_INFURA_ID}:${process.env.NUXT_INFURA_SECRET_KEY}`
).toString('base64')}`

export default create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})
