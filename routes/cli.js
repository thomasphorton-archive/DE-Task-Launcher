
/*
 * GET home page.
 */

var exec = require('child_process').exec;
var sys = require('sys');

exports.task = function(req, res){

  var command;

  var task = req.params.task.toLowerCase();

  switch(task) {
  case "ols":
    command = "grunt ols";
    break;
  case "forms":
    command = "grunt forms";
    break;
  case "www":
    command = "grunt www";
    break;
  case "pe":
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

    if (stdout) {
      sys.print(stdout);
    }

    if (stderr) {
      sys.print('stderr: ' + stderr);
    }

    if (error !== null) {
      console.log('exec error: ' + error);
    }

    var json = {
      status: 'OK',
      message: 'Command <pre>' + command + '</pre> ran successfully.',
      stdout: stdout
    }

    var resp = JSON.stringify(json);

    res.send(resp);

  });

};
