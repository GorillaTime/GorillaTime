// isDrawing が真のとき、マウスを動かすと線が描ける
var isDrawing = false;
var x = 0;
var y = 0;

var canvas = document.getElementById('myPics');
var context = myPics.getContext('2d');

// The x and y offset of the canvas from the edge of the page
const rect = myPics.getBoundingClientRect();


// mousedown、mousemove、mouseup のそれぞれに対してイベントリスナーを設定する
myPics.addEventListener('mousedown', e => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
});

myPics.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}