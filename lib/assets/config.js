module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      accounts: [
        {
          privateKey:"0x8f5d5ff3aa251a41113a4a31bb1fe422958e1cb7",
        }
        /*,accounts: [
          {
            privateKey: "your_private_key",
            balance: "5 ether"  // You can set the balance of the account in the dev environment
                                // Balances are in Wei, but you can specify the unit with its name
          },
          {
            privateKeyFile: "path/to/file", // Either a keystore or a list of keys, separated by , or ;
            password: "passwordForTheKeystore" // Needed to decrypt the keystore file
          },
          {
            mnemonic: "12 word mnemonic",
            addressIndex: "0", // Optional. The index to start getting the address
            numAddresses: "1", // Optional. The number of addresses to get
            hdpath: "m/44'/60'/0'/0/" // Optional. HD derivation path
          },
          {
            "nodeAccounts": true // Uses the Ethereum node's accounts
          }
        ]*/
      ],
      host: "localhost", // Host of the blockchain node
      port: 8545, // Port of the blockchain node
      type: 'ws' // Type of connection (ws or rpc),

    },
    // order of connections the dapp should connect to
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      "Dog": {
        args:['jaime']
      },
      "DogCollection": {
        args:[250]
      }

    }

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
    //            contracts section.
    //strategy: 'implicit',


    //if there are arguments, for SimeplStorage
    // contracts:{
    //   SimpleStorage: {
    //     args: [100]
    //   }
    // }

  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ]
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {

  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },
  //run our own special embark node :)
  chainstack: {
    // Blockchain node to deploy the contracts
    deployment: {
      accounts: [
        {
          privateKeyFile: "/Users/muhdsyahrulnizam/Library/Ethereum/keystore/UTC--2019-05-09T00-41-50.909183000Z--9dc8ecf11084584abb0c593e799313848fd7dfea",
          password:"hahaz123",
          balance: "1235243213123123"
        },
      ],
      host: "nd-986-703-606.p2pify.com", // Host of the blockchain node
      port: false, // Port of the blockchain node
      protocol:'https',
      type: 'rpc'
    },
    dappConnection: [
      "$WEB3",
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      "Art": {
        args:[1000]
      }

    }
  }

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};
