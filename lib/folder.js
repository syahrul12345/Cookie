const fs = require('fs-extra')
const path = require('path')
const config = require('./assets/config.js')
//folder.js handles the project creation
module.exports = {
  create: function(cwd,callback) {

    fs.mkdir(cwd,{recursive: true},function(err) {
      if(err) {
        if( err.code == 'EEXIST') {
          callback(`Folder with same name exists`)
        }
      }else {
        folders = ['contract','config','app','build',"schematic"];
        folders.forEach(function(value) {
          fs.mkdir(path.resolve(cwd,value),function(err) {
            if(value == 'config') {
              fs.outputJsonSync(path.resolve(cwd,'config','config.js'),config)
            }
            if(err) {
              callback(`Failed to create project with subfolder ${value}`)
            }
          })
        //lets copy the config file
        
      })
        
      }
    })
    callback("Project SuccessFully Created")
  }
}
