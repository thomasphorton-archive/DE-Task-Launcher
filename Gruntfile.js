var config = {
    server: 'sandboxdev.duke-energy.com'
};

module.exports = function(grunt) {

  grunt: grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    serverFile: 'server.js',

    shell: {

      options: {
        stdout: true
      },

      olsToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/ols/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootTools: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/ols/',
      },

      youtilityToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/youtility/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootToyoutility: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/youtility/',
      },

      deuxToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/deux/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootTodeux: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/deux/',
      },

      wwwToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/www/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootTowww: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/www/',
      },

      mobileToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/de-mobile/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootTomobile: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/de-mobile/',
      },

      lightingToRoot: {
        command: 'sudo mv /Volumes/' + config.server + '/_sites/outdoor-lighting/{*,.??*} /Volumes/' + config.server + '/',
      },

      rootTolighting: {
        command: 'sudo mv /Volumes/' + config.server + '/{*,.??*} /Volumes/' + config.server + '/_sites/outdoor-lighting/',
      }

    }
    

  });
  
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var duke = require('./tasks/DukeServerControl');

  grunt.registerTask('dukeStatus', 'Switching to OLS', function() {
    duke.checkStatus();
  });

  grunt.registerTask('ols', 'Switching to OLS', function() {
    duke.initialize('ols');
  });

  grunt.registerTask('youtility', 'Switching to youtility', function() {
    duke.initialize('youtility');
  });

  grunt.registerTask('deux', 'Switching to deux', function() {
    duke.initialize('deux');
  });

  grunt.registerTask('www', 'Switching to www', function() {
    duke.initialize('www');
  });

  grunt.registerTask('outdoor-lighting', 'Switching to outdoor lighting', function() {
    duke.initialize('lighting');
  });

  grunt.registerTask('mobile', 'Switching to mobile', function() {
    duke.initialize('mobile');
  });

};

