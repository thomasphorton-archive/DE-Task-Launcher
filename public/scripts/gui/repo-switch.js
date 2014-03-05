var $btn_repo_switch = $('.btn-repo-switch')
  , $gui_console = $('.gui-console')
  , $gui_status_wrapper = $('.gui-status-wrapper')
  , $gui_status = $('.gui-status')
  , $gui_status_message = $('.gui-status-message');

$btn_repo_switch.click(function() {

  var $this = $(this);

  $btn_repo_switch
    .addClass('disabled')
    .not($this)
    .removeClass('active');

  $gui_console.html("");

  $gui_status_wrapper
    .removeClass('alert-success')
    .removeClass('alert-danger');

  $gui_status.text('Working...');

  $gui_status_message.html("");

  $this.addClass('active');

});

$('.btn-ajax').click(function() {

  var $this = $(this);

  ajax_cli($this.data('command'));

})

function ajax_cli(msg) {

  url = '/cli/' + msg;

  $.post(url, function(data) {

    var json = JSON.parse(data);

    console.log(json);

    if (json.status === "OK") {
      gui_alert_class = "alert-success";
    } else {
      gui_alert_class = "alert-danger";
    }

    $gui_console.html(json.stdout);

    $gui_status_wrapper.addClass(gui_alert_class);

    $gui_status.text(json.status + ": ");

    $gui_status_message.html(json.message);

    $btn_repo_switch.removeClass('disabled');

  });

}
