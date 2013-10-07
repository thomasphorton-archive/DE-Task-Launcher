module.exports = function(grunt) {

  grunt: grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    serverFile: 'server.js',
    serverFolder: '/Users/montierelliott/Desktop/server/server.json',

    shell: {

      options: {
        stdout: true
      },

      olsToRoot: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/_sites/ols/{*,.??*} /Volumes/eneractiondev.duke-energy.com/',
      },

      rootTools: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/{*,.??*} /Volumes/eneractiondev.duke-energy.com/_sites/ols/',
      },

      youtilityToRoot: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/_sites/youtility/{*,.??*} /Volumes/eneractiondev.duke-energy.com/',
      },

      rootToyoutility: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/{*,.??*} /Volumes/eneractiondev.duke-energy.com/_sites/youtility/',
      },

      deuxToRoot: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/_sites/deux/{*,.??*} /Volumes/eneractiondev.duke-energy.com/',
      },

      rootTodeux: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/{*,.??*} /Volumes/eneractiondev.duke-energy.com/_sites/deux/',
      },

      wwwToRoot: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/_sites/www/{*,.??*} /Volumes/eneractiondev.duke-energy.com/',
      },

      rootTowww: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/{*,.??*} /Volumes/eneractiondev.duke-energy.com/_sites/www/',
      },

      mobileToRoot: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/_sites/de-mobile/{*,.??*} /Volumes/eneractiondev.duke-energy.com/',
      },

      rootTomobile: {
        command: 'sudo mv /Volumes/eneractiondev.duke-energy.com/{*,.??*} /Volumes/eneractiondev.duke-energy.com/_sites/de-mobile/',
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

  grunt.registerTask('mobile', 'Switching to mobile', function() {
    duke.initialize('mobile');
  });

  

  

};

