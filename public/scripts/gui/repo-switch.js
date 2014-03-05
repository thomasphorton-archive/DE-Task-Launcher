$('.btn-repo-switch').click(function() {

  var $this = $(this);

  $('.btn-repo-switch')
    .not($this)
    .removeClass('active');

  $this.addClass('active');

  ajax_cli($this.data('repository'));

});

function ajax_cli(msg) {

  url = '/cli/' + msg;

  $.ajax(url);

}
