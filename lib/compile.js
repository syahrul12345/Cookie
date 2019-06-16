const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')
const process = require('process')
module.exports = {
  compile:function(files) {
    //fullpath contains the location of the file eg ./contracts/some.sol
    const configuration = createConfiguration(files)
    const compiled = compileSources(configuration)
    errorHandling(compiled)
    writeOutput(compiled, path.resolve(process.cwd(),"build"));
  }
}

function createConfiguration(files) {
  var configuration ={}
  configuration['language'] = 'Solidity'
  configuration['sources'] = {}
  files.forEach(function(file) {
    content = fs.readFileSync(path.resolve(process.cwd(),'contract',file),'utf8')
    configuration['sources'][file] = {content}
  }) 
  configuration['settings'] = {
    outputSelection:{
      '*': {
            '*': ['abi','evm.bytecode']
          }

    }
  }
  return configuration
}
//this function is used as a callback to check imported files
var dependecies = []
function getImports(dependency) {
  console.log('Searching for dependency: ', dependency);
  dependecies.push(dependency)
  try{
    return {contents: fs.readFileSync(path.resolve(process.cwd(),"contract",dependency),'utf8')}
  }
  catch(err){
    return err
  }
}

function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config), getImports));
    } catch (e) {
        console.log(e);
    }
}

function errorHandling(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}

function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);
    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        //saves the ABI to a JSON file
        console.log('Writing: ', contractName + '.json');
        fs.outputJsonSync(
            path.resolve(buildPath, contractName + '.json'),
            compiled.contracts[contractFileName][contractName]
        );
    }
}
