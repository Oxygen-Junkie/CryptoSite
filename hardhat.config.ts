import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  paths: {
    artifacts: './src/artifacts',
  },
  typechain: {
    outDir: 'src/types/typechain',
  },
  /* networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/f6PMffGUC3hwSBZEkThTHLkwFlHWdYPd',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  }, */
}

export default config
