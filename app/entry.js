import $ from 'jquery';
const deleteCanvas = $('#deleteCanvas');


// isDrawing が真のとき、マウスを動かすと線が描ける
var isDrawing = false;
var x = 0;
var y = 0;

var canvas = document.getElementById('Canvas');
var context = Canvas.getContext('2d');

// The x and y offset of the canvas from the edge of the page
const rect = Canvas.getBoundingClientRect();


// mousedown、mousemove、mouseup のそれぞれに対してイベントリスナーを設定する
Canvas.addEventListener('mousedown', e => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
});

Canvas.addEventListener('mousemove', e => {
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

deleteCanvas.click(() => {
  context.clearRect(0,0,560,360);
});

document.getElementById('download-link').addEventListener('click', (e) => {
  const a = e.target;
  a.href = canvas.toDataURL();
  a.download = new Date().getTime() + '.png';
});
