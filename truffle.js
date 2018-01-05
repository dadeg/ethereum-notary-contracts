var HDWalletProvider = require("truffle-hdwallet-provider");

// this secrets file is not included in the git repo. add it yourself with your secrets for deploys.
var secrets = require("./secrets.json");
var infuraApiKey = secrets.ropsten.infuraApiKey;
var mnemonic = secrets.ropsten.mnemonic;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      network_id: 3,
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infuraApiKey),
      gas: 4100000
    }
  },
  rpc: {
    host: 'localhost',
    post: 8080
  }
};
