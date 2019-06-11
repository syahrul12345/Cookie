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
function convert(input,providedArgs,callback){
  var convertedArgs = []
  for(i=0;i<input.length;i++){
    if(typeof providedArgs[i] == input[i]['type']){
      //given same type
      convertedArgs.push(providedArgs[i])
    //String to bytes conversion
    } else if(typeof providedArgs[i] == String && input[i]['type'] == 'bytes'){
      convertedArgs = [web3.utils.asciiToHex(providedArgs[i])]
    } else if(typeof providedArgs[i] == 'number'){
      //erros immediatecallback
      //check numbers and throw errors
      if(providedArgs[i] >= Math.pow(2,8)-1 && input[i]['type'] == 'uint8'){
        convertedArgs = {'error': `Provided Argument(${i}) ${providedArgs[i]} is larger than allowed for ${input[i]['type']}`}
        break;
      }
      else if(providedArgs[i] >= Math.pow(2,16)-1 && input[i]['type'] == 'uint16'){
        convertedArgs = {'error': `Provided Argument(${i}) ${providedArgs[i]} is larger than allowed for ${input[i]['type']}`}
        break;
      }
      else if(providedArgs[i] >= Math.pow(2,32)-1 && input[i]['type'] == 'uint32'){
        convertedArgs = {'error': `Provided Argument(${i}) ${providedArgs[i]} is larger than allowed for ${input[i]['type']}`}
        break;
      }
      else if(providedArgs[i] >= Math.pow(2,256)-1 && input[i]['type'] == 'uint256'){
        convertedArgs = {'error': `Provided Argument(${i}) ${providedArgs[i]} is larger than allowed for ${input[i]['type']}`}
        break;
      }
      else if(providedArgs[i] >= Math.pow(2,256)-1 && input[i]['type'] == 'uint'){
        convertedArgs = {'error': `Provided Argument(${i}) ${providedArgs[i]} is larger than allowed for ${input[i]['type']}`}
        break;
      }else {
        convertedArgs.push(providedArgs[i])
      }
    }

  }
  callback(convertedArgs)
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
  var convertedArgs = [];
  if(input.length != 0) {
    // lets check that the arguements required by the contract
    // is the same length as the arguments that is provided in config.js
    //lets get the length fromthe environement
    providedArgs = env['contracts'][contractName]['args']
    if(input.length === providedArgs.length){
      convert(input,providedArgs,function(result) {
        convertedArgs = result
      })
      if(convertedArgs.error == undefined) {
        console.log("%s has arguments: " + convertedArgs,contractName)
      }
    }else {
      //Handle error for incorrect amount of arguments given
      console.log("Constructor for %s%s requires %d arguments but %d were given"
      ,contractName,'.sol',input.length,providedArgs.length)
    }
  }else {
    console.log('%s%s has no constructor arguments',contractName,'.sol')
  }
  console.log("Attempting to deploy... %s",contractName)
  if(convertedArgs.error != undefined) {
    console.log(convertedArgs.error)
    console.log(`Deployment of contract ${contractName} cancelled, please check arguments`)
  }else {
    try { //try to deploy contract
      deployedContract.deploy({
        data:bytecode,
        arguments:convertedArgs,
      }).send({
        from:env['deployment']['accounts'][0]['privateKey'],
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00000003', 'ether')
      },(error, transactionHash) => {
        console.log(`Successfully deployed contract ${contractName} TxHash@ ${transactionHash}`)
      }).on('error',(error) => {

      }).on('transactionHash',(transactionHash) => {

      }).on('receipt', (receipt) => {

      }).on('confirmation', (confirmationNumber, receipt) => {

      }).then((newContractInstance) => {

      });

    }catch {

    }
  }

}
