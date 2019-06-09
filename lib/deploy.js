const fs = require('fs-extra')
const path = require('path')
const process = require('process')
const Web3 = require('web3')

module.exports = {
  deploy: function(bytePath,deployConfig) {
    // (Smart contract things)
    // 1) Check Constructor Arguments
    // 2) Address to send from
    // 3) Gas
    // 4) Gas Price
    //
    abiPath = bytePath.replace(/\.[^/.]+$/, ".json")
    var bytecode = fs.readFileSync(bytePath).toString()
    var abi = JSON.parse(fs.readFileSync(abiPath).toString())
    //load the configuration information regarding the smart contract
    env = loadConfig(deployConfig)
    deploy(bytecode,abi,env)
  }
}
function loadConfig(deployConfig){
  const config = require(path.resolve(process.cwd(),'config','config.js'))
  if(config[deployConfig] === undefined) {
    console.log('>>>> Warning <<<<')
    console.log("The environment that you selected does not exist")
    console.log("Using default enviroment")
    console.log('\n')
    return config['default']
  }else {
    return config[deployConfig]
  }
}
function deploy(bytecode,abi,env){
  if(env['deployment']['protocol'] == undefined) {
    protocol = 'http'
  }
  else {
    protocol = env['deployment']['protocol']
  }
  node = protocol+'://'+env['deployment']['host']+":"+env['deployment']['port']
  web3 = new Web3(node)
  deployedContract = new web3.eth.Contract(abi)
  deployedContract.deploy({
    data:bytecode,
    arguments:constructorArgs
  })
}
