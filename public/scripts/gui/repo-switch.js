var $btn_repo_switch = $('.btn-repo-switch')
  , $gui_console = $('.gui-console');

$btn_repo_switch.click(function() {

  var $this = $(this);

  $btn_repo_switch
    .addClass('disabled')
    .not($this)
    .removeClass('active');

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

    $gui_console.html(json.stdout);

    $btn_repo_switch.removeClass('disabled');

  });

}
