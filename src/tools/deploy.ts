/* eslint-disable no-console */
// eslint-disable-next-line import/named
import { ethers } from 'hardhat'
import dot from 'dotenv'

async function main() {
  dot.config()
  const salt = import.meta.env.VITE_SALT
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const unlockTime = currentTimestampInSeconds + 60

  const dealFile = await ethers.getContractFactory('deal')
  const deal = await dealFile.deploy()

  await deal.getDeployedCode()

  console.log(
    `Смарт-контракт сделки был размещён ${unlockTime} по адресу ${deal.getAddress}`
  )

  const storeFile = await ethers.getContractFactory('store')
  const store = await storeFile.deploy(salt)

  await store.getDeployedCode()

  console.log(
    `Смарт-контракт хранения данных был размещён ${unlockTime} по адресу ${store.getAddress}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
