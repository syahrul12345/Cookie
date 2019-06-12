#!/usr/bin/env node
// dependencies
const program = require('commander')
const folder = require('./lib/folder.js')
const path = require('path')
const process = require('process')
const fs = require('fs')
//custom lbiraries
const Compile = require('./lib/compile.js')
const Deploy = require('./lib/deploy.js')
const Generate = require('./lib/generate.js')
program
  .option('new <type>','Creates new project directory')
  .option('compile','Compiles solidity smart contracts (only)')
  .option('generate','Generates the schematic for Angular frontend only')
  .option('deploy [config]','Deploy the smart contract(only)')
  .option('bake [config]','Compile & Deploy smart contract. Generate a front-end application')
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
if(program.bake === true) {
  fs.readdir(path.resolve(process.cwd(),'contract'),function(err,files) {
    files.forEach(function(file) {
      fullPath = path.resolve(process.cwd(),'contract',file)
      Compile.compile(fullPath)
    })
  })
  fs.readdir(path.resolve(process.cwd(),'build'),function(err,files) {
    files.forEach(function(file){
      Deploy.deploy(path.resolve(process.cwd(),'build',file),'default')
    })
  })
}else if(program.bake){
  fs.readdir(path.resolve(process.cwd(),'contract'),function(err,files) {
    files.forEach(function(file) {
      fullPath = path.resolve(process.cwd(),'contract',file)
      Compile.compile(fullPath)
    })
  })
  fs.readdir(path.resolve(process.cwd(),'build'),function(err,files) {
    files.forEach(function(file){
      Deploy.deploy(path.resolve(process.cwd(),'build',file),`${program.deploy}`)
    })
  })
}
if(program.generate){
  fs.readdir(path.resolve(process.cwd(),'contract'),function(err,files) {
    files.forEach(function(file) {
      Generate.generate(path.resolve(process.cwd(),'contract',file))
    })
  })
  fs.readdir(path.resolve(process.cwd(),'schematic'),function(err,files){
    files.forEach(function(file){
      console.log(JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'schematic',file))))
    })
  })
}
