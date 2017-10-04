// 歌曲列表按钮
$(".list").click(function() {
  // 展示歌曲列表
  showSongList();
  $('#musicAlbum').fadeToggle();
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


// 展示歌曲列表
function showSongList() {
  if ($('#songList tr').length > songList.hotSongs.length) {
    return;
  }
  for(var i = 0;i < songList.hotSongs.length;i++) {
    // 循环添加列表项
    var nameTd = '<td>' + songList.hotSongs[i].name + '</td>';
    var artistTd = '<td>' + songList.artist + '</td>';
    $('#songList').append('<tr>' + nameTd + artistTd + '</tr>');
    // 为每首歌添加点击事件
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