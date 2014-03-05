
/*
 * GET home page.
 */

var exec = require('child_process').exec
var sys = require('sys');

exports.task = function(req, res){

  var command;

  console.log(req.params.task);

  switch(req.params.task) {
  case "OLS":
    command = "grunt ols";
    break;
  case "forms":
    command = "grunt forms";
    break;
  case "www":
    command = "grunt www";
    break;
  case "PE":
    command = "grunt PE";
    break;
  case "deux":
    command = "grunt deux";
    break;
  case "de-mobile":
    command = "grunt mobile";
    break;
  default:
    command = "grunt dukeStatus";
  }

  var child = exec(command, function(error, stdout, stderr) {

    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);

    if (error !== null) {
      console.log('exec error: ' + error);
    }

  });

  res.render('index', { title: 'Duke Grunt' });

};
