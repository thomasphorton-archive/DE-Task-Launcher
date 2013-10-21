// Save a reference to the global object
var root = this;

$(function() {

  // Namespace CCP object
  root.CCP = {};

  // Give hash a default value of 'your information'
  if ( !window.location.hash ) {
    window.location.hash = 'your-information';
  }

  // Duke Cookies
  // ---------------

  // We use this on our public site, but i wanted to make sure
  // CCP never needs for anything so here is it's own duke cookie
  // object
  //

  CCP._DUKECOOKIE = {

    create: function(name,value,days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
      }
      else var expires = '';
      document.cookie = name + '=' + value + expires + '; path=/';
    },

    read: function(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length); 
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    },

    erase: function(name) {
      dukeCookie.create(name,'',-1);
    },

    validate: function(name, value) {
      for(var i = 0; i < customer[name].length; i++) {
        if(value == customer[name][i]) return true;
      }
      return false;
    }

  };

  // CCP TrackPages
  // ---------------

  // Hook into Google Analytics 
  //

  CCP._TRACKPAGES = {

    currentTab: window.location.hash,

    trackTabClick: function(hash) {
      var tab = this.currentTab = hash;
      this.pushtoGoogle(tab.replace('#', '') + '/');
    },

    ccpChangeLinkClick: function(rel) {
      var query = this.currentTab.replace('#', '') + '/' + rel.replace('#', '') + '/';
      this.pushtoGoogle(query);
      return CCP._INFORMATION;
    },

    cancel: function(rel) {
      var query = this.currentTab.replace('#', '') + '/' + rel.replace('#', '') + '/';
      this.pushtoGoogle(query + 'cancel/');
      return CCP._INFORMATION;
    },

    // waiting to complete submit
    submitForm: function(rel) {
      var query = this.currentTab.replace('#', '') + '/' + rel.replace('#', '') + '/';
      this.pushtoGoogle(query + 'submit/');
    },

    pushtoGoogle: function(query) {
      _gaq.push(
        [ '_setAccount', 'UA-11304865-4' ], 
        // ['_setCustomVar', 1, 'State', 'NC'], 
        // ['_setCustomVar', 2, 'Segment', 'RES'], 
        // ['_setCustomVar', 3, 'Hub Account ID', '0123456789'], 
        // ['_setAllowLinker', true], 
        // ['_setDomainName', '.duke-energy.com'], 
        [ '_trackPageview', '/preferences/' + query ]
      );

      console.info("Track page: ", '/preferences/' + query);
    }

  };

  // Which prototype will be used on CCP | by default 'singleDukeBusiness'
  CCP._PROTOTYPECOOKIE = (CCP._DUKECOOKIE.read('proto')) ? CCP._DUKECOOKIE.read('proto') : 'singleDukeBusiness';

  // CCP.Prototype
  // ---------------

  // A module that contains functions for displaying the
  // correct information on CCP
  //

  CCP._PROTOTYPE = {

    parsedPrototype: null,

    // cache specifics to prototype
    $single: $('.single-specific'),
    $multiple: $('.multiple-specific'),
    $residential: $('.residential-specific'),
    $business: $('.business-specific'),
    $florida: $('.florida-specific'),
    $intl: $('.intl-specific'),
    $untied: $('.us-specific'),
    $canada: $('.ca-specific'),

    // Loops through fieldset rows for looking for 
    // DOM elements that shouldn't be present
    render: function(prototype) {
      var captilizationIndex = this.splitProtoCookie(prototype);
      this.parsedPrototype = this.prototypeValues(captilizationIndex, prototype);
      this[this.parsedPrototype[0]]();
      this[this.residentialBusiness([this.parsedPrototype[2], this.parsedPrototype[3]])]().addOdd();
      return this;
    },

    single: function() {
      this.deleteElement(this.$multiple);
      return this;
    },

    multiple: function() {
      this.deleteElement(this.$single);
      return this;
    },

    business: function() {
      this.deleteElement(this.$residential);
      return this;
    },

    residential: function() {
      this.deleteElement(this.$business);
      return this;
    },

    addOdd: function() {
      $('#ccp-information > div:even').addClass('odd');
      $('.ccp-notifications form#ccp-notifications-outages-form > section > div .row:even').addClass('odd');
      $('.ccp-notifications form#ccp-notifications-billing-form > section > div .row:even').addClass('odd');
      $('#ccp-subscriptions form > .row:even').addClass('odd');
    },

    deleteElement: function(items) {
      items.remove();
    },

    hideElement: function(items, cb) {
      items.hide();
      cb();
    },

    showElement: function(items) {
      items.show();
    },

    // Returns true and false based of test for
    // uppercase characters 
    checkCaptilization: function(chars) {
      return /[A-Z]/.test(chars);
    },

    // Pushes an array of the capital letters in the string
    splitProtoCookie: function(prototype) {
      var scope = this, prototypeIndex = [];
      $.each(prototype, function(i, storage) {
        if(scope.checkCaptilization(prototype.charAt(i))) prototypeIndex.push(i);
      });
      return prototypeIndex;
    },

    // Returns an array of strings used to define our
    // prototype 
    prototypeValues: function(index, prototype) {
      var values = [];
      values.push(prototype.substring(0, index[0]));
      values.push(prototype.substring(index[0], index[1]));
      values.push(prototype.substring(index[1], index[2]));
      if(index[2] !== null) values.push(prototype.substring(index[2], index[3]));
      return values;
    },

    residentialBusiness: function(items) {
      var value;
      $.each(items, function(i, storage) {
        if(storage == 'Residential'){
          value = 'Residential';
        } else if(storage == 'Business') {
          value = 'Business';
        }
      });
      return value.toLowerCase();
    },

    otherFlorida: function(items) {
      var value;
      $.each(items, function(i, storage) {
        if(storage == 'Florida'){
          value = 'Florida';
        } else if(storage == 'Other') {
          value = 'Other';
        }
      });
      return value.toLowerCase();
    },

    resizeLightbox: function() {
      $('#overlay, #overlay-content').height( $('#ccp-edit-form').height() + 15 );
      $('.edit-mailing-address > .row, .edit-email-address > .row, .edit-phone-numbers > .row').removeClass('odd');
      $('.edit-mailing-address > .row:visible:even').addClass('odd');
      $('.edit-email-address > .row:visible:even').addClass( 'odd' );
      $('.edit-phone-numbers > .row:visible:even').addClass( 'odd' );
    }

  };

  // Rendering Prototype
  CCP._PROTOTYPE.render(CCP._PROTOTYPECOOKIE);

  // Create Tabs
  // ---------------

  // Use hash variable to add active-tab class to the 
  // corresponding href attribute. Save the index of the parent
  // to use on corresponding fieldset

  CCP._TABS = {

    // Tell us the index of the active tab to correspond with it's
    // partner of ccp.section fieldset
    activeTabIndex: null,
    
    disable: function() {
      $('.ccp-header ul li a').removeClass('active-tab');
      $('.ccp-section fieldset').hide();
      return this;
    },

    enable: function() {
      var hash = window.location.hash || 'your-information';
      $('.ccp-header ul li a[href="'+ hash + '"]').addClass('active-tab');
      this.activeTabIndex = $('.active-tab').parent().index();
      $( $('.ccp-section fieldset')[this.activeTabIndex] ).show();
      return root;
    }

  };

  // The click will automatically trigger a hash change
  // so there is no need to do a click function
  CCP._TABS.enable();
  $(window).hashchange(function(e) {
    if(CCP._SUBSCRIPTIONS.edit || CCP._NOTIFICATIONS.edit) {
      CCP._INFORMATION.lastActive = '#save-changes';
      CCP._INFORMATION.createLightBox().loadInformation(function() {
        CCP._TABS.disable().enable().CCP._TRACKPAGES.trackTabClick(window.location.hash);
      });
    } else {
      CCP._TABS.disable().enable().CCP._TRACKPAGES.trackTabClick(window.location.hash);
    }
  });

  // Create Information UI
  // ---------------

  // When clicking on ccp-change-link this renders and performs
  // accordling to the href 
  //

  CCP._INFORMATION = {

    // Set whats active and view. Will be set on
    // click event of this eleent $('.ccp-change-link')
    lastActive: null,
    dir: 'edits/default.asp',

    render: function($el) {
      var scope = this;
      this.lastActive = $el.attr('href').substring($el.attr('href').indexOf('#'));
      CCP._TRACKPAGES.ccpChangeLinkClick(this.lastActive).createLightBox(this.lastActive).loadInformation(function() {
        CCP._POPULATE.render(scope.lastActive);
      });
      console.info('Activated: %s', this.lastActive);
    },

    createLightBox: function() {
      this.openLightBox({
        source: 'data',
        content: '<form id="ccp-edit-form" />',
        maskClass: 'ccp-mask',
        height: 375,
        width: 500
      });
      return this;
    },

    // Loads information into form
    loadInformation: function(cb) {
      var scope = this;
      $('#ccp-edit-form').load(this.dir + ' ' + this.lastActive, function() {
        if(CCP._SUBSCRIPTIONS.edit || CCP._NOTIFICATIONS.edit) {
          $(this).find('> fieldset').append(scope.appendSave());
        } else {
          $(this).find('> fieldset').append(scope.appendSubmit());
        }
        $('#overlay, #overlay-content').height( $(this).height() + 15 );
        cb();
      });
      return root;
    },

    appendSubmit: function() {
      var submitAppend = [
        '<div class="row ccp-lightbox-submit">',
          '<div class="column span11">',
            '<button class="btn green ccp-edit-submit" type="submit">',
              '<span>Submit</span>',
            '</button>',
            '<a href="#" class="form-cancel ccp-lightbox-close">Cancel</a>',
          '</div>',
        '</div>'
      ].join('');
      return submitAppend;
    },

    appendSave: function() {
      var submitAppend = [
        '<div class="row ccp-lightbox-submit">',
          '<div class="column span11">',
            '<button class="btn green ccp-submit-continue" type="submit">',
              '<span>Save Changes</span>',
            '</button>',
            '<a href="#" class="ccp-continue">Continue Without Saving</a>',
          '</div>',
        '</div>'
      ].join('');
      return submitAppend;
    },

    // Lightbox functions created also used on
    // duke sites
    openLightBox: function(options) {

      var scope = this;

      var settings = {
        height: 586,
        width: 780,
        content: '#',
        wrapClass: '',
        maskClass: '',
        source: 'iframe',
        onClose: function () { // added to allow new functions to be added to the lightbox close.
          scope.closeLightBox();
          return false;
        }

      };

      if (typeof options == 'object') {
        $.extend(settings, options);
      } else {
        settings.content = options;
      }

      var overlayHTML = [
        '<div id="overlay" class="ccp-lightbox">',
          '<div class="ccp-close">X</div>',
          '<div id="overlay-content"></div>',
        '</div>',
        '<div id="overlay-mask"></div>'
      ].join('');

      $('body').append($(overlayHTML).hide().fadeIn());

      $('#overlay')
        .addClass(settings.wrapClass)
        .css({
          'width': (settings.width) + 'px',
          'height': (settings.height) + 'px',
          'margin-left': '-' + (settings.width / 2) + 'px'
        });

      $('#overlay-mask').css({
        'height': $(document).height()
      });

      if (settings.source == 'iframe') {
        $('#overlay-content').html('<iframe id="overlay-frame" src="' + settings.content + '" frameborder="0" width="100%" height="' + settings.height + '">');

      } else {
        $('#overlay-content').html(settings.content);
        $('#overlay-content').height(settings.height);
        $('#overlay-content').width(settings.width);
        $('#overlay').height(settings.height);
      }

      $('#overlay-mask, #overlay').show();
      $('#overlay-content').addClass(settings.maskClass);
      $('html, body').animate({
        scrollTop: 0
      }, '500');
    },

    closeLightBox: function(options) {
      
      $('.form-tooltip-error').remove();

      var confirmPage = true;
      var settings = {
        URL: null,
        showConfirm: false,
        msg: 'Are you sure you want to cancel the request? Any information you entered will be lost.'
      };

      if (typeof options == 'object') {
        $.extend(settings, options);
      } else {
        settings.URL = options;
      }

      if (confirmPage || !settings.showConfirm) {
        $('#overlay-mask, #overlay').fadeOut('fast').remove();
      } else if (confirm(settings.msg)) {
        $('#overlay-mask, #overlay').fadeOut('fast').remove();
        return true;
      }

      if (settings.URL) {
        var sep = (loc.indexOf('?')) ? '&' : '?';
        loc = loc.split('#')[0] + sep + 'reload=true' + loc.split('#')[1];
        window.location = loc;
      }
    }

  };

  // Control and populate lightbox
  // ---------------

  // When each lightbox is opened it needs to be populated
  // with information
  //

  CCP._POPULATE = {

    render: function(opened) {
      var manage = '#manage-';
      this.addDomEventForSubmit().addMask();
      if (opened.indexOf('#manage-') > -1) this.currentaccount()[opened.replace(manage, '').replace('-', '')]();
      return this;
    },

    currentaccount: function() {
      var currentaccount = $('#ccp-accounts :selected').val();
      $('.ccp-current-account p').text(currentaccount);
      return this;
    },

    accounttype: function() {
      console.warn('No need to popluate anything for account type');
      return false;
    },

    marketsegment: function() {
      console.warn('No need to popluate anything for market segment');
      return false;
    },

    primaryaccount: function() {
      this.accounts = $('#ccp-accounts').html();
      $('#check-primary-account').append(this.accounts);
    },

    accountnickname: function() {
      this.nickname = $('.account-nickname').text();
      $('#check-account-nickname').val(this.nickname);
    },

    validate: function(e, cb) {
      var inputs = $('form input:visible').validator();
      if ( inputs.length > 0 ) {
        if ( !inputs.data('validator').checkValidity() ) {
          e.preventDefault();
        } else {
          cb(e);
        }
      } else {
        cb(e);
      }
    },

    mailingaddress: function() {
      var type, radio;
      if(CCP._PROTOTYPE.parsedPrototype[1] == 'Progress'){
        type = CCP._PROTOTYPE.otherFlorida([CCP._PROTOTYPE.parsedPrototype[2], CCP._PROTOTYPE.parsedPrototype[3]]);
        CCP._MAILINGADDRESS[type]();
      }
      if(CCP._PROTOTYPE.parsedPrototype[1] == 'Duke') CCP._MAILINGADDRESS.other();
      CCP._MAILINGADDRESS.addDomEventForRadioButtons(function(value) {
        radio = value;
        if(radio == 'service-address') CCP._MAILINGADDRESS.serviceAddress(type);
        if(radio == 'mailing-address') CCP._MAILINGADDRESS.mailAddress(type);
      });
      CCP._MAILINGADDRESS.addDomEventForSelectButton(function(value) {
        if(value == 'Canada') CCP._MAILINGADDRESS.canada();
        if(value == 'United States') CCP._MAILINGADDRESS.states();
        if(value != 'Canada' && value != 'United States') CCP._MAILINGADDRESS.international();
      });
    },

    phonenumbers: function() {
      this.addDomItem('.ccp-add-phone-number', function($el) {
        $el.hide();
        $el.next().show();
      });
      CCP._PROTOTYPE.resizeLightbox();
      $('#check-primary-number').val($('.number-a').text());
      if($('.number-b').text()){
        $('.ccp-add-phone-number').click();
        $('#check-alternate-phone-number').val($('.number-b').text());
        $('.ccp-alternate-mobile').show();
      }
    },

    emailaddresses: function() {
      this.addDomItem('.ccp-add-email', function($el) {
        $el.hide();
        $el.next().show();
        CCP._TRACKPAGES.pushtoGoogle('alternate-email-address/');
      });
      CCP._PROTOTYPE.resizeLightbox();
      this.addDomItem('.change-primary-email-address', function($el) {
        CCP._INFORMATION.closeLightBox();
        CCP._INFORMATION.createLightBox();
        CCP._TRACKPAGES.pushtoGoogle('manage-primary-email-address/');
        var link = $el.attr('href');
        CCP._INFORMATION.lastActive = link.substring(link.indexOf('#'));
        CCP._INFORMATION.loadInformation(function() {
          var prototype = CCP._PROTOTYPE.residentialBusiness([CCP._PROTOTYPE.parsedPrototype[2], CCP._PROTOTYPE.parsedPrototype[3]]);
          if(prototype == 'residential') CCP._PROTOTYPE.deleteElement($('.description'));
          $('#check-primary-email-address').val($('.email-a').text());
          CCP._PROTOTYPE.resizeLightbox();
        });
      });
    },

    // Utilities for CCP._POPULATE
    // ----------------------------
    addMask: function() {
      $('.form-phone-mask').mask('(999) 999-9999');
      $('.form-zip-mask').mask('99999');
    },

    addDomEventForSubmit: function() {
      var that = this;
      this.extendValidator();
      $('body').on('click', '.ccp-edit-submit', function(e) {
        that.validate(e, function(e) {
          CCP._TRACKPAGES.submitForm(CCP._INFORMATION.lastActive, e);
        });
      });
      return this;
    },

    extendValidator: function() {
      $.extend($.tools.validator.conf, {
        position: 'top center',
        offset: [-10, 0],
        message: '<div><em/></div>',
        messageClass: 'form-tooltip-error'
      });
    },

    addDomItem: function(item, cb) {
      $('body').on('click', item, function(e) {
        cb($(this), e);
        e.preventDefault();
      });
    }

  };

  // Mailing Address Controls
  // ---------------

  // Mailing Address is a huge modal that contains several
  // different views lets give it's controls there own namespace
  // object not to be confused with populating namespace
  //

  CCP._MAILINGADDRESS = {

    // Control and populate lightbox
    // ---------------

    // When each lightbox is opened it needs to be populated
    // with information
    //
    addDomEventForRadioButtons: function(cb) {
      $('body').on('click', 'input[name="address"]', function() {
        var value = $(this).val().replace('change-', '');
        cb(value);
      });
    },

    addDomEventForSelectButton: function(cb) {
      $('body').on('change', '#check-country', function() {
        var value = $(this).val();
        cb(value);
      });
    },

    mailAddress: function(type) {
      $('.edit-mailing-address').find('input[type="text"]').show();
      $('.edit-mailing-address').find('input[type="text"]').next().hide();
      $('#check-state').removeAttr('disabled');
      if(type == 'florida') $('#check-country').removeAttr('disabled');
    },

    serviceAddress: function(type) {
      this.states();
      $('.edit-mailing-address').find('input[type="text"]').hide();
      $('.edit-mailing-address').find('input[type="text"]').next().show();
      $('#check-state').prop('disabled', 'disabled');
      if(type == 'florida') {
        $('option[value="United States"]').prop('selected', 'selected');
        $('#check-country').prop('disabled', 'disabled');
      }
    },

    florida: function() {
      // send to prototype for rendering
      CCP._PROTOTYPE.hideElement($('.international-specific, .canada-specific'), function() {
        CCP._PROTOTYPE.showElement($('.states-specific'));
      });
      CCP._PROTOTYPE.resizeLightbox();
    },

    other: function() {
      CCP._PROTOTYPE.deleteElement($('.florida-specific, .international-specific'));
      CCP._PROTOTYPE.hideElement($('.canada-specific'), function() {
        CCP._PROTOTYPE.showElement($('.states-specific'));
      });
      CCP._PROTOTYPE.resizeLightbox();
    },

    canada: function() {
      CCP._PROTOTYPE.hideElement($('.states-specific, .international-specific'), function() {
        CCP._PROTOTYPE.showElement($('.canada-specific'));
      });
      CCP._PROTOTYPE.resizeLightbox();
    },
    
    states: function() {
      CCP._PROTOTYPE.hideElement($('.canada-specific, .international-specific'), function() {
        CCP._PROTOTYPE.showElement($('.states-specific'));
      });
      CCP._PROTOTYPE.resizeLightbox();
    },

    international: function() {
      CCP._PROTOTYPE.hideElement($('.canada-specific, .states-specific'), function() {
        CCP._PROTOTYPE.showElement($('.international-specific'));
      });
      CCP._PROTOTYPE.resizeLightbox();
    }

  };

  // Subscriptions UI
  // ---------------

  // This is light we just need to save the edit boolean
  // but just in case let it keep it's namespace
  //

  CCP._SUBSCRIPTIONS = {

    edit: false

  };

  // Notifications Controls
  // ---------------

  // Keeps edit boolean. If manage if activated we need hook in to 
  // other lightboxes
  //

  CCP._NOTIFICATIONS = {

    edit: false,

    manage: function($el) {
      var value = $el.attr('class').replace('notifications-', '');
      if(value.indexOf('email') > -1 ) CCP._INFORMATION.lastActive = '#manage-email-addresses';
      if(value.indexOf('email') == -1) CCP._INFORMATION.lastActive = '#manage-phone-numbers';
      if(CCP._INFORMATION.lastActive == '#manage-phone-numbers') {
        CCP._TRACKPAGES.pushtoGoogle('notifications/manage-phone-numbers/');
      } else {
        CCP._TRACKPAGES.pushtoGoogle('notifications/manage-email-addresses/');
      }
      CCP._INFORMATION.createLightBox().loadInformation(function() {
        CCP._PROTOTYPE.resizeLightbox();
        CCP._POPULATE.phonenumbers();
        CCP._POPULATE.emailaddresses();
        CCP._POPULATE.addMask();
        CCP._POPULATE.addDomEventForSubmit();
      });

    },

    scrollNow: function() {
      $('html,body').animate({
        scrollTop: $("#ccp-notifications").offset().top
      }); 
    }

  };
  
  // An event click on ccp-change-link to open a Lightbox
  // and display the proper information
  $('.ccp-change-link').click(function(e) {
    // Render CCP Information page
    CCP._INFORMATION.render($(this));
    e.preventDefault();
  });

  // When your click cancel or X to get rid of
  // lightbox
  $('body').on('click', '.ccp-close, .ccp-lightbox-close', function(e) {
    // Send Tracked pages
    CCP._TRACKPAGES.cancel(CCP._INFORMATION.lastActive);
    // Close lightbox
    CCP._INFORMATION.closeLightBox();
    e.preventDefault();
  });

  // Activates subscriptions page with submit button
  $('#ccp-subscriptions-form input[name="subscriptions"]').click(function() {
    CCP._PROTOTYPE.showElement($('.ccp-subscriptions-submit'));
    CCP._SUBSCRIPTIONS.edit = true;
  });

  // Hides subscriptions submit bar and cancel outs form
  $('.ccp-subscriptions-submit > .form-cancel').click(function(e) {
    CCP._SUBSCRIPTIONS.edit = false;
    $('.ccp-subscriptions-submit').hide();
    e.preventDefault();
  });

  // Activate notifications page with submit button
  $('#ccp-notifications-form input[type="checkbox"]').click(function() {
    CCP._NOTIFICATIONS.scrollNow();
    CCP._PROTOTYPE.showElement($('.ccp-notifications-submit'));
    CCP._NOTIFICATIONS.edit = true;
  });

  // Watch notifications select for changes
  $('#ccp-notifications-form select').change(function() {
    CCP._NOTIFICATIONS.scrollNow();
    if($(this).val() == 'manage') {
      CCP._NOTIFICATIONS.manage($(this));
    } else {
      CCP._PROTOTYPE.showElement($('.ccp-notifications-submit'));
      CCP._NOTIFICATIONS.edit = true;
    }
  });

  // Hides notifications submit bar and cancel outs form
  $('.ccp-notifications-submit > .form-cancel').click(function(e) {
    CCP._NOTIFICATIONS.edit = false;
    $('.ccp-notifications-submit').hide();
    e.preventDefault();
  });

  // When the save changes model appears remember to switch
  // subscriptions and notifications to false
  $('body').on('click', '.ccp-continue', function(e) {
    CCP._SUBSCRIPTIONS.edit = false;
    CCP._NOTIFICATIONS.edit = false;
    CCP._INFORMATION.closeLightBox();
    $('.ccp-subscriptions-submit, .ccp-notifications-submit').hide();
    e.preventDefault();
  });

  // Notifications submit track push
  $('.ccp-notifications-submit').click(function() {
    CCP._TRACKPAGES.pushtoGoogle('notifications/submit/');
  });

  // Subscriptions submit track push
  $('.ccp-subscriptions-submit').click(function() {
    CCP._TRACKPAGES.pushtoGoogle('subscriptions/submit/');
  });

  // Alert Success
  // ---------------

  // Where alerts will go for success I need to know how this 
  // will be returned in the URL
  //

  CCP._ALERTS = {

  };

});






