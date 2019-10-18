
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

for (i = 0; i < point_list.length; ++i) {
  context.fillRect(point_list[i][0], point_list[i][1], 3, 3);
}

context.fillStyle = "blue";

for (i = 1; i < (point_list.length - 1); ++i) {
  var temp = getEdgeEstimate(point_list.slice(i - 1, i + 2));
  context.fillStyle = "blue";
  context.fillRect(temp[0][0], temp[0][1], 3, 3);
  context.fillStyle = "red";
  context.fillRect(temp[1][0], temp[1][1], 3, 3);
}

var outline1 = getEdgeEstimate(
    [point_list[point_list.length - 1], point_list[0], point_list[1]]
  );
context.fillStyle = "blue";
context.fillRect(outline1[0][0], outline1[0][1], 3, 3);
context.fillStyle = "red";
context.fillRect(outline1[1][0], outline1[1][1], 3, 3);

var outline2 = getEdgeEstimate(
    [point_list[point_list.length - 2], point_list[point_list.length - 1], point_list[0]]
  );
context.fillStyle = "blue";
context.fillRect(outline2[0][0], outline2[0][1], 3, 3);
context.fillStyle = "red";
context.fillRect(outline2[1][0], outline2[1][1], 3, 3);

context.fillStyle = "green";


//Takes in three (ordered) points in and
//returns the estimated outer and inner points on the track
//relative to the middle point
//**almost works**
function getEdgeEstimate (points, width=20) {
/*  var theta1, theta2;
  if ((points[0][0] - points[1][0] == 0)) {
    theta1 = -90;
  } else {
    theta1 = Math.atan((points[1][1] - points[0][1]) /
      (points[1][0] - points[0][0]));
  }
  if ((points[2][0] - points[1][0] == 0)) {
    theta2 = -90;
  } else {
    theta2 = Math.PI + Math.atan((points[1][1] - points[2][1]) /
      (points[1][0] - points[2][0]));
  }
  var angle = (theta1 + theta2) / 2;
  var point1 = [points[1][0] + radius * Math.cos(angle),
    [points[1][1] + radius * Math.sin(angle)]
  ];
  var point2 = [points[1][0] - radius * Math.cos(angle),
    [points[1][1] - radius * Math.sin(angle)]
  ];
  return [point1, point2];*/
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

function norm(vector) {
  var x = Math.sqrt(vector[0] ** 2 + vector[1] **2);
  return [vector[0] / x, vector[1] / x];
}
