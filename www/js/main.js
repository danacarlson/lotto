/*
 * LottoLottoLotto - r0.1.0
 * 2015-09-10 */

if (typeof lotto === 'undefined') {
  lotto = {
    global: {}
  };
}

lotto.global.init = (function() {
  'use strict';

  var stage, records, artStyles, numbers, timer, activeIndex = 0, stop = false;

  artStyles = {
    'drawLines': function(points, timeout) {
      timer = setTimeout(function() {
        var line;
        if (stop) {
          return false;
        }
        line = new fabric.Polyline([
          {x: points[0], y: points[1]},
          {x: points[2] + 100, y: points[3] + 100},
          {x: points[4] + 200, y: points[5] + 200}
          ], {
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 1
        });

        stage.add(line);
      }, timeout);
    },
    drawCircle: function(points, timeout) {
      setTimeout(function() {
        var circle;
        if (stop) {
          return false;
        }
        circle = new fabric.Circle({
          radius: points[0] / 3,
          fill: 'red',
          left: points[1],
          top: points[2],
          opacity: points[3] / 1000
        });

        stage.add(circle);
      }, timeout);
    },
    drawTinyCircles: function(points, timeout) {
      var colors = ['red', 'blue', 'yellow'];
      setTimeout(function() {
        var circle;
        if (stop) {
          return false;
        }
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
      }, 0);
    },
    drawPath: function(points, timeout) {
      var string = 'M' + points[0] + ' ' + points[1] + ' Q' + points[2] + ' ' + points[3] + ' ' + points[4] + ' ' + points[5];
      setTimeout(function(points) {
        var path;
        path = new fabric.Path(string);
        path.set({
          fill: 'transparent',
          stroke: 'red',
          left: 0,
          top: 0
        });
        stage.add(path);
      }, timeout);
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
    var len = 1000,
      i = 0,
      type;

    //let the loop run free again if it was stopped
    stop = false;

    if ($(this).length) {
      type = $(this).attr('data-type');
    } else {
      type = $(el).attr('data-type');
    }
    stage.clear();

    for (i; i<len; i++) {
      console.log('code executing');
      var points = records[i].winning_numbers.split(' '),
        revisedPoints = [],
        timeout;

      if (stop) {
        break;
      }

      timeout = 20 * i;
      //make points interesting
      for (var j = 0; j < 6; j++) {
        var newpoint = parseInt(points[j]) * 5;
        revisedPoints.push(newpoint);
      }
      revisedPoints = shuffle(revisedPoints);
      artStyles[type](revisedPoints, timeout);
    }
  }

  function clearSelection() {
    stop = true;
    stage.clear();
    $('.options input').removeAttr('checked');
  }

  function reload() {
    var $checkedOption = $('.options input:checked');
    stop = true;
    stage.clear();
    if ($checkedOption.length > 0) {
      loadArt($checkedOption);
    }
  }

  function stopLoop() {
    stop = true;
  }

  function addEvents() {
    $('.options input').on('change', loadArt);
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
    });
    loadData();
    addEvents();
  });
})();
