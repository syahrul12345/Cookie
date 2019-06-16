var express = require('express')
var path = require('path')
var process = require('process')
var fs = require('fs')
class Server {
	constructor() {
		this.app = express()
	}
}


Server.prototype.start = async function() {
	console.log("Starting server...")
	schematics = fs.readdirSync(path.resolve(process.cwd(),'schematic'))
	if(schematics.length != 1) {
		console.log("some other file exists, please delete")
	}else {
		functionArray = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'schematic',schematics[0])))['abi']
	}
	//check only 1 schematic files exists
	const port = 3000
	this.app.get('/',function(req,res){
		res.send('Hello word')
	})
	
	//lets read the functionArray, which is a list of all functions from the smart contract
	functionArray.forEach((func) => {
		this.app.get(`/${func["name"]}`,function(req,res) {
			res.send(`/${func["name"]}`)
		})
	})

	this.app.listen(port, () => console.log(`API app for Dogcollection.sol is listening on port ${port}!`))
	
}

//apis will be generated dynamically

module.exports = Server;


