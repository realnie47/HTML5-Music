var player = $(".player"); // 播放器
var lrcPanel = $(".music-lyric"); // 歌词面板
var bgPic = $(".album-pic"); // 专辑图片
var myAudio = $("#audio")[0]; // 音频
var playBtn = $(".play"); // 播放、暂停按钮
var nextBtn = $(".next");
var previousBtn = $(".previous"); // 切歌按钮
var likeBtn = $(".like"); // 喜欢按钮
var lrcBtn = $(".lrc"); // 歌词按钮
var progressBar = $(".progress"); //进度条
var resource; // 音乐列表
var index = 1; // 音乐索引
var lyricArr = [];
var musicId; //音乐ID
var songUrl; //音乐url

// 播放按钮事件
playBtn.click(function() {
  // 如果音频状态为暂停，则播放，如果不是暂停，则暂停
  if (myAudio.paused) {
    play();
  } else {
    pause();
  }
});
// 下一首按钮
nextBtn.click(function() {
  // 音乐索引增加
  index++;

  getMusic();
});
// 上一首按钮
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
//歌词按钮事件
lrcBtn.click(function() {
  if (lrcBtn.children().hasClass("fa-file-text-o")) {
    lrcBtn
      .children()
      .removeClass("fa-file-text-o")
      .addClass("fa-file-text");
    // 打开歌词面板
    lrcPanel.css("opacity", "1");
  } else {
    lrcBtn
      .children()
      .removeClass("fa-file-text")
      .addClass("fa-file-text-o");
    // 关闭歌词面板
    lrcPanel.css("opacity", "0");
  }
});

// 播放
function play() {
  myAudio.play();
  // 改变播放按钮为暂停
  playBtn
    .children()
    .removeClass("fa-play-circle")
    .addClass("fa-pause-circle");
  // 专辑动画
  bgPic.css("animation-play-state", "running");
}
// 暂停
function pause() {
  myAudio.pause();
  // 改变暂停按钮为播放
  playBtn
    .children()
    .removeClass("fa-pause-circle")
    .addClass("fa-play-circle");
  // 专辑动画
  bgPic.css("animation-play-state", "paused");
}

// 进度条
function present() {
  var length = myAudio.currentTime / myAudio.duration * 100;
  progressBar.width(length + "%"); //设置进度条长度
  //自动下一曲
  if (myAudio.currentTime == myAudio.duration) {
    nextBtn.click();
  }
}
// 拖拽进度条控制进度
$(".cdiv").mousedown(function(ev) {
  var posX = ev.clientX;
  var targetLeft = $(this).offset().left;
  var percentage = (posX - targetLeft) / 375 * 100;
  myAudio.currentTime = myAudio.duration * percentage / 100;
});

//获取音乐信息
function getMusic() {
  //发送请求获取音乐信息列表
  $.ajax({
    type: "GET",
    url: "http://47.93.102.235:3000/artists?id=893259",
    dataType: "json",
    success: function(response) {
      resource = response.hotSongs;
      // 根据索引获取歌曲
      var songinfo = resource[index];
      var bgPic = songinfo.al.picUrl;
      var title = songinfo.name;
      var artist = response.artist.name;

      // 获取音乐ID
      musicId = resource[index].id;
      // 专辑封面
      $(".album-pic").css("background-image", "url(" + bgPic + ")");
      // 歌曲名
      $(".info-title").text(title);
      // 歌手名
      $(".info-songer").text(artist);

      // 获取音乐 url
      getUrl();
      // 获取歌词 url
      getLrc();
    }
  });
}
// 获取音乐 url
function getUrl() {
  // 根据ID请求音乐
  var musicUrl = "http://47.93.102.235:3000/music/url?id=" + musicId;
  $.ajax({
    type: "GET",
    url: musicUrl,
    dataType: "json",
    success: function(response) {
      songUrl = response.data[0].url;
      // 音乐url
      $("#audio").attr("src", songUrl);

      // 播放音乐
      play();
    }
  });
}

// 获取歌词
function getLrc() {
  // 根据ID请求歌词
  var lrcUrl = "http://47.93.102.235:3000/lyric?id=" + musicId;
  $.ajax({
    type: "GET",
    url: lrcUrl,
    dataType: "json",
    success: function(response) {
      var lyr = response.lrc;
      console.log(lyr);
      if (!!lyr.lyric) {
        $(".music-lyric .lyric").empty(); //清空歌词信息
        var line = lyr.lyric.split("\n"); //歌词为以排数为界的数组
        var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g; //时间的正则
        var timeReg2 = /\[\d{2}:\d{2}.\d{3}\]/g;
        var result = [];
        if (line != "") {
          for (var i in line) {
            //遍历歌词数组
            var time = line[i].match(timeReg); //每组匹配时间 得到时间数组
            if (!time) {
              var time = line[i].match(timeReg2);
              if (!time) {
                continue; //如果没有 就跳过继续
              }
              var value = line[i].replace(timeReg2, ""); // 纯歌词
            } else {
              var value = line[i].replace(timeReg, ""); // 纯歌词
            }

            for (j in time) {
              //遍历时间数组
              var t = time[j].slice(1, -1).split(":"); //分析时间  时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
              //把结果做成数组 result[0]是当前时间，result[1]是纯歌词
              var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]); //计算出一个curTime s为单位
              result.push([timeArr, value]);
            }
          }
        }
        //时间排序
        result.sort(function(a, b) {
          return a[0] - b[0];
        });
        lyricArr = result; //存到lyricArr里面
        renderLyric(); //渲染歌词
      }
    }
  });
}
// 渲染歌词
function renderLyric() {
  var lyrLi = "";
  for (var i = 0; i < lyricArr.length; i++) {
    lyrLi +=
      "<li data-time='" + lyricArr[i][0] + "'>" + lyricArr[i][1] + "</li>";
  }
  $(".music-lyric .lyric").append(lyrLi);
  setInterval(showLyric, 100); //怎么展示歌词
}
// 展示歌词
function showLyric() {
  var liH =
    $(".lyric li")
      .eq(5)
      .outerHeight() - 3; //每行高度
  for (var i = 0; i < lyricArr.length; i++) {
    //遍历歌词下所有的li
    var curT = $(".lyric li")
      .eq(i)
      .attr("data-time"); //获取当前li存入的当前一排歌词时间
    var nexT = $(".lyric li")
      .eq(i + 1)
      .attr("data-time");
    var curTime = myAudio.currentTime;
    if (curTime > curT && curT < nexT) {
      //当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
      $(".lyric li").removeClass("active");
      $(".lyric li")
        .eq(i)
        .addClass("active");
      $(".music-lyric .lyric").css("top", -liH * (i - 2));
    }
  }
}

$(document).ready(function() {
  // 获取音乐并播放
  getMusic();
  // 进度条
  setInterval(present, 500); //每0.5秒计算进度条长度
});
