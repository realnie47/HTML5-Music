// 播放器
var player = $(".player");

// 音频
var myAudio = $("#audio")[0];

// 专辑图片
var bgPic = $(".album-pic");

// 播放、暂停按钮
var playBtn = $(".play");

// 切歌按钮
var nextBtn = $(".next");
var previousBtn = $(".previous");

// 喜欢按钮
var likeBtn = $(".like");

// 歌词按钮
var lrcBtn = $(".lrc");

//进度条
var progressBar = $(".progress");

// 音乐数组
var resource;

// 音乐索引
var index = 1;

//Y音乐时长
var songDur;

// 播放按钮事件
playBtn.click(function() {
  // 如果音频状态为暂停，则播放，如果不是暂停，则暂停
  if (myAudio.paused) {
    play();
  } else {
    pause();
  }
});

// 切歌按钮事件
nextBtn.click(function() {
  // 音乐索引增加
  index++;

  getMusic();
});
previousBtn.click(function() {
  if (index == 0) {
    return;
  }
  // 音乐索引
  index--;

  getMusic();
});

// 喜欢按钮事件
likeBtn.click(function() {
  if (likeBtn.children().hasClass("fa-heart-o")) {
    likeBtn
      .children()
      .removeClass("fa-heart-o")
      .addClass("fa-heart");
    //加入喜欢列表
  } else {
    likeBtn
      .children()
      .removeClass("fa-heart")
      .addClass("fa-heart-o");
    //移出喜欢列表
  }
});

//切歌按钮事件
lrcBtn.click(function() {
  if (lrcBtn.children().hasClass("fa-file-text-o")) {
    lrcBtn
      .children()
      .removeClass("fa-file-text-o")
      .addClass("fa-file-text");
    // 打开歌词面板
  } else {
    lrcBtn
      .children()
      .removeClass("fa-file-text")
      .addClass("fa-file-text-o");
    // 关闭歌词面板
  }
});

// 播放
function play() {
  myAudio.play();

  // 改变播放按钮为暂停
  playBtn
    .children()
    .removeClass("fa-play")
    .addClass("fa-pause");
  // 专辑动画
  bgPic.css("animation-play-state", "running");
}

// 暂停
function pause() {
  myAudio.pause();

  // 改变暂停按钮为播放
  playBtn
    .children()
    .removeClass("fa-pause")
    .addClass("fa-play");
  // 专辑动画
  bgPic.css("animation-play-state", "paused");
}

// 进度条
setInterval(present, 500); //每0.5秒计算进度条长度
function present() {
  var length = myAudio.currentTime / myAudio.duration * 100;
  progressBar.width(length + "%"); //设置进度条长度
  //自动下一曲
  if (myAudio.currentTime == myAudio.duration) {
    nextBtn.click();
  }
}
$(".cdiv").mousedown(function(ev) {
  //拖拽进度条控制进度
  var posX = ev.clientX;
  var targetLeft = $(this).offset().left;
  var percentage = (posX - targetLeft) / 375 * 100;
  myAudio.currentTime = myAudio.duration * percentage / 100;
});

//获取音乐
function getMusic() {
  //发送请求获取频道
  $.ajax({
    // 请求类型
    type: "GET",
    // 请求地址
    url: "http://47.93.102.235:3000/artists?id=893259",
    // 期望的响应类型
    dataType: "json",
    // 请求成功后的回调
    // response是响应
    success: function(response) {
      resource = response.hotSongs;
      var songinfo = resource[index];

      var bgPic = songinfo.al.picUrl;
      var title = songinfo.name;
      var artist = response.artist.name;
      // 专辑封面
      $(".album-pic").css("background-image", "url(" + bgPic + ")");
      // 歌曲名
      $(".info-title").text(title);
      // 歌手名
      $(".info-songer").text(artist);

      // 获取音乐 url
      playMusic();
    }
  });
}

// 获取音乐
function playMusic() {
  // 获取音乐ID
  var musicId = resource[index].id;
  // 根据ID请求音乐
  var musicUrl = "http://47.93.102.235:3000/music/url?id=" + musicId;
  $.ajax({
    type: "GET",
    url: musicUrl,
    dataType: "json",
    success: function(response) {
      var songUrl = response.data[0].url;

      // 音频
      $("#audio").attr("src", songUrl);

      play();
    }
  });
}

$(document).ready(function() {
  getMusic();
});
