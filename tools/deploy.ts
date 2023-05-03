/* eslint-disable no-console */
import { ethers } from 'hardhat'
import dot from 'dotenv'

async function main() {
  dot.config()
  const salt = process.env.NUXT_SALT
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const unlockTime = currentTimestampInSeconds + 60

  // const lockedAmount = ethers.utils.parseEther('0.001')

  const dealFile = await ethers.getContractFactory('deal')
  const deal = await dealFile.deploy()

  await deal.deployed()

  console.log(`Deal with unlock timestamp ${unlockTime} deployed to ${deal.address}`)

  const storeFile = await ethers.getContractFactory('store')
  const store = await storeFile.deploy(salt)

  await store.deployed()

  console.log(`Store with unlock timestamp ${unlockTime} deployed to ${store.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
