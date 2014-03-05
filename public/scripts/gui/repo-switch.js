$('.btn-repo-switch').click(function() {

  var $this = $(this);

  $('.btn-repo-switch')
    .not($this)
    .removeClass('active');

  $this.addClass('active');

});

$('.btn-ajax').click(function() {

  var $this = $(this);

  ajax_cli($this.data('repository'));

})

function ajax_cli(msg) {

  url = '/cli/' + msg;

  $.ajax(url);

}
