/*
 * LottoLottoLotto - r0.1.0
 * 2015-09-09 */

if (typeof lotto === 'undefined') {
  lotto = {
    global: {}
  };
}

lotto.global.init = (function() {
  'use strict';

  var stage, numbers, activeIndex = 0;

  function loadData() {
    $.getJSON('/data/lottery.json', function(data) {
      var len = 100,
        i = 0;

      for (i; i<len; i++) {
        var points = data[i].winning_numbers.split(' '),
          revisedPoints = [],
          timeout;

        timeout = 20 * i;
        //make points interesting
        for (var j = 0; j < 6; j++) {
          var newpoint = parseInt(points[j]) * 5;
          revisedPoints.push(newpoint);
        }
        revisedPoints = shuffle(revisedPoints);
        drawLine(revisedPoints, timeout);
      }
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

  function drawLine(points, timeout) {
    setTimeout(function() {
      var line;
      line = new fabric.Polyline([
        {x: points[0], y: points[1]},
        {x: points[2], y: points[3]},
        {x: points[4], y: points[5]}
        ], {
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 1
      });

      stage.add(line);
    }, timeout);
  }

  function drawCircle(points, timeout) {
    setTimeout(function() {
      var circle;
      circle = new fabric.Circle({
        radius: points[0] / 3,
        fill: 'red',
        left: points[1],
        top: points[2],
        opacity: points[3] / 1000
      });

      stage.add(circle);
    }, timeout);
  }

  function drawTinyCircles(points, timeout) {
    var colors = ['red', 'blue', 'yellow'];
    setTimeout(function() {
      var circle;
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
  }

  function drawPath(points, timeout) {
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

  $(document).ready(function() {
    stage = new fabric.StaticCanvas('lotto-art');
    loadData();
  });
})();
