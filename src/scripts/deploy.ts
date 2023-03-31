/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const hre = require('hardhat')
require('@nomicfoundation/hardhat-toolbox')

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log(
    'Deploying contracts with the account:',
    deployer.address,
  )
  const DealSol = await hre.ethers.getContractFactory('deal')
  const deal = await DealSol.deploy()

  await deal.waitForDeployment()

  console.log('Deal deployed to:', deal.getAddress())

  const StoreSol = await hre.ethers.getContractFactory('store')
  const store = await StoreSol.deploy()

  await store.waitForDeployment()

  console.log('Store deployed to:', store.getAddress())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
