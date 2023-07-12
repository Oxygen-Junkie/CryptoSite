import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

import type { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: '0.8.18', settings: {} }],
  },
  paths: {
    artifacts: 'src/artifacts',
    sources: 'src/contracts',
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
