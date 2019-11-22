
var point_list = [[2.5, 0.75], [3.33, 0.75], [4.17, 0.75],
[5.0, 0.75], [5.83, 0.75], [6.67, 0.75], [7.5, 0.75], [8.33, 0.75],
[9.17, 0.75], [9.75, 0.94], [10.0, 1.5], [10.0, 1.875],
[9.92, 2.125], [9.58, 2.375], [9.17, 2.75], [8.33, 2.5], [7.5, 2.5],
[7.08, 2.56], [6.67, 2.625], [5.83, 3.44], [5.0, 4.375], [4.67, 4.69],
[4.33, 4.875], [4.0, 5.0], [3.33, 5.0], [2.5, 4.95], [2.08, 4.94],
[1.67, 4.875], [1.33, 4.69], [0.92, 4.06], [1.17, 3.185],
[1.5, 1.94], [1.6, 1.5], [1.83, 1.125], [2.17, 0.885]]

for (i = 0; i < point_list.length; ++i) {
  point_list[i][0] = Math.round(point_list[i][0] * 50);
  point_list[i][1] = Math.round(point_list[i][1] * 50);
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');


//Takes in three (ordered) points in and
//returns the estimated outer and inner points on the track
//relative to the middle point
//**almost works**
function getEdgeEstimate (points, width=20) {
  var vector1, vector2;
  vector1 = [points[1][0] - points[0][0], points[1][1] - points[0][1]];
  vector2 = [points[2][0] - points[1][0], points[2][1] - points[1][1]];
  var avgVector = [(vector1[0] + vector2[0]) / 2,
                   (vector1[1] + vector2[1]) / 2
                 ];
  var point1, point2;
  var deltaVector = norm(MatrixVectorMult(avgVector, [[0, 1], [-1, 0]]));
  point1 = [points[1][0] + width * deltaVector[0],
            points[1][1] + width * deltaVector[1]
          ];
  point2 = [points[1][0] - width * deltaVector[0],
            points[1][1] - width * deltaVector[1]
          ];
  return [point1, point2];
}

function dot(vector1, vector2) {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}

function MatrixVectorMult(vector, matrix) {
  var x, y;
  x = dot(matrix[0], vector);
  y = dot(matrix[1], vector);
  return [x, y];
}

function matrixRotation(vector, angle) {
  return MatrixVectorMult(vector, [[Math.cos(angle), Math.sin(angle)], 
                                   [-1 * Math.sin(angle), Math.cos(angle)]])
}

function norm(vector) {
  var x = Math.sqrt(vector[0] ** 2 + vector[1] **2);
  return [vector[0] / x, vector[1] / x];
}

function distance(point1, point2) {
  return Math.sqrt((point1[0] - point2[0]) ** 2 +
                   (point1[1] - point2[0]) ** 2)
}


class track {
  constructor(points, params) {
    this._points = points;
    this._params = params;
  }
  get points() {
    return this._points;
  }
  set points(pointList) {
    this._points = pointList;
  }
  getEdgePoints() {
    var points1 = [];
    var points2 = [];
    for (i = 1; i < (this._points.length - 1); ++i) {
      var temp = getEdgeEstimate(this._points.slice(i - 1, i + 2));
      points1.push([temp[0][0], temp[0][1]]);
      points2.push([temp[1][0], temp[1][1]]);
    }
    var outline1 = getEdgeEstimate(
        [this._points[this._points.length - 1],
         this._points[0], this._points[1]]
      );
    var outline2 = getEdgeEstimate(
        [this._points[this._points.length - 2],
         this._points[this._points.length - 1], this._points[0]]
      );
    points1.push([outline1[0][0], outline1[0][1]]);
    points1.push([outline2[0][0], outline2[0][1]]);
    points2.push([outline1[1][0], outline1[1][1]]);
    points2.push([outline2[1][0], outline2[1][1]]);
    return [points1, points2];
  }
  drawTrackPoints() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var points1 = this.getEdgePoints()[0];
    var points2 = this.getEdgePoints()[1];
    for (i = 0; i < points1.length; ++i) {
      context.fillStyle = "blue";
      context.fillRect(points1[i][0], points1[i][1], 3, 3);
      context.fillStyle = "red";
      context.fillRect(points2[i][0], points2[i][1], 3, 3);
    }
  }
  getCenterPoint() {
    var xSum = 0;
    var ySum = 0;
    for (i = 0; i < this._points.length; ++i) {
      xSum += this._points[i][0];
      ySum += this._points[i][1];
    }
    var x = xSum / this._points.length;
    var y = ySum / this._points.length;
    return [x, y];
  }
  // return True if points1 is the outer ring, false if otherwise
  InnerVsOuter() {
    var points1 = this.getEdgePoints()[0];
    var points2 = this.getEdgePoints()[1];
    var center = this.getCenterPoint();
    var distance1 = 0;
    var distance2 = 0;
    for (i = 0; i < points1.length; ++i) {
      distance1 += distance(points1[i], center);
      distance2 += distance(points2[i], center);
    }
    if (distance1 > distance2) {
      return true;
    }
    else {
      return false;
    }
  }
  drawTrackCurve() {
    //stuff here
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.fillStyle = 'green';
    context.fillRect(0, 0, 600, 300);
    if (this.InnerVsOuter()) {
      var inner = this.getEdgePoints()[1];
      var outer = this.getEdgePoints()[0];
    } else {
      var inner = this.getEdgePoints()[0];
      var outer = this.getEdgePoints()[1];
    }
    context.beginPath();
    context.lineWidth= 3;
    context.lineCap = 'round';
    context.fillStyle = 'black';
    for (i = 0; i < outer.length; ++i) {
      context.lineTo(outer[i][0], outer[i][1]);
    }
    context.closePath();
    context.fill();
    context.beginPath();
    context.fillStyle = 'green';
    for (i = 0; i < inner.length; ++i) {
      context.lineTo(inner[i][0], inner[i][1]);
    }
    context.closePath();
    context.fill();
  }
}


class car {
  constructor(x, y, orientation) {
    this._x = x;
    this._y = y;
    this._orientation = orientation;
  }
  get position() {
    return [this._x, this._y];
  }
  set position(coord) {
    this._x = coord[0];
    this._y = coord[1];
  }
  drawCar() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var vertices = [];
    vertices.push(matrixRotation([16, 0], this._orientation));
    vertices.push((matrixRotation([8, 0], this._orientation + (Math.PI * 2 / 3))));
    vertices.push((matrixRotation([8, 0], this._orientation - (Math.PI * 2 / 3))));
    context.beginPath();
    context.fillStyle = 'red';
    for (i = 0; i < 3; ++i) {
      context.lineTo(this._x * 50 + vertices[i][0], this._y * 50 + vertices[i][1]);
    }
    context.closePath();
    context.fill();
    //context.fillRect((this._x * 50), (this._y * 50), 8, 8);
  }
}


var testTrack = new track(point_list, .5);
var testCar = new car(2.5, .75, 0);
testTrack.drawTrackCurve();
testCar.drawCar();


shiftDown = false;
window.addEventListener("keydown", toggleShift);
function toggleShift(event) {
  if (event.key == "Shift") {
    shiftDown = !(shiftDown);
  }
}


window.addEventListener("keydown", reDrawLoop);
function reDrawLoop(event) {
  var delta = .05;
  if (shiftDown) {
    delta = 1;
  }
  if (event.key == "ArrowUp") {
    testCar._y += -delta;
  } 
  if (event.key == "ArrowDown") {
    testCar._y += delta;
  } 
  if (event.key == "ArrowLeft") {
    testCar._x += -delta;
  } 
  if (event.key == "ArrowRight") {
    testCar._x += delta;
  } 
  if ((event.key == "a") || (event.key == "A")) {
    testCar._orientation += delta;
  } 
  if ((event.key == "d") || (event.key == "D")) {
    testCar._orientation -= delta;
  }
  testTrack.drawTrackCurve();
  testCar.drawCar();
}


