require('@nomicfoundation/hardhat-toolbox')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dot = require('dotenv')
dot.config()

exports.config = {
  solidity: '0.8.19',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/f6PMffGUC3hwSBZEkThTHLkwFlHWdYPd',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
}
