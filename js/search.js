// 搜索框

// 搜索提示
$('#search').on('input',function() {
  if(this.value == "") {
    $('.artistlist').slideUp('fast');
  }
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    data: {
      type: "search",
      s: this.value,
      search_type: 100
    },
    dataType: "json",
    success: function (response) {
      if(response.code === 400) {
        return;
      }
      $('.artistlist ul').empty();
      $('.artistlist').slideDown('fast');
      
      var artistlist = response.result.artists;
      for (var i = 0;i < 5;i++) {
        var listImage = '<img ' + 'src=' + artistlist[i].img1v1Url + '>'
        var listItem = '<li>' + listImage + artistlist[i].name + '</li>'
        $('.artistlist ul').append(listItem);
        $('.artistlist li').last().click(function() {
          $('#search').val($(this).text()); 
        })
      }
    }
  });
})

// 搜索按钮
$('#searchDiv i').click(function() {
  searchArtist($('#search').val());
  // 置零index
  index = 0;
  // 清空歌曲列表
  $('#songList').empty();
  $('.artistlist').slideUp('fast');
})

// 如果输入回车则开始搜索
$('#search').keyup(function(e) {
  if(e.keyCode == 13 ){
    searchArtist(this.value);
    // 置零index
    index = 0;
    // 清空歌曲列表
    $('#songList').empty();
    $('.artistlist').slideUp('fast');
  }
})

$('#search').focus(function() {
  if (this.value == "") {
    return;
  }
  $('.artistlist').slideDown('fast');
})
$('#search').blur(function() {
  $('.artistlist').slideUp('fast');
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
      localStorage.artistId = artistId;
      // 根据歌手ID获取热歌
      getMusic(parseInt(artistId));

    }
  })
}