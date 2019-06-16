const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')
const process = require('process')
module.exports = {
  generate:function(fullPath) {
    //fullpath contains the location of the file eg ./contracts/some.sol
    console.log("Generating API for frontend application")
    configuration = createConfiguration(path.basename(fullPath),fullPath)
    compiled = compileSources(configuration)
    errorHandling(compiled)
    writeOutput(compiled, path.resolve(process.cwd(),"schematic"));
    createYaml()
  }
}

function createConfiguration(file,fullPath) {
  var configuration ={}
  configuration['language'] = 'Solidity'
  configuration['sources'] = {}
  content = fs.readFileSync(fullPath,'utf8')
  configuration['sources'][file] = {content}
  configuration['settings'] = {
    outputSelection:{
      '*': {
            '*': ['abi']
          }
    }
  }
  return configuration
}
//this function is used as a callback to check imported files
var dependecies = []
function getImports(dependency) {
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
        return JSON.parse(solc.compile(JSON.stringify(config),getImports));
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
    //if the current contract to be generated is the dependency, skip it
    //lets clear all dependencies first
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


function createYaml() {
  console.log(dependecies)
  //delete unwanted ABIs
  dependecies.forEach(function(dependency){
    const generatedDependency = dependency.replace('.sol','.json')
    console.log("deleting: " + generatedDependency)
    //delete is syncronously
    fs.unlinkSync(path.resolve(process.cwd(),'schematic',generatedDependency))
    fs.readdir(path.resolve(process.cwd(),'schematic'),function(error,files){
      if(files.length != 1) {
        console.log("This project has more than one main contract... please delete contracts that are not used in imports")
      }else {
        console.log(JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'schematic',files[0]))))
      }
    })
  })

}
