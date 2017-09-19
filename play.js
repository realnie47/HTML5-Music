var myAudio = $("#audio")[0]; // 音频源
var index = 0; // 音乐索引
var artistId; // 歌手ID
var lyricArr = [];
var random = false;

// 播放、暂停按钮
$(".play").click(function() {
  // 如果音频状态为暂停，则播放，如果不是暂停，则暂停
  if (myAudio.paused) {
    play();
  } else {
    pause();
  }
});
// 下一首按钮
$(".next").click(function() {
  if (random === true) {
    index = Math.floor(Math.random() * songList.hotSongs.length);
    console.log(index);
  } else {
    index++;
  }
  songPlay();
});
// 上一首按钮
$(".previous").click(function() {
  if (index === 0) {
    return;
  }
  if (random === true) {
    index = Math.floor(Math.random() * songList.hotSongs.length);
    console.log(index);
  } else {
    index-- ;
  }
  songPlay();
});
// // 喜欢按钮事件
// $(".like").click(function() {
//   if ($(".like").children().hasClass("fa-heart-o")) {
//     $(".like")
//       .children()
//       .removeClass("fa-heart-o")
//       .addClass("fa-heart");
//     //加入喜欢列表
//   } else {
//     $(".like")
//       .children()
//       .removeClass("fa-heart")
//       .addClass("fa-heart-o");
//     //移出喜欢列表
//   }
// });

// 歌曲列表按钮
$(".list").click(function() {
  $('#musicAlbum').fadeToggle();
})

//歌词按钮
$(".lrc").click(function() {
  if ($(".lrc").children().hasClass("fa-file-text-o")) {
    $(".lrc")
      .children()
      .removeClass("fa-file-text-o")
      .addClass("fa-file-text");
  } else {
    $(".lrc")
      .children()
      .removeClass("fa-file-text")
      .addClass("fa-file-text-o");
  }
  $("#musicLyric").fadeToggle();
});

// 键盘控制
$(window).keydown(function(ev) {
  var key = ev.keyCode;
  if (key === 32) {
    $(".play").click();
  }
  if (key === 39) {
    $(".next").click();
  }
  if (key === 37) {
    $(".previous").click();
  }
})

// 搜索框
$('#search').keydown(function(e) {
  if(e.keyCode == 13 ){
    searchArtist(this.value);
    // 置零index
    index = 0;
    // 清空歌曲列表
    $('#songList').empty();
  }
})

// 随机列表按钮
$('#random').click(function() {
  if (random === false) {
    $(this).css('color','#a40000');
    random = true;
  } else {
    $(this).css('color','');
    random = false;
  }
})

// 播放
function play() {
  // 改变播放按钮为暂停
  $(".play")
    .children()
    .removeClass("fa-play-circle")
    .addClass("fa-pause-circle");
  // 专辑动画
  $(".album-pic").css("animation-play-state", "running");
  $(".bigCD").css("animation-play-state", "running");
  // 操纵杆
  $("#cao").css('transform','rotate(0deg)');
  myAudio.play();
}
// 暂停
function pause() {
  // 改变暂停按钮为播放
  $(".play")
    .children()
    .removeClass("fa-pause-circle")
    .addClass("fa-play-circle");
  // 专辑动画
  $(".album-pic").css("animation-play-state", "paused");
  $(".bigCD").css("animation-play-state", "paused");
  $("#cao").css('transform','rotate(-60deg)');
  myAudio.pause();
}

// 进度条
function present() {
  // audio元素属性
  var length = myAudio.currentTime / myAudio.duration * 100;
  $(".progress").width(length + "%"); //设置进度条长度
  //自动下一曲
  if (myAudio.currentTime === myAudio.duration) {
    $(".next").click();
  }
}
// 拖拽进度条控制进度
$(".cdiv").mousedown(function(ev) {
  var posX = ev.clientX;
  var targetLeft = $(this).offset().left;
  var percentage = (posX - targetLeft) / 375 * 100;
  myAudio.currentTime = myAudio.duration * percentage / 100;
});


// 搜索歌手
function searchList(sw) {
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    data: {
      type: "search",
      s: sw,
      search_type: 100
    },
    dataType: "json",
    success: function (response) {
      var artistlist = response.artist;
      for (var i = 0;i < artistlist.length;i++) {

      }
    }
  });
}


function searchArtist(sw) {
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "search",
      s: sw,
      search_type: 100
    },
    success: function(response) {
      artistId = response.result.artists[0].id;
      localStorage.artistId = artistId;
      // 根据歌手ID获取热歌
      getMusic(parseInt(artistId));

    }
  })
}

// 热歌列表对象
var songList = new Object();

//获取热歌信息
function getMusic(id) {
  //发送请求获取热歌信息列表
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "artist",
      id: id
    },
    success: function(response) {
      // 获取数据
      songList.hotSongs = response.hotSongs;
      songList.artist = response.artist.name
      // 展示歌曲列表
      showSongList();
      // 播放歌曲
      songPlay();
    }
  });
}

// 播放歌曲
function songPlay(){
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "song",
      id: songList.hotSongs[index].id
    },
    success: function(response) {
      // 音乐url
      $("#audio").attr("src", response.data[0].url);
      // 播放音乐
      play();
      // 更新UI
      updateUI();
      // 保存索引
      localStorage.songIndex = index;
    }
  });
}

// 更新UI
function updateUI() {
  // 设置专辑封面
  $(".album-pic").css("background-image", "url(" + songList.hotSongs[index].al.picUrl + ")");
  // 设置歌曲名
  $(".info-title").text(songList.hotSongs[index].name);
  // 设置歌手名
  $(".info-songer").text(songList.artist);
  // 设置CD封面
  $(".bigCD img").first().attr('src',songList.hotSongs[index].al.picUrl);
  // 展示歌词
  showLrc();
  // 显示选中音乐
  selectSong();
  // 显示进度条动画
  setInterval(present, 500); //每0.5秒计算进度条长度
}

// 展示歌词
function showLrc() {
  // 根据ID请求歌词
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "lyric",
      id: songList.hotSongs[index].id
    },
    success: function(response) {
      var lyr = response.lrc;
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

// 展示歌曲列表
function showSongList() {
  if ($('#songList tr').length > songList.hotSongs.length) {
    return;
  }
  for(var i = 0;i < songList.hotSongs.length;i++) {
    var nameTd = '<td>' + songList.hotSongs[i].name + '</td>';
    var artistTd = '<td>' + songList.artist + '</td>';
    $('#songList').append('<tr>' + nameTd + artistTd + '</tr>');
    $('#songList tr').last().attr('index',i).click(function() {
      index = parseInt($(this).attr('index'));
      songPlay();
    });
  }
}

// 歌曲列表选中
function selectSong() {
  for(var i = 0;i < songList.hotSongs.length;i++) {
    if($("[index=" + i + "]").attr('class') === "on") {
      $("[index=" + i + "]").attr('class','');
    }
    $("[index=" + index + "]").attr('class','on');
  }
}


$(document).ready(function() {
  // 获取歌手id
  artistId = parseInt(localStorage.artistId);
  // 获取歌曲索引
  index = parseInt(localStorage.songIndex);
  
  // 获取音乐并播放
  // getMusic(artistId);

  // 音乐可视化
  visualM();


  // 界面元素拖放
  // var app = $('.app').children();
  // for (var i = 0;i < app.length;i++) {
  //   drag(app[i]);
  // }
});
