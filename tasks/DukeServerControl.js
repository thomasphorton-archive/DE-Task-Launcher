// Montier Elliott montier.elliott@duke-energy.com
// Tom Horton thomasphorton@gmail.com

var grunt = require('grunt');
var fs = require('fs');

var config = require('../config.json');

var DukeServerControl = {

  doesServerJsonExist: null,

  initialize: function (repo) {

    this.checkServer(function (scope) {

      grunt.log.subhead("server.json: ", scope.doesServerJsonExist);

      if (scope.doesServerJsonExist) {

        scope.readJSONFile(repo);

      }

      if (!scope.doesServerJsonExist) {

        grunt.log.warn("Server.json does not exist at the root.");

        scope.moveServerToRoot(repo);

      }

    });
	},

	moveServerToRoot: function (repo) {

    grunt.log.warn("I'd like to clean up this part with some test on the filesystem");
    grunt.log.writeln("Assuming Root is clean.");
    grunt.log.writeln("Lets begin moving " + repo + " to root.");

    grunt.task.run('shell:' + repo + 'ToRoot');

  },

  moveRootToServer: function (newRepo, oldRepo) {

    grunt.log.writeln("Putting away " + oldRepo);

    grunt.task.run('shell:rootTo' + oldRepo);

    grunt.log.writeln("Moving " + newRepo + " to root");

    this.moveServerToRoot(newRepo);

  },

  readJSONFile: function (newRepo) {

    var file = grunt.file.readJSON('/Volumes/' + config.server + '/server.json');

    var oldRepo = file.server;

    if (newRepo == oldRepo) {

      grunt.log.writeflags(file);

      grunt.fail.fatal(new Error(oldRepo + " is already active."));

    } else {

      this.moveRootToServer(newRepo, oldRepo);

    }

  },

  checkServer: function (cb) {

    var filepath = "/Volumes/" + config.server + "/server.json";

    this.doesServerJsonExist = (fs.existsSync(filepath)) ? true : false;

    cb(this);

  },

  checkStatus: function () {

    var filepath = "/Volumes/" + config.server + "/server.json";

    var file = grunt.file.readJSON(filepath);

    if(!file.server) {

      grunt.fail.fatal(new Error("file.server is not set in /server.json."));

    } else {

      grunt.log.writeln('Active Repository: ', file.server);

    }

  }

};

module.exports = DukeServerControl;
