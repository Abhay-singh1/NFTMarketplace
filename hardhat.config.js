require("@nomiclabs/hardhat-waffle");
const fs = require('fs')

const projectId = "715628bca73742e3a286eed04acee98e"
const privateKey = fs.readFileSync(".secret").toString();


module.exports = {

  networks:{
    hardhat:{
      chainId:1337
    },
    mumbai:{
      url:`https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet:{
      url: `https://polygon-rpc.com/`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
