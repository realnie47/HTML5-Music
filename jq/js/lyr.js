//歌词按钮
$(".lrc").click(function() {
  if ($(this).children().hasClass("fa-file-text-o")) {
    $(this)
      .children()
      .removeClass("fa-file-text-o")
      .addClass("fa-file-text");
  } else {
    $(this)
      .children()
      .removeClass("fa-file-text")
      .addClass("fa-file-text-o");
  }
  $("#musicLyric").fadeToggle();
});

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
// 显示歌词
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