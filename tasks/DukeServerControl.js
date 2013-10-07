// Montier Elliott montier.elliott@duke-energy.com

var grunt = require('grunt');
var fs = require('fs');


var DukeServerControl = {

  doesServerJsonExist: null,

  initialize: function(server) {
    this.checkServer(function(scope) {
      grunt.log.subhead("Server JSON status:", scope.doesServerJsonExist);
      if(scope.doesServerJsonExist) scope.readJSONFile(server);
      if(!scope.doesServerJsonExist) scope.moveServerToRoot(server);
    });
	},

	moveServerToRoot: function(server) {
    grunt.log.warn("I'd like to clean up this part with some test on the filesystem");
    grunt.log.writeln("\nAssuming Root is clean");
    grunt.log.writeln("Lets begin moving " + server + " to root.");
    grunt.task.run('shell:'+server+'ToRoot');
  },

  moveRootToServer: function(fileServer, server) {
    grunt.log.writeln("Move " + server + " back to it's folder for " + fileServer + " to be moved to root");
    grunt.task.run('shell:rootTo'+fileServer+'');
    this.moveServerToRoot(server);
  },

  readJSONFile: function(server) {
    var file = grunt.file.readJSON('/Volumes/eneractiondev.duke-energy.com/server.json');
    if(file.server == server) {
      grunt.log.writeflags(file);
      grunt.fail.fatal(new Error(server +" is already on the Server"));
    } else {
      this.moveRootToServer(file.server, server);
    }
  },

  checkServer: function(cb) {
    this.doesServerJsonExist = (fs.existsSync("/Volumes/eneractiondev.duke-energy.com/server.json")) ? true : false;
    cb(this);
  },

  checkStatus: function() {
    var file = grunt.file.readJSON('/Volumes/eneractiondev.duke-energy.com/server.json');
    if(!file.server) {
      grunt.fail.fatal(new Error("Currently there is no server"));
    } else {
      grunt.log.writeln('\nCurrent Server is:', file.server);
    }   
  }

};

module.exports = DukeServerControl;