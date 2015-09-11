/*
 * LottoLottoLotto - r0.1.0
 * 2015-09-11 */

if (typeof lotto === 'undefined') {
  lotto = {
    global: {}
  };
}

lotto.global.init = (function() {
  'use strict';

  var stage, records, artStyles, numbers, firstLoad = true, interval, activeIndex = 0;

  artStyles = {
    'continuousStart': 'M 100 100',
    'continuousLine': function(points) {
      var string = artStyles.continuousStart + ' C' + (points[0] + 50) + ' ' + (points[1] + 100) + ' ' + (points[2] + 250) + ' ' + (points[3] + 450) + ' ' + (points[4] + 100) + ' ' + points[5],
        path;

      path = new fabric.Path(string);
      path.set({
        fill: 'transparent',
        stroke: '#754c24',
        strokeWidth: 1,
        opacity: points[3] / 600
      });
      artStyles.continuousStart = 'M' + (points[4] + 100) + ' ' + points[5];
      stage.add(path);
    },
    'matrix': function(points) {
      var j = 0,
        leng = points.length,
        $canvas = $('.art'),
        $group = $('<div class="group"></div>'),
        extra = 0;

      $canvas.css({
        'background': '#000',
        'color': '#fff'
      });

      for (j; j < leng; j++) {
        var nextPoint;

        if (j > 0) {
          extra = extra + 85;
        }

        if (j === (leng - 1)) {
          nextPoint = 0;
        } else {
          nextPoint = j + 1;
        }
        $group.append('<div class="matrix-point" style="left:' + (points[j] + extra) + 'px; top:' + (points[nextPoint]) + 'px;">' + (points[j] / 5) + '</div>');
        $canvas.append($group);
        setTimeout(function() {
          $group.addClass('on');
        }, 100);
      }
    },
    'eighties': function(points) {
      var photos = ['../images/80-photo-1.jpg', '../images/80-photo-2.jpg', '../images/80-photo-3.jpg', '../images/80-photo-4.jpg', '../images/80-photo-5.jpg'],
        image;
      image = new fabric.Image.fromURL(photos[0], function(img) {
        img.scale(points[0] / 1000);
        img.set('angle', points[1] / 2);
        img.set('left', points[2]);
        img.set('top', points[3]);
        stage.add(img);
      });
    },
    'drawLines': function(points) {
      var line;
      line = new fabric.Polyline([
        {x: points[0], y: points[1]},
        {x: points[2] + 100, y: points[3] + 100},
        {x: points[4] + 200, y: points[5] + 200}
        ], {
        fill: 'transparent',
        stroke: '#000',
        strokeWidth: 1
      });
      stage.add(line);
    },
    drawCircle: function(points, timeout) {
      var colors = ['#fff200', '#ff6600', '#1daa61', '#448ccb', '#f06eaa'],
        circle;
      circle = new fabric.Circle({
        radius: points[0] / 3,
        fill: colors[activeIndex],
        left: points[1],
        top: points[2],
        strokeWidth: 1,
        stroke: '#ffffff'
        //opacity: points[3] / 1000
      });
      activeIndex++;
      if (activeIndex === colors.length) {
        activeIndex = 0;
      }
      stage.add(circle);
    },
    drawTinyCircles: function(points, timeout) {
      var colors = ['red', 'blue', 'yellow'],
        circle;

      circle = new fabric.Circle({
        radius: 10,
        fill: colors[activeIndex],
        left: points[1] + (points[1] / 2),
        top: points[2] + (points[2] / 2),
        opacity: points[3] / 600
      });
      activeIndex++;
      if (activeIndex === 3) {
        activeIndex = 0;
      }

      stage.add(circle);
    },
    drawPath: function(points, timeout) {
      var string = 'M' + points[0] + ' ' + points[1] + ' Q' + points[2] + ' ' + points[3] + ' ' + points[4] + ' ' + points[5],
        path;

      path = new fabric.Path(string);
      path.set({
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 5,
        left: points[1] + (points[1] / 2),
        top: points[2] + (points[2] / 2),
      });
      stage.add(path);
    }
  };

  function loadData() {
    $.getJSON('/data/lottery.json', function(data) {
      records = data;
    });
  }

  function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  function loadArt(el) {
    var len = $('[data-range-slider').val(),
      i = 0,
      type = $(el).attr('data-type'),
      $currTicket = $('#current');

    $('#ticket-num').addClass('on');

    clearInterval(interval);
    if (firstLoad) {
      stage.clear();
      firstLoad = false;
    }

    interval = setInterval(function() {
      if (i < len) {
        var points = records[i].winning_numbers.split(' '),
          revisedPoints = [];

        $currTicket.html(i + 1);

        for (var j = 0; j < 6; j++) {
          var newpoint = parseInt(points[j]) * 5;
          revisedPoints.push(newpoint);
        }
        //make points more interesting
        revisedPoints = shuffle(revisedPoints);
        artStyles[type](revisedPoints);
        i++;
      }
    }, 0);
  }

  function clearSelection() {
    clearInterval(interval);
    stage.clear();
    $('.art').css('background', '').find('.group').remove();
    $('#ticket-num').removeClass('on');
  }

  function reload() {
    clearInterval(interval);
    var $checkedOption = $('.options input:checked');
    if ($checkedOption.length > 0) {
      loadArt($checkedOption);
    }
  }

  function stopLoop() {
    clearInterval(interval);
    if ($('.art').find('.group').length > 0) {
      $('.art .group').each(function() {
        var pos = $(this).position().top;
        $(this).css({
          'transition': 'none',
          'top': pos
        }).removeClass('on');
      });
    }
  }

  function addEvents() {
    $('.clear').on('click', clearSelection);
    $('.reset').on('click', reload);
    $('.stop').on('click', stopLoop);
  }

  $(document).ready(function() {
    stage = new fabric.StaticCanvas('lotto-art');
    fabric.Image.fromURL('../images/text.jpg', function(textImage) {
      textImage.set({
        'left': 100,
        'top': 100,
        'opacity': 0.0
      });

      stage.add(textImage);
      textImage.animate('opacity', 1, {
        onChange: stage.renderAll.bind(stage),
        duration: 600
      });
      $('.options').addClass('on');
    });
    loadData();
    addEvents();
  });
})();
