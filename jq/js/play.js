var myAudio = $("#audio")[0]; // 音频源
var index = 0; // 音乐索引
var artistId; // 歌手ID
var lyricArr = [];
var random = false;
var commentTimer;

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
  // 判断是否列表随机
  if (random === true) {
    index = Math.floor(Math.random() * songList.hotSongs.length);
  } else {
    index++;
  }
  $(".play").click();
  $('.bigCD').animate({
    left: '-300px',
    top: '-400px'
  },1000,updateUI);
  $('.bigCD').animate({
    left: '0',
    top: '0'
  },1000,songPlay);
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
  $(".play").click();
  $('.bigCD').animate({
    left: '-300px',
    top: '-400px'
  },1000,updateUI);
  $('.bigCD').animate({
    left: '0',
    top: '0'
  },1000,songPlay);
});

// 评论按钮
$(".commentBtn").click(function() {
  if ($(this).children().hasClass("fa-commenting-o")) {
    $(this)
      .children()
      .removeClass("fa-commenting-o")
      .addClass("fa-commenting");
      songComments();
  } else {
    $(this)
      .children()
      .removeClass("fa-commenting")
      .addClass("fa-commenting-o");
      clearTimeout(commentTimer);
  }
})

// 锁定播放器按钮
$('.lock').click(function() {
  if ($(this).children().hasClass("fa-unlock")) {
    $(this)
      .children()
      .removeClass("fa-unlock")
      .addClass("fa-lock");
      $('.app-container').unbind('mouseenter mouseleave');
  } else {
    $(this)
      .children()
      .removeClass("fa-lock")
      .addClass("fa-unlock");
      activePlayer();
  }
})

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



// 播放
function play() {
  // 改变播放按钮为暂停
  $(".play")
    .children()
    .removeClass("fa-play-circle")
    .addClass("fa-pause-circle");
  // 操纵杆
  $("#cao").css('transform','rotate(0deg)');
  // 专辑动画
  $(".album-pic").css("animation-play-state", "running");
  $(".bigCD").css("animation-play-state", "running");
  
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

// 热歌列表对象
var songList = new Object();
//获取歌手热歌信息
function getMusic(id) {
  // 清空评论
  clearTimeout(commentTimer);
  //发送请求根据歌手ID获取热歌
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
      songList.artist = response.artist.name;
      // 更新UI
      updateUI();
      // cd动画
      $('.de').animate({
        top: '20px'
      },3000,function() {
        songPlay();
        // 播放器动画
        $('.app-container').animate({
          bottom: '0'
        });
      });
      
    }
  });
}

// 播放歌曲
function songPlay(){
  clearTimeout(commentTimer);
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "song",
      id: songList.hotSongs[index].id
    },
    success: function(response) {
      // 设置音乐url
      $("#audio").attr("src", response.data[0].url);
      play();
    }
  });
}

// 歌曲评论
function songComments() {
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    data: {
      type: 'comments',
      id: songList.hotSongs[index].id
    },
    dataType: "json",
    success: function (response) {
      var commentsList = response.hotComments;
      var i = 0;
      var addComments = function () {
        $('div').filter('.comment').last().fadeOut();
        if (i > 20) {
          return;
        }
        // 添加评论元素
        var commentItem = '<div class="comment">' + commentsList[i].content + '</div>';
        $('.app').append(commentItem);
        var commentTop = Math.random() * 50 + '%';
        var commentLeft = Math.random() * 80 + '%';
        $('div').filter('.comment').last().css(
          {'top': commentTop,
          'left': commentLeft
        }).mouseenter(function() {
          clearTimeout(commentTimer);
        }).mouseleave(function() {
          addComments();
        })
        
        i++;
        commentTimer = setTimeout(addComments,2000);
      }
      addComments();
    }
  });
}

// 根据歌区搜索MV
function searchMV() {
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    data: {
      type: "mv",
      id: songList.hotSongs[index].mv
    },
    dataType: "json",
    success: function (response) {
      console.log(response.data.brs[480]);
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





function activePlayer() {
  $('.app-container').mouseenter(function() {
    $(this).css('bottom','0');
  }).mouseleave(function() {
    $(this).css('bottom','-45px');
  })

}

$(document).ready(function() {
  
  // 获取音乐并播放
  // getMusic(artistId);

  // 音乐可视化
  // visualM();

  activePlayer()

  // 界面元素拖放
  // var app = $('.app').children();
  // for (var i = 0;i < app.length;i++) {
  //   drag(app[i]);
  // }
});
