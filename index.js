#!/usr/bin/env node
// dependencies
const program = require('commander')
const folder = require('./lib/folder.js')
const Compile = require('./lib/compile.js')
const Deploy = require('./lib/deploy.js')
const path = require('path')
const process = require('process')
const fs = require('fs')

program
  .option('new <type>','Creates new project directory')
  .option('compile','Compiles solidity smart contracts (only)')
  .option('deploy [config]','Deploy the smart contract(only)')

//parse arguments
program.parse(process.argv);
//handle the different flags
if (program.new){
  //creates a new project in current folder
  //__dirname is the current folder, use this
  folder.create(path.resolve(process.cwd(),`${program.new}`),function(result) {
    if (result) console.log(result)
  })
}
if (program.compile) {
  //get the location of smart bcontracts
  fs.readdir(path.resolve(process.cwd(),'contract'),function(err,files) {
    files.forEach(function(file) {
      fullPath = path.resolve(process.cwd(),'contract',file)
      Compile.compile(fullPath)
    })
  })
}
if (program.deploy === true) {
  //get the bin and deploy
  fs.readdir(path.resolve(process.cwd(),'build'),function(err,files) {
    files.forEach(function(file){
      Deploy.deploy(path.resolve(process.cwd(),'build',file),'default')
    })
  })
}
else if(program.deploy){
  fs.readdir(path.resolve(process.cwd(),'build'),function(err,files) {
    files.forEach(function(file){
      Deploy.deploy(path.resolve(process.cwd(),'build',file),`${program.deploy}`)
    })
  })
}
