import Player from './components/play/play.js'
var artistId;
var index = 0;

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

      getMusic();
    }
  })
}

var songList = new Object();

function getMusic() {
  //发送请求根据歌手ID获取热歌
  $.ajax({
    type: "GET",
    url: "https://api.imjad.cn/cloudmusic/",
    dataType: "json",
    data: {
      type: "artist",
      id: artistId
    },
    success: function(response) {
      // 获取数据
      songList.hotSongs = response.hotSongs;
      songList.artist = response.artist.name;
      
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
      // 设置音乐url
      $("#audio").attr("src", response.data[index].url);

      // 自动播放
      Player.beginPlay();
    }
  });
}

export {searchArtist,getMusic,index}