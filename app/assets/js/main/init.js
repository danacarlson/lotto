lotto.global.init = (function() {
  'use strict';

  var stage, numbers;

  function loadData() {
    $.getJSON('/data/lottery.json', function(data) {
      var len = 10,
        i = 0;

      for (i; i<len; i++) {
        var points = data[i].winning_numbers.split(' '),
          revisedPoints = [],
          timeout;

        timeout = 300 * i;
        //make points interesting
        for (var j = 0; j < 6; j++) {
          var newpoint = parseInt(points[j]) * 30;
          revisedPoints.push(newpoint);
        }
        revisedPoints = shuffle(revisedPoints);
        drawPath(revisedPoints, timeout);
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

  function drawPath(points, timeout) {
    setTimeout(function() {
      var path;
      path = new fabric.Path('M 0 0 A 200 100 A 170 200 z');
      path.set({
        stroke: 'red',
        left: 0,
        top: 0
      });
      stage.add(path);
    }, timeout);
  }

  $(document).ready(function() {
    stage = new fabric.Canvas('lotto-art');
    loadData();
  });
})();
