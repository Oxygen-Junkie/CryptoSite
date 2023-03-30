/* eslint-disable no-console */
import hre from 'hardhat'
import '@nomicfoundation/hardhat-toolbox'

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log(
    'Deploying contracts with the account:',
    deployer.address,
  )
  const ContractPortal = await hre.ethers.getContractFactory('WavePortal')
  const contract = await ContractPortal.deploy()

  await contract.waitForDeployment()

  console.log('Wae portal deployed to:', contract.getAddress())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
