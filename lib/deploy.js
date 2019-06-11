const fs = require('fs-extra')
const path = require('path')
const process = require('process')
const Web3 = require('web3')

module.exports = {
  deploy: function(compiledPath,deployConfig) {
    // (Smart contract things)
    // 1) Check Constructor Arguments
    // 2) Address to send from
    // 3) Gas
    // 4) Gas Price
    //
    compiledContract = JSON.parse(fs.readFileSync(compiledPath).toString())
    env = loadConfig(deployConfig)
    var bytecode = compiledContract['evm']['bytecode']['object']
    var abi = compiledContract['abi']
    var contractName = path.basename(compiledPath).replace(/\.[^/.]+$/, "")
    deploy(bytecode,abi,contractName,env)
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

function checkConstructor(abi) {
  var input = []
  for(let method of abi) {
    if(method['signature'] === 'constructor'){
      //check if the constructor requires inputs
      input = method['inputs']
      break;
    }
  }
  return input
}
function convert(input,providedArgs){
  var convertedArgs = []
  for(i=0;i<input.length;i++){
    if(typeof providedArgs[i] == typeof input[i]['type']){
      convertedArgs.push(providedArgs[i])
    }else{
      //input[i]['type'] is the type of argument required
      console.log(input[i]['type'])
      //do some type conversion here
    }
  }
  return convertedArgs;

}

function deploy(bytecode,abi,contractName,env){
  if(env['deployment']['protocol'] == undefined) {
    protocol = 'http'
  }
  else {
    protocol = env['deployment']['protocol']

  }
  node = protocol+'://'+env['deployment']['host']+":"+env['deployment']['port']
  web3 = new Web3(node)
  deployedContract = new web3.eth.Contract(abi)
  //lets check if the contract has constructor arguments
  var input = checkConstructor(abi)
  if(input.length != 0) {
    // lets check that the arguements required by the contract
    // is the same length as the arguments that is provided in config.js
    //lets get the length fromthe environement
    providedArgs = env['contracts'][contractName]['args']
    if(input.length === providedArgs.length){
      convertedArgs = convert(input,providedArgs)
    }else {
      console.log("Constructor for %s%s requires %d arguments but %d were given"
      ,contractName,'.sol',input.length,providedArgs.length)
    }

  }else {
    console.log('%s%s has no constructor arguments',contractName,'.sol')
  }
  // constructorArgs = env['contracts'][contractName]['args']
  // deployedContract.deploy({
  //   data:bytecode,
  //   arguments:constructorArgs
  //
  // })
}
