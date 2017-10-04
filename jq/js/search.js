// 搜索并获取数据

// 点击搜索按钮进行搜索
$('#searchDiv i').click(function() {
  // 没有输入内容则直接返回
  if ($('#search').val() === '') {
    alert(1);
    return;
  }
  // 开始搜索
  searchArtist($('#search').val());
  // 置零index
  index = 0;
  // 清空歌曲列表
  $('#songList').empty();
})

// 如果输入回车则开始搜索
$('#search').keyup(function(e) {
  if(e.keyCode == 13 ){
    searchArtist(this.value);
    // 置零index
    index = 0;
    // 清空歌曲列表
    $('#songList').empty();
  }
})

// 搜索
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
      // 存储歌手id
      localStorage.artistId = artistId;
      // 根据歌手ID获取热歌
      getMusic(parseInt(artistId));
      //搜索框动画 
      $('#searchDiv').animate({
        top: '500px',
        left: '20px',
      },'slow');
    }
  })
}

