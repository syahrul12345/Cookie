const fs = require('fs')
const path = require('path')
//folder.js handles the project creation
module.exports = {
  create: function(cwd,callback) {
    fs.mkdir(cwd,{recursive: true},function(err) {
      if(err) {
        if( err.code == 'EEXIST') {
          callback("Folder with same name already exists")
        }
      }else {
        folders = ['contract','config','app','build'];
        folders.forEach(function(value) {
          fs.mkdir(path.resolve(cwd,value),function(err) {
            if(err) {
              callback("Failed to create project with subfolder")
            }
          })

        })
        callback("Project SuccessFully Created")
      }
    })
  }
}
