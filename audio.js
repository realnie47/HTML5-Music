var audioContext;
var analyser;
var source;
var canvas = document.getElementById("canvas");
var canvasCtx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// 通过麦克风获得音频源
function visualM() {
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var source = audioContext.createMediaStreamSource(stream);
      // 效果节点
      analyser = audioContext.createAnalyser();
      // 连接源到效果器
      source.connect(analyser);
      // 连接源到目的地
      source.connect(audioContext.destination);

      // 可视化
      drawIt();
    });
  }
}

//音频可视化 条形
function drawIt() {
  var bufferLength;
  var dataArray;
  var draw;
  analyser.fftSize = 512;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  draw = function() {
    window.requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = "#eef1f2";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    var barWidth = WIDTH / bufferLength * 2.5;
    var barHeight;
    var x = 0;
    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
      canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  };
  draw();
}

// function visual() {
//   // 创建音频上下文
//   audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   // 效果节点
//   analyser = audioContext.createAnalyser();

//   // 音频源
//   // 通过 <audio>元素获得音频源
//   // source = audioContext.createMediaElementSource(myAudio);
//   // 通过网络请求获得
//   // getData();

//   // 连接源到效果器
//   source.connect(analyser);
//   // 连接源到目的地
//   source.connect(audioContext.destination);

//   // 可视化
//   drawIt();
// }

// 通过网络请求获得音频源
// function getData() {
//   var request = new XMLHttpRequest(); //开一个请求
//   request.open("GET", songUrl, true); //往url请求数据
//   request.responseType = "arraybuffer"; //设置返回数据类型
//   request.onload = function() {
//     var audioData = request.response;
//     source = audioContext.createBufferSource();
//     //数据缓冲完成之后，进行解码
//     var buffer = audioContext.createBuffer(2, 22050, 44100); //创建一个双通道、22050帧，44.1k采样率的缓冲数据。
//     audioContext.decodeAudioData(
//       audioData,
//       function(buffer) {
//         source.buffer = buffer; //将解码出来的数据放入source中
//         //进行数据处理
//       },
//       function(err) {
//         //解码出错处理
//         console.log("数据错误");
//       }
//     );
//   };
//   request.send();
// }



