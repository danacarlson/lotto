/* ========================================================================
 * MCD Form Slider
 * ========================================================================
 * The following plugin can be used to help build a custom HTML5 slider, this slider
 * uses the native element with a combination of minor JS help to help acheive a look close
 * to the intended design. Unique CSS for each browser is also used (refer to slider.scss).
 *
 * Please note: This specific slider requires a wrapper <div> with a class of slider to function properly
 *
 * Sample HTML:
 *  <div class="slider">
 *    <input type="range" min="0" max="5000" step="100" value="5000" data-range-slider />
 *  </div>
 *
 * @author Lori Hutchek
 * ======================================================================== */

(function($) {  "use strict";

  $.$body = $('body');

  // SLIDER PUBLIC CLASS DEFINITION
  // ==============================

  var RangeSlider = function (element, options) {
    this.$element = $(element);
    this.setup();
  };

  var testforRangeSupport = function () {
    var i = document.createElement('input');
    i.setAttribute('type', 'range');
    return i.type !== 'text';
  }

  $.extend (RangeSlider.prototype, {
    /**
     *
     * Generates the HTML setup and handles initial grab of elements
     *
     * @return {void}
     */
    setup: function () {
      this.gatherData();

      this.$container = this.$element.parent();
      this.$element.attr('id', this.refID);

      this.addTooltipMarkup();
      this.generateStepDisplay();

      this.updatePosition (this.calculatePercentageByAmount(this.$element.val()));
      this.addListeners();

      this.browserDependecies();
    },

    /**
     * Setting any browser specific dependencies (currently just adding a class for css)
     * @return {void}
     */
    browserDependecies: function () {
      if (RangeSlider.isFF) {
        this.$container.addClass('ff');
      } else if (RangeSlider.isIE) {
        this.$container.addClass('ie');
      } else {
        this.$container.addClass('webkit');
      }
    },

    /**
     * Grabs data related to the slider on the DOM element
     * @return {void}
     */
    gatherData: function () {
      this.minAmount = Number((this.$element.attr('min') === undefined) ? 0 : this.$element.attr('min'));
      this.maxAmount = Number((this.$element.attr('max') === undefined) ? 5000 : this.$element.attr('max'));
      this.steps = Number((this.$element.attr('step') === undefined) ? 100 : this.$element.attr('step'));

      this.min = 0;
      this.max = this.$element.width();
      this.width = this.max*0.95;

      //create a reference ID to add to this element for reference
      this.refID = (this.$element[0].id === '') ? RangeSlider.utils.generateGUID() : this.$element[0].id;
    },

    /**
     * Adds any listeners needed for the plugin
     * @return {void}
     */
    addListeners: function () {
      this.$element.on('change', $.proxy(this.onInput, this));
      this.$element.on('input', $.proxy(this.onInput, this));
      if ($('body').hasClass('not-touch')) {
        $(window).on('resize', $.proxy(this.generateStepDisplay, this));
      } else {
        $(window).on('orientationchange', $.proxy(this.generateStepDisplay, this));
      }
      this.$element.on('focus', $.proxy(this.onFocus, this));
      this.$element.on('blur', $.proxy(this.onBlur, this));
    },

    /**
     * This slider offers a unique tooltip view for the current status of the users selection
     * @return {void}
     */
    addTooltipMarkup: function () {
      this.$tip = $('<div class="slider-tooltip shdr-xs">' + this.$element.val() + '</div>');
      this.$element.before(this.$tip);
    },

    onFocus: function () {
      this.$element.addClass('focused');
    },

    onBlur: function () {
      this.$element.removeClass('focused');
    },

    /**
     * Generates track related elements such as the ticks and dollar amounts
     * @return {void}
     */
    generateStepDisplay: function () {
      var ticks = '',
          amounts = '',
          numSteps = this.$element.data('steps'),
          amount = 0, p = 0, inStep = 0, pos = 0, prev = 0,
          //stepWidth = (this.max/numSteps),
          boxShadow = '', offset = (RangeSlider.isIE) ? 0 : -4,
          width = this.$element.outerWidth() - 40,
          distance = width / this.$element.data('steps'),
          p = 0;

      this.$container.find('.step, .step-amount').remove();

      for (var i = 0; i <= (numSteps); i++) {
        if (i === 0) {
          ticks += '<span class="step" style="left:20px;" data-step data-amount="'+amount+'"><hr/></span>';
          p = 20;
        } else {
          ticks += '<span class="step" style="left:' + (p + distance) + 'px;" data-step data-amount="'+amount+'"><hr/></span>';
          p = p + distance;
        }
        amount += this.steps;

      }

      this.$element.before(ticks);
      this.$element.after('<span class="step-amount" style="left: 0">' + this.$element.attr('min') + '</span><span class="step-amount" style="right: 0">' + this.$element.attr('max') + '</span>');
    },

    /**
     * This updates the position of the independent elements associated with this slider (e.g. Tooltip)
     * @param  {Number} p Percentage of current position of handle along slider
     * @return {void}
     */
    updatePosition: function (p) {
      if (this.$container.hasClass('large')) {
        p = p - 0.075;
      }
      if (!this.$container.hasClass('custom')) {
        if (RangeSlider.isFF) {
          RangeSlider.utils.addRule('#' + this.refID + '::-moz-range-track', 'background: '+ 'linear-gradient(to right, #63686b ###PERCENT###%, #ffffff ###PERCENT###%);'.replace(/###PERCENT###/gi, p*100));
        } else {
          var gradient = "background:-webkit-linear-gradient(left, #63686b ###PERCENT###%, #ffffff ###PERCENT###%);-ms-linear-gradient(left, #63686b ###PERCENT###%, #ffffff ###PERCENT###%);-o-linear-gradient(left, #63686b ###PERCENT###%, #ffffff ###PERCENT###%);linear-gradient(left, #63686b ###PERCENT###%, #ffffff ###PERCENT###%);";

          this.$element[0].setAttribute('style', gradient.replace(/###PERCENT###/gi, p*100) );
        }
      }

      if (this.$container.hasClass('custom')) {
        var categories = this.$element.data('custom').split(',');
        this.$tip.html(categories[this.$element.val()]);
      } else if (this.$container.hasClass('large')) {
        this.$tip.html('$' + this.$element.val());
      } else {
        this.$tip.html(this.$element.val());
      }

      if (this.$container.hasClass('custom')) {
        this.$tip.css('left', (p * (this.$element.outerWidth() - 40) - 10));
      } else {
        this.$tip.css('left', (p * (this.$element.outerWidth() - 40) + 10));
      }

      this.currentPosition = p;

    },

    //---
    // Calculation Utils
    calculatePosition: function (percentage) {
      return percentage * this.max;
    },

    calculatePercentageByPosition: function (pos) {
      return (pos / this.max);
    },

    calculatePercentageByAmount: function (amount) {
      return amount / (this.maxAmount - this.minAmount);
    },

    calculateAmountByPercentage: function (percentage) {
      return percentage * (this.maxAmount - this.minAmount);
    },
    //---

    //-----
    // Event Listeners
    //----
    onInput: function (e) {
      var p = this.$element.val();
      this.updatePosition(this.calculatePercentageByAmount(p));

      e.preventDefault();
    }

    //-----
    // /Event Listeners
    //----
  });

  // SLIDER UTILS
  // ========================

  // This plugin requires some very specific browser work arounds these are helper tests for browser detection
  RangeSlider.isFF = ( /Firefox/.test(navigator.userAgent));
  RangeSlider.isIE = ( /Trident/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent) );
  RangeSlider.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  RangeSlider.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

  RangeSlider.sheet = null;

  RangeSlider.utils = {
    formatCurrency: function (amount) {
      return  parseFloat(amount, 10).toFixed(0).replace(/(\d)(?=(\d{3}))/g, "$1,").toString();
    },

    addCommas : function (nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    },

    generateGUID: function () {
      return 'elementxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },

    /**
     * Adds and removes CSS rules from the set sheet
     * @param  {StyleSheet Node} style Stylesheet that will be used to house any new css
     * @return {function} This function will be used to add new selectors and styles
     */
    addRule: (function (style) {
      var el = document.head.appendChild(style);
          RangeSlider.sheet = el.sheet;
      return function (selector, css) {
        if ( RangeSlider.isFF ) {
          if ( RangeSlider.sheet.cssRules.length > 0 ) {
            RangeSlider.sheet.deleteRule( 0 );
          }
          try {
            RangeSlider.sheet.insertRule(selector + "{" + css + "}", 0);
          } catch ( er ) {
            RangeSlider.isFF = false;
          }
        }
      };
    })(document.createElement("style"))

  };



  // SLIDER PLUGIN DEFINITION
  // ========================

  var old = $.fn.rangeSlider;

  $.fn.rangeSlider = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('mcd.rangeSlider'),
          options = typeof option == 'object' && option;

      if (!data) $this.data('mcd.rangeSlider', (data = new RangeSlider(this, options)));

      // if (option == 'toggle') data.toggle()
      // else if (option) data.setState(option)
    });
  };

  $.fn.rangeSlider.Constructor = RangeSlider;


  // SLIDER NO CONFLICT
  // ==================

  // $.fn.rangeSlider.noConflict = function () {
  //   $.fn.rangeSlider = old;
  //   return this;
  // };


  // SLIDER DATA-API
  // ===============

  $(document).ready(function () {
    $('[data-range-slider]').each(function () {
      var $rangeSlider = $(this);
      $rangeSlider.rangeSlider($rangeSlider.data());
    });
  });
})(jQuery);